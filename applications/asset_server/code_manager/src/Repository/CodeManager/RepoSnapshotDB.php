<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Service\LoggerService;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\SQL\DBSchema;
use QuasarSource\Utils\Process\ProcessDoctrine;
use QuasarSource\Utils\Time\UtilsUnixTime as TIME;

/**
 * Class RepoSnapshotDB
 * @package CodeManager\Repository\CodeManager
 */
class RepoSnapshotDB extends QueryableRepo {
    use TraitEnvironmentVariablesAsFields;

    public const ENTITY_CLASS = EntitySnapshotDB::class;

    /** @var string */
    private $env_db_name;

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var RepoCodeBuild $repo_code_builds */
    private $repo_code_builds;

    /**
     * @param LoggerService        $logger
     * @param ProcessDoctrine|null $doctrine
     * @return array
     */
    public function get_db_snapshot(LoggerService $logger, ProcessDoctrine $doctrine=null): array {
        // $latest_db_snapshot_data[0] --> id
        // $latest_db_snapshot_data[5] --> latest_schema_updated
        // $latest_db_snapshot_data[2] --> latest_snapshot_time
        // $latest_db_snapshot_data[4] --> latest_size

        if ($this->get_db_table()->has_rows()) {
            $this->get_db_table()->set_sort_field_time('unix_timestamp0');
            $latest_db_snapshot_data = $this->get_db_table()->execute_get_latest();
            if ($doctrine === null && !$latest_db_snapshot_data[5]) {
                $delta = TIME::delta_to_now_in_hours($latest_db_snapshot_data[2]);
                if (($delta < 4.0) && $latest_db_snapshot_data[4] === $this->queries_schema->get_size(false)) {
                    if ($this->repo_code_builds->is_empty()) {
                        $logger->log('TODOISH: There are no code builds so can\'t check for any error reports, skipping creation of new SnapshotDB.');
                        $this->repo_code_builds->sync_to_logs();
                    } else {
                        var_dump('TODO: CHECK THE LOGS OF THIS BUILD, LOOK FOR ANY ERROR REPORTS!');
                        var_dump('TODO: CHECK THE LOGS OF THIS BUILD, LOOK FOR ANY ERROR REPORTS!');
                        var_dump('TODO: CHECK THE LOGS OF THIS BUILD, LOOK FOR ANY ERROR REPORTS!');
                    }
                    /** @var EntitySnapshotDB $match */
                    $match = $this->get_entity_by_id($latest_db_snapshot_data[0]);
                    return [$match, false];
                }
                $logger->log(
                    $delta < 4.0 ?
                        'Previous SnapshotDB is more than 4 hours old, so creating a new one.' :
                        'Previous SnapshotDB had a different size than current, so creating a new one.'
                );
                return [$this->create_new_db_snapshot($doctrine), true];
            }
            $logger->log(
                $doctrine === null ?
                    'Previous SnapshotDB had a schema update so creating new SnapshotDB to check for new updates.' :
                    'The current build has schema updates so creating a new SnapshotDB.'
            );
            return [$this->create_new_db_snapshot($doctrine), true];
        }
        $logger->log('No SnapshotDBs exist, creating a new one.');
        return [$this->create_new_db_snapshot($doctrine), true];
    }

    /**
     * @param  ProcessDoctrine|null $doctrine
     * @return EntitySnapshotDB
     */
    private function create_new_db_snapshot(ProcessDoctrine $doctrine=null): EntitySnapshotDB {
        $entity = new EntitySnapshotDB();
        // TODO: If full build mode, then calculate and attach the full DB Snapshot table report.
        $entity->set_timestamp(-1)
            ->set_size_in_bytes($this->queries_schema->get_size(false))
            ->set_num_tables($this->queries_schema->get_num_created_tables());
        if ($doctrine !== null) {
            $entity->set_schema_command_output('|||' . json_encode($doctrine->get_output()) . '|||' . json_encode($doctrine->get_error_output()) . '|||');
        }
        $this->save_entity($entity, true);
        return $entity;
    }

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
        $db_connection          = $this->db_service->get_db_connection();
        $this->queries_schema   = new DBSchema($this->env_db_name, $db_connection);
        $this->repo_code_builds = $this->db_service->get_repo(RepoCodeBuild::class);
    }
}
