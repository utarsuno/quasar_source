<?php declare(strict_types=1);

namespace CodeManager\Service;

use function array_key_exists;
use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Repository\File\RepoFileType;
use CodeManager\Repository\CodeManager\RepoSnapshotDB;
use CodeManager\Repository\Finance\RepoAssetFlow;
use CodeManager\Repository\Users\RepoEntityEntity;
use CodeManager\Service\Feature\AbstractFactoryService;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use QuasarSource\CommonFeatures\TraitEnvVarsAsFields;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\SQL\TraitDBConnection;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\Process\ProcessRunner;
use RuntimeException;

/**
 * @Service
 */
class DBService extends AbstractFactoryService {
    use TraitFlagTable;
    use TraitEnvVarsAsFields;
    use TraitDBConnection;

    private const ROUTINE_SCHEMA_VALIDATE = ['php', './bin/console', 'doctrine:schema:validate', '-vvv'];
    private const ROUTINE_SCHEMA_UPDATE   = ['php', './bin/console', 'doctrine:schema:update', '--no-interaction', '--force', '--complete', '--dump-sql', '-vvv'];

    private const FLAG_HEALTHY_DB_MAPPING = 'db_entity_mapping';
    private const FLAG_HEALTHY_DB_SCHEMA  = 'db_schema';
    private const FLAG_DB_SCHEMA_UPDATED  = 'db_schema_was_updated';

    /** @var ProcessRunner $process_db_validate */
    private $process_db_validate;

    /** @var ProcessRunner $process_db_update */
    private $process_db_update;

    /** @var EntityManagerInterface */
    private $entity_manager;

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var array $repos */
    private $repos     = [];

    /** @var RepoSnapshotDB $repo_db_snapshot */
    private $repo_db_snapshot;

    /** @var bool */
    private $env_db_checks;
    /** @var bool */
    private $env_db_checks_forced;
    /** @var string $env_path_transactions_file */
    private $env_path_transactions_file;
    /** @var string $env_path_code_manager */
    private $env_path_code_manager;

    // TODO: REMOVE? This is the 'singleton' entity from repo_snapshotDB
    /** @var EntitySnapshotDB $db_snapshot */
    private $db_snapshot;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    /**
     * @param LoggerService          $logger
     * @param EntityManagerInterface $entity_manager
     */
    public function __construct(LoggerService $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->envs_set_as_bool(['DB_CHECKS' => 'env_db_checks', 'DB_CHECKS_FORCED' => 'env_db_checks_forced']);
        $this->envs_set_as_str(['DB_DATA_CSV' => 'env_path_transactions_file', 'PATH_DIRECTORY_CODE_MANAGER' => 'env_path_code_manager']);
        $this->entity_manager = $entity_manager;
    }

    public function __destruct() {
        $this->trait_destruct_db_connection();
        unset($this->process_db_validate, $this->process_db_update);
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    public function update_db_schema(): void {
        if ($this->process_db_update === null) {
            $this->log('DBService is running Doctrine schema update.');
            $this->process_db_update = $this->create_doctrine_cmd(self::ROUTINE_SCHEMA_UPDATE);
            $this->cmd_run_and_error_check($this->process_db_update);
        } else {
            $this->log('DBService has already ran Doctrine schema update this session.');
        }
        // Set to true only after actual schema update to ensure no exception was thrown for it.
        //$this->db_snapshot->set_did_db_schema_update(true);
    }

    public function build_step0_LazyLoad(): void {
        $this->trait_construct_db_connection($this->entity_manager);
        $this->get_repo(EntityFileType::class);
        $this->repo_db_snapshot = $this->get_repo(EntitySnapshotDB::class);
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
        if ($this->env_db_checks && $this->repo_db_snapshot->was_current_entity_created()) {
            if ($this->process_db_validate === null) {
                $this->process_db_validate = $this->create_doctrine_cmd(self::ROUTINE_SCHEMA_VALIDATE);
            }
            $this->cmd_run_and_error_check($this->process_db_validate);
            $output       = $this->process_db_validate->get_output();
            $mapping_okay = TEXT_LINES::does_line_after_pattern_contain_text($output, ['Mapping', '-------'], '[OK]');
            $this->flag_set(self::FLAG_HEALTHY_DB_MAPPING, $mapping_okay);
            if ($mapping_okay) {
                $this->log('The DB Mapping is healthy.');
                $schema_okay = TEXT_LINES::does_line_after_pattern_contain_text($output, ['Database', '--------'], '[OK]');
                $this->flag_set(self::FLAG_HEALTHY_DB_SCHEMA, $schema_okay);
                if ($schema_okay) {
                    $this->log('The DB Schema is healthy.');
                } else {
                    $this->log('The DB Schema is not healthy.');
                }
            } else {
                $this->log('The DB Mapping is not healthy.');
            }
        } else {
            $this->log('Skipping DB health checks!');
            $this->flags_set_all_on([self::FLAG_HEALTHY_DB_MAPPING, self::FLAG_HEALTHY_DB_SCHEMA]);
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
            $this->repo_db_snapshot->save($this->db_snapshot, true);
        }
    }

    public function build_step4_Finance_Data_Processing(): void {
        /** @var RepoAssetFlow $repo_cash_flows */
        #$repo_cash_flows = $this->get_repo(EntityAssetFlow::class);
        /** @var RepoEntityEntity $repo_users $repo_users */
        #$repo_users      = $this->get_repo(EntityEntity::class);
        /** @var EntityEntity $user_base */
        #$user_base       = $repo_users->find_user_match($this, 'vlad');
        #$repo_cash_flows->parse_bank_transactions_for($user_base, $this->env_path_transactions_file);
    }

    // ------------------------------------------------ G E T T E R S ------------------------------------------------

    /**
     * @return ProcessRunner|null
     */
    public function get_doctrine_process(): ?ProcessRunner {
        return $this->process_db_update;
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
     * @param  string $entity_class
     * @return ObjectRepository
     */
    public function get_repo(string $entity_class): ObjectRepository {
        if (!array_key_exists($entity_class, $this->repos)) {
            $this->repos[$entity_class] = $this->entity_manager->getRepository($entity_class);
            $this->repos[$entity_class]->set_db_service($this);
        }
        return $this->repos[$entity_class];
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  array $cmd
     * @return ProcessRunner
     */
    private function create_doctrine_cmd(array $cmd): ProcessRunner {
        return new ProcessRunner(
            $cmd,
            false,
                        $this->env_path_code_manager,
            20,
            false,
            ProcessRunner::OUTPUT_FORMAT_LINES_CLEAN
        );
    }

    /**
     * @param  ProcessRunner $cmd
     * @return void
     */
    private function cmd_run_and_error_check(ProcessRunner $cmd): void {
        $cmd->run();
        if (!$cmd->was_successful()) {
            var_dump($cmd->get_output());
            var_dump($cmd->get_error_output());
            throw new RuntimeException('Investigate db process');
        }
    }

}
