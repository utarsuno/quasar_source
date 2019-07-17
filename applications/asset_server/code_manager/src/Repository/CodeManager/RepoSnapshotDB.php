<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntitySnapshotDB;
use CodeManager\Repository\Abstractions\QueryableRepository;
use CodeManager\Service\DBService;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\Utilities\Time\UtilsUnixTime as TIME;

/**
 * Class RepoSnapshotDB
 * @package CodeManager\Repository\CodeManager
 */
class RepoSnapshotDB extends QueryableRepository {

    public const ENTITY_CLASS = EntitySnapshotDB::class;

    /**
     * @param  DBSchema  $db_schema
     * @param  DBService $db_service
     * @param  bool      $forced_checks
     * @return array
     */
    public function get_db_snapshot(DBSchema $db_schema, DBService $db_service, bool $forced_checks): array {
        if ($this->db_table === null && $forced_checks !== true) {
            $this->set_db_table($db_service, EntitySnapshotDB::class);
            #$this->db_table = $db_service->get_db_table_by_name(EntityDBSnapshot::get_db_table_name());
            #$this->db_table->set_sort_field_time(EntityDBSnapshot::$sort_field_time);

            if ($this->db_table->has_rows()) {
                $current_db_size         = $db_schema->execute_get_size(false);
                $latest_db_snapshot_data = $this->db_table->execute_get_latest();
                $latest_snapshot_time    = $latest_db_snapshot_data[2];
                $latest_size             = $latest_db_snapshot_data[4];
                $latest_schema_updated   = $latest_db_snapshot_data[5];
                $delta                   = TIME::delta_to_now_in_hours($latest_snapshot_time);
                if (!$latest_schema_updated && $latest_size === $current_db_size && $delta < 4.0) {
                    /** @var EntitySnapshotDB $match */
                    $match = $this->get_entity_by_id($latest_db_snapshot_data[0]);
                    return [$match, false];
                }
            }
        }
        return [$this->create_new_db_snapshot($db_schema, $db_service), true];
    }

    /**
     * @param  DBSchema  $db_schema
     * @param  DBService $db_service
     * @return EntitySnapshotDB
     */
    private function create_new_db_snapshot(DBSchema $db_schema, DBService $db_service): EntitySnapshotDB {
        $table_report = [];
        $tables       = $db_service->get_all_db_tables();
        /** @var DBTable $table */
        foreach ($tables as $name => $table) {
            $table_report[$name] = $table->execute_get_size(false);
        }
        $entity = new EntitySnapshotDB();
        return $entity->set_timestamp(-1)
            ->set_size_in_bytes($db_schema->execute_get_size(false))
            ->set_num_tables($db_schema->execute_num_created_tables())
            ->set_report($table_report);
    }
}
