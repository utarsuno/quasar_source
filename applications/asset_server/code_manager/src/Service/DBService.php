<?php declare(strict_types=1);

namespace CodeManager\Service;

use function array_key_exists;
use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\Abstractions\AbstractRepo;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Repository\CodeManager\RepoSnapshotDB;
use CodeManager\Repository\Finance\RepoAssetFlow;
use CodeManager\Repository\Users\RepoEntityEntity;
use CodeManager\Service\Feature\AbstractFactoryService;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\Utils\Process\ProcessDoctrine as DOCTRINE;
use RuntimeException;

/**
 * @Service
 */
class DBService extends AbstractFactoryService {
    use TraitFlagTable;
    use TraitEnvironmentVariablesAsFields;

    private const FLAG_HEALTHY_DB_MAPPING = 'db_entity_mapping';
    private const FLAG_HEALTHY_DB_SCHEMA  = 'db_schema';
    private const FLAG_DB_SCHEMA_UPDATED  = 'db_schema_was_updated';

    private $new_db_snapshot_entity_created = false;

    private $db_connection;

    /** @var EntityManagerInterface */
    private $entity_manager;

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var array $repos */
    private $repos     = [];

    /** @var RepoSnapshotDB $repo_db_snapshot */
    private $repo_db_snapshot;

    /** @var EntitySnapshotDB $db_snapshot */
    private $db_snapshot;

    /** @var DOCTRINE $cached_doctrine_cmd_results */
    private $cached_doctrine_cmd_results;

    /** @var bool */
    private $env_db_checks;
    /** @var bool */
    private $env_db_checks_forced;
    /** @var string $env_path_transactions_file */
    private $env_path_transactions_file;

    /**
     * @param LoggerService          $logger
     * @param EntityManagerInterface $entity_manager
     */
    public function __construct(LoggerService $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->envs_set_as_bool(['DB_CHECKS' => 'env_db_checks', 'DB_CHECKS_FORCED' => 'env_db_checks_forced']);
        $this->envs_set_as_str(['DB_DATA_CSV' => 'env_path_transactions_file']);
        $this->entity_manager = $entity_manager;
    }

    public function __destruct() {
    }

    public function update_db_schema(): void {
        #$result = DOCTRINE::execute_update_and_return_object();
        if ($this->cached_doctrine_cmd_results === null) {
            $this->cached_doctrine_cmd_results = DOCTRINE::execute_update_and_return_object();
        }

        #var_dump('HERE IS THE OUTPUT OF DOCTRINE!');
        #var_dump($output);

        // Set to true only after actual schema update to ensure no exception was thrown for it.
        //$this->db_snapshot->set_did_db_schema_update(true);
    }

    /**
     * @return EntitySnapshotDB
     */
    public function get_db_snapshot(): EntitySnapshotDB {
        return $this->db_snapshot;
    }

    public function build_step0_LazyLoad(): void {
        $this->db_connection    = $this->entity_manager->getConnection();
        $this->repo_db_snapshot = $this->get_repo(RepoSnapshotDB::class);
        $this->queries_schema   = $this->repo_db_snapshot->get_queries_db_schema();
    }

    public function build_step1_MetaData_Analysis(): void {
        [$this->db_snapshot, $this->new_db_snapshot_entity_created] = $this->repo_db_snapshot->get_db_snapshot($this->service_logger, $this->cached_doctrine_cmd_results);
        if ($this->new_db_snapshot_entity_created) {
            $this->log('A new SnapshotDB was created');
        }
    }

    public function build_step1_on_failed(): void {
        #$last_exception = $this->build_step->get_last_exception();
        #var_dump($last_exception);

        var_dump('BUILD STEP 0 FAILED!');
        var_dump($this->build_step->get_last_exception()->getMessage());
        #$this->update_db_schema();
        #$this->env_db_checks_forced = true;
        #$this->build_step1_MetaData_Analysis();
    }

    public function build_step2_DB_Health_Check(): void {
        if ($this->new_db_snapshot_entity_created && $this->env_db_checks) {
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

    public function build_step3_DB_Snapshot_Entity(): void {
        if ($this->new_db_snapshot_entity_created) {
            $this->db_snapshot->set_did_db_schema_update(false);
            if ($this->flag_is_off(self::FLAG_HEALTHY_DB_SCHEMA)) {
                $this->update_db_schema();
            }
            $this->repo_db_snapshot->save_entity($this->db_snapshot, true);
        }
    }

    public function build_step4_Finance_Data_Processing(): void {
        /** @var RepoAssetFlow $repo_cash_flows */
        #$repo_cash_flows = $this->get_repo(RepoAssetFlow::class);
        /** @var RepoEntityEntity $repo_users $repo_users */
        #$repo_users      = $this->get_repo(RepoEntityEntity::class);
        /** @var EntityEntity $user_base */
        #$user_base       = $repo_users->find_user_match($this, 'vlad');
        #$repo_cash_flows->parse_bank_transactions_for($user_base, $this->env_path_transactions_file);
    }

    /**
     * @return bool
     */
    public function is_schema_valid(): bool {
        return $this->flag_is_on(self::FLAG_HEALTHY_DB_MAPPING) && $this->flag_is_on(self::FLAG_HEALTHY_DB_SCHEMA);
    }

    // ------------------------------------------------ G E T T E R S ------------------------------------------------

    /**
     * @return Connection
     */
    public function get_db_connection(): Connection {
        return $this->db_connection;
    }

    // ------------------------------------------------ D B T A B L E S ------------------------------------------------

    /**
     * @param  string $db_table_name
     * @return DBTable
     */
    public function get_db_table_by_name(string $db_table_name): DBTable {
        return $this->queries_schema->get_db_table($db_table_name);
    }

    // ----------------------------------------- I N T E R F A C E {OwnsRepo} ------------------------------------------

    /**
     * @param  string $repo_key
     * @return ObjectRepository
     */
    public function get_repo(string $repo_key): ObjectRepository {
        if (!array_key_exists($repo_key, $this->repos)) {
            /** @var AbstractRepo $repo_key */
            $entity_class           = $repo_key::ENTITY_CLASS;
            /** @noinspection PhpUndefinedFieldInspection */
            $this->repos[$repo_key] = $this->entity_manager->getRepository($entity_class);
            $repo                   = $this->repos[$repo_key];
            if ($repo instanceof QueryableRepo) {
                $repo->set_db_service($this);
            }
            return $repo;
        }
        return $this->repos[$repo_key];
    }

}
