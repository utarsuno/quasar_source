<?php declare(strict_types=1);

namespace CodeManager\Service;

use function array_key_exists;
use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Entity\Finance\EntityCashFlow;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\CodeManager\RepoSnapshotDB;
use CodeManager\Repository\Finance\Bank\RepoBankTransaction;
use CodeManager\Repository\Finance\RepoCashFlow;
use CodeManager\Repository\Users\RepoEntityEntity;
use CodeManager\Service\Feature\AbstractService;
use CodeManager\Service\Feature\Repository\OwnsReposInterface;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\DataStructure\BuildStep\BuildStep;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\Utilities\Process\Doctrine\ProcessDoctrine as DOCTRINE;
use RuntimeException;

/**
 * @Service
 */
class DBService extends AbstractService implements OwnsReposInterface {
    use TraitFlagTable;
    use TraitEnvironmentVariablesAsFields;

    private const FLAG_HEALTHY_DB_MAPPING = 'db_entity_mapping';
    private const FLAG_HEALTHY_DB_SCHEMA  = 'db_schema';
    private const FLAG_DB_SCHEMA_UPDATED  = 'db_schema_was_updated';

    public static $singleton;

    private $new_db_snapshot_entity_created = false;

    /**
     * @param  int $id
     * @param  string $entity_class
     * @return object|null
     */
    public static function get_entity(int $id, string $entity_class) {
        $repo = self::$singleton->get_repo($entity_class);
        return $repo->findOneBy(['id' => $id]);
    }

    /** @var CodeBuilderService */
    private $code_builder;

    /** @var EntityManagerInterface */
    private $entity_manager;

    /** @var array */
    private $entity_repos = [];

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var RepoSnapshotDB $repo_db_snapshot */
    private $repo_db_snapshot;

    /** @var EntitySnapshotDB $db_snapshot */
    private $db_snapshot;

    /** @var Connection $db_connection */
    private $db_connection;

    /** @var array $cached_db_tables */
    private $cached_db_tables;

    /** @var string */
    private $env_db_name;

    /** @var bool */
    private $env_db_checks;

    /** @var bool */
    private $env_db_checks_forced;

    /**
     * @param LoggerService          $logger
     * @param EntityManagerInterface $entity_manager
     */
    public function __construct(LoggerService $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->envs_set_as_bool(['DB_CHECKS' => 'env_db_checks', 'DB_CHECKS_FORCED' => 'env_db_checks_forced']);
        $this->envs_set_as_str(['DB_NAME' => 'env_db_name']);
        self::$singleton        = $this;
        $this->entity_manager   = $entity_manager;
        $this->db_connection    = $this->entity_manager->getConnection();
        $this->queries_schema   = new DBSchema($this->env_db_name, $this->db_connection);
        $this->repo_db_snapshot = $this->get_repo(RepoSnapshotDB::class);
    }

    public function __destruct() {
        $this->trait_destruct_env_vars_as_fields();
    }

    /**
     * @return EntitySnapshotDB
     */
    public function get_db_snapshot(): EntitySnapshotDB {
        return $this->db_snapshot;
    }

    /**
     * @return BuildStep
     */
    public function provide_build_step(): BuildStep {
        $step = new BuildStep('DB Health Check');

        $step->add_sub_step(
            [$this, 'build_step0'],
            'MetaData analysis',
            [$this, 'build_step0_on_failed']
        );

        $step->add_sub_step([$this, 'build_step1'], 'DB Health Check');
        $step->add_sub_step([$this, 'build_step2'], 'DB Snapshot Entity');
        $step->add_sub_step([$this, 'build_step3'], 'Finance Data Processing');
        return $step;
    }

    public function build_step0(): void {
        [$this->db_snapshot, $this->new_db_snapshot_entity_created] = $this
            ->repo_db_snapshot->get_db_snapshot($this->queries_schema, $this, $this->env_db_checks_forced);
    }

