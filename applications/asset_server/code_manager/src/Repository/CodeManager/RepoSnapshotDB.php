<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Repository\Abstractions\SingleEntityRepo;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\SQL\DBSchema;
use QuasarSource\Utils\Process\ProcessDoctrine;
use QuasarSource\Utils\Time\UtilsUnixTime as TIME;

/**
 * Class RepoSnapshotDB
 * @package CodeManager\Repository\CodeManager
 */
class RepoSnapshotDB extends SingleEntityRepo {
    use TraitEnvironmentVariablesAsFields;

    public const ENTITY_CLASS = EntitySnapshotDB::class;

    /** @var string */
    private $env_db_name;

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var RepoCodeBuild $repo_code_builds */
    private $repo_code_builds;

    /**
     * @return array
     */
    public function get_snapshot_db_table_report(): array {
        return $this->queries_schema->get_table_names_and_sizes();
    }

    /**
     * @return DBSchema
     */
    public function get_queries_db_schema(): DBSchema {
        return $this->queries_schema;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------

    public function set_needed_repos(): void {
        $this->envs_set_as_str(['DB_NAME' => 'env_db_name']);
        $this->queries_schema   = new DBSchema($this->env_db_name, $this->db_service->get_db_connection());
        $this->repo_code_builds = $this->db_service->get_repo(RepoCodeBuild::class);
    }

    /**
     * @param  array|null $prev_entity_data
     * @return AbstractEntity
     */
    protected function set_current_entity(array $prev_entity_data=null): AbstractEntity {
        if ($prev_entity_data === null) {
            $this->logger->log('No SnapshotDBs exist, creating a new one.');
            return $this->create_new_db_snapshot();
        }

        $doctrine = $this->db_service->get_doctrine_process();

        var_dump($prev_entity_data);
        // 0 -> id, 1 -> report, 2 -> schema_updated, 3 -> cmd_schema_output, 4 -> size_in_bytes, 5 -> cmd_schema_errors
        // 6 -> migration_version, 7 -> number_of_tables, 8 -> timestamp

        if ($doctrine === null && !$prev_entity_data[2]) {
            $delta = TIME::delta_to_now_in_hours($prev_entity_data[8]);
            if ($delta < 4.0) {
                if ($this->repo_code_builds->is_empty()) {
                    $this->logger->log('TODOISH: There are no code builds so can\'t check for any error reports, skipping creation of new SnapshotDB.');
                    $this->repo_code_builds->sync_to_logs();
                } else {
                    $schema_update_cmd_output = $prev_entity_data[3];
                    if ($schema_update_cmd_output === null) {
                        $this->logger->log('No DB Changes, skipping creation of new SnapshotDB.');
                        return $this->re_use_previous_entity((int) $prev_entity_data[0]);
                    }
                    var_dump($prev_entity_data);
                    var_dump('TODO: CHECK THE LOGS OF THIS BUILD, LOOK FOR ANY ERROR REPORTS!');
                    var_dump('TODO: CHECK THE LOGS OF THIS BUILD, LOOK FOR ANY ERROR REPORTS!');
                    var_dump('TODO: CHECK THE LOGS OF THIS BUILD, LOOK FOR ANY ERROR REPORTS!');
                }
                $this->logger->log('Previous build logs non-existent or all clean so no new SnapshotDB will be created.');
                return $this->re_use_previous_entity((int) $prev_entity_data[0]);
            }
            $this->logger->log('Previous SnapshotDB is more than 4 hours old, so creating a new one.');
            return $this->create_new_db_snapshot($doctrine);
        }
        $this->logger->log(
            $doctrine === null ?
                'Previous SnapshotDB had a schema update so creating new SnapshotDB to check for new updates.' :
                'The current build has schema updates so creating a new SnapshotDB.'
        );
        return $this->create_new_db_snapshot($doctrine);
    }

    /**
     * @param  ProcessDoctrine|null $doctrine
     * @return AbstractEntity
     */
    private function create_new_db_snapshot(ProcessDoctrine $doctrine=null): AbstractEntity {
        $this->mark_current_entity_as_created(new EntitySnapshotDB());
        /** @var EntitySnapshotDB $entity */
        $entity = $this->current_entity;
        // TODO: If full build mode, then calculate and attach the full DB Snapshot table report.
        $entity->set_timestamp(-1)
            ->set_size_in_bytes($this->queries_schema->get_size())
            ->set_number_of_tables($this->queries_schema->get_num_created_tables());
        if ($doctrine !== null) {
            $entity->set_schema_command_output('|||' . json_encode($doctrine->get_output()) . '|||' . json_encode($doctrine->get_error_output()) . '|||');
        }
        $this->save_entity($entity, true);
        $this->logger->log('A new SnapshotDB Entity was created with timestamp{' . $entity->get_timestamp() . '}');
        return $entity;
    }

    /**
     * @param ProcessDoctrine|null $doctrine
     */
    private function parse_doctrine_results(ProcessDoctrine $doctrine=null): void {
        if ($doctrine !== null) {
            $errors = json_encode($doctrine->get_error_output());
            $output = json_encode($doctrine->get_output());
            /** @var EntitySnapshotDB $e */
            $e = $this->current_entity;
            $e->set_schema_command_output($output);
            $e->set_schema_error_command_output($errors);
        }
    }
}
