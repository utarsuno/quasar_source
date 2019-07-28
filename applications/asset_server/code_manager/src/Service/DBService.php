<?php declare(strict_types=1);

namespace CodeManager\Service;

use function array_key_exists;
use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\Abstractions\AbstractRepo;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Repository\CodeManager\File\RepoFileType;
use CodeManager\Repository\CodeManager\RepoSnapshotDB;
use CodeManager\Repository\Finance\RepoAssetFlow;
use CodeManager\Repository\Users\RepoEntityEntity;
use CodeManager\Service\Feature\AbstractFactoryService;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\SQL\TraitDBConnection;
use QuasarSource\Utils\Process\ProcessDoctrine as DOCTRINE;
use QuasarSource\Utils\Process\ProcessDoctrine;
use RuntimeException;

/**
 * @Service
 */
class DBService extends AbstractFactoryService {
    use TraitFlagTable;
    use TraitEnvironmentVariablesAsFields;
    use TraitDBConnection;

    private const FLAG_HEALTHY_DB_MAPPING = 'db_entity_mapping';
    private const FLAG_HEALTHY_DB_SCHEMA  = 'db_schema';
    private const FLAG_DB_SCHEMA_UPDATED  = 'db_schema_was_updated';

    /** @var EntityManagerInterface */
    private $entity_manager;

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var array $repos */
    private $repos     = [];

    /** @var RepoSnapshotDB $repo_db_snapshot */
    private $repo_db_snapshot;

    /** @var DOCTRINE $cached_doctrine_cmd */
    private $cached_doctrine_cmd;

    /** @var bool */
    private $env_db_checks;
    /** @var bool */
    private $env_db_checks_forced;
    /** @var string $env_path_transactions_file */
    private $env_path_transactions_file;


    // TODO: REMOVE? This is the 'singleton' entity from repo_snapshotDB
    /** @var EntitySnapshotDB $db_snapshot */
    private $db_snapshot;


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
        var_dump('DBService destruct!');
        $this->trait_destruct_db_connection();
    }

    public function update_db_schema(): void {
        if ($this->cached_doctrine_cmd === null) {
            $this->log('DBService is running Doctrine schema update.');
            $this->cached_doctrine_cmd = DOCTRINE::execute_update_and_return_object();
        } else {
            $this->log('DBService has already ran Doctrine schema update this session.');
        }
        // Set to true only after actual schema update to ensure no exception was thrown for it.
        //$this->db_snapshot->set_did_db_schema_update(true);
    }

    public function build_step0_LazyLoad(): void {
        $this->trait_construct_db_connection($this->entity_manager);
        $this->get_repo(RepoFileType::class);
        $this->repo_db_snapshot = $this->get_repo(RepoSnapshotDB::class);
        $this->queries_schema   = $this->repo_db_snapshot->get_queries_db_schema();
    }

    public function build_step1_MetaData_Analysis(): void {
        #[$this->db_snapshot, $this->new_db_snapshot_entity_created] = $this->repo_db_snapshot->get_db_snapshot();
        #if ($this->new_db_snapshot_entity_created) {
        #    $this->log('A new SnapshotDB was created');
        #}
        $this->db_snapshot = $this->repo_db_snapshot->get_current_entity();
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
        // TODO: REMOVE FLAGS, MOVE THEM INTO MORE NICHE OBJECT!
        // TODO: REMOVE FLAGS, MOVE THEM INTO MORE NICHE OBJECT!
        // TODO: REMOVE FLAGS, MOVE THEM INTO MORE NICHE OBJECT!


        if ($this->env_db_checks && $this->repo_db_snapshot->was_current_entity_created()) {
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
        if ($this->repo_db_snapshot->was_current_entity_created()) {
            #$this->db_snapshot->set_did_db_schema_update(false);

            // TODO: CHANGE HOW THIS IS HANDLED! DBService SHOULD LIKELY NOT HOLD THESE FLAGS!
            if ($this->flag_is_off(self::FLAG_HEALTHY_DB_SCHEMA)) {
                $this->log('Flag HealthDB Schema was off so running Update DB Schema!');
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

    // ------------------------------------------------ G E T T E R S ------------------------------------------------

    /**
     * @return ProcessDoctrine|null
     */
    public function get_doctrine_process(): ?ProcessDoctrine {
        return $this->cached_doctrine_cmd;
    }

    /**
     * @return bool
     */
    public function is_schema_valid(): bool {
        return $this->flag_is_on(self::FLAG_HEALTHY_DB_MAPPING) && $this->flag_is_on(self::FLAG_HEALTHY_DB_SCHEMA);
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