    public function build_step0_on_failed(): void {
        $this->update_db_schema();
        $this->env_db_checks_forced = true;
        $this->build_step0();
    }

    public function build_step1(): void {
        if ($this->env_db_checks_forced || ($this->new_db_snapshot_entity_created && $this->env_db_checks)) {
            [$mapping, $schema] = DOCTRINE::execute_validate_checks();
            $this->flag_set(self::FLAG_HEALTHY_DB_MAPPING, $mapping);
            $this->flag_set(self::FLAG_HEALTHY_DB_SCHEMA, $schema);
        } else {
            $this->log('Skipping DB health checks!');
            $this->flags_set_all(
                [self::FLAG_HEALTHY_DB_MAPPING, self::FLAG_HEALTHY_DB_SCHEMA],
                true
            );
        }
        if ($this->flag_is_off(self::FLAG_HEALTHY_DB_MAPPING)) {
            throw new RuntimeException('DB Mapping is NOT healthy');
        }
    }

    public function build_step2(): void {
        if ($this->new_db_snapshot_entity_created) {
            $this->db_snapshot->set_did_db_schema_update(false);
            if ($this->flag_is_off(self::FLAG_HEALTHY_DB_SCHEMA)) {
                $this->update_db_schema();
            }
            $this->repo_db_snapshot->save_entity($this->db_snapshot, true);
        }
    }

    private function update_db_schema(): void {
        DOCTRINE::execute_update();
        // Set to true only after actual schema update to ensure no exception was thrown for it.
        $this->db_snapshot->set_did_db_schema_update(true);
    }

    public function build_step3(): void {
        /** @var RepoCashFlow $repo_cash_flows */
        $repo_cash_flows   = $this->get_repo(RepoCashFlow::class);
        /** @var RepoEntityEntity $repo_users $repo_users */
        $repo_users        = $this->get_repo(RepoEntityEntity::class);
        /** @var RepoBankTransaction $repo_transactions */
        $repo_transactions = $this->get_repo(RepoBankTransaction::class);
        /** @var EntityEntity $user_base */
        $user_base         = $repo_users->find_user_match($this, 'vlad');
        $repo_transactions->parse_transactions_file($this, $user_base, $repo_users, $repo_cash_flows);
    }

    /**
     * @return bool
     */
    public function is_schema_valid(): bool {
        return $this->flag_is_on(self::FLAG_HEALTHY_DB_MAPPING) && $this->flag_is_on(self::FLAG_HEALTHY_DB_SCHEMA);
    }

    // ------------------------------------------------ D B T A B L E S ------------------------------------------------

    /**
     * @return array
     */
    public function get_all_db_tables(): array {
        $this->ensure_all_db_tables_set();
        return $this->cached_db_tables;
    }

    /**
     * @param  string $db_table_name
     * @return DBTable
     */
    public function get_db_table_by_name(string $db_table_name): DBTable {
        $this->ensure_all_db_tables_set();
        return $this->cached_db_tables[$db_table_name];
    }

    private function ensure_all_db_tables_set(): void {
        if ($this->cached_db_tables === null) {
            $table_names            = $this->queries_schema->execute_names_of_created_tables();
            $this->cached_db_tables = [];
            foreach ($table_names as $table_name) {
                $this->cached_db_tables[$table_name] = new DBTable($table_name, $this->db_connection);
            }
        }
    }

    // ----------------------------------------- I N T E R F A C E {OwnsRepo} ------------------------------------------

    /**
     * @param  string $repo_key
     * @return ObjectRepository
     */
    public function get_repo(string $repo_key): ObjectRepository {
        if (!array_key_exists($repo_key, $this->entity_repos)) {
            #$this->entity_repos[$repo_key] = $this->entity_manager->getRepository(self::REPO_TO_ENTITY[$repo_key]);
            /** @noinspection PhpUndefinedFieldInspection */
            $this->entity_repos[$repo_key] = $this->entity_manager->getRepository($repo_key::ENTITY_CLASS);
        }
        return $this->entity_repos[$repo_key];
    }

}
