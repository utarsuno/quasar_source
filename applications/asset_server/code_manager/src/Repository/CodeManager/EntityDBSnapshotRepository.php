<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntityDBSnapshot;
use CodeManager\Repository\Abstractions\AbstractRepository;
use CodeManager\Service\DBService;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\Utilities\Time\UtilsUnixTime as TIME;

/**
 * Class EntityDBSnapshotRepository
 * @package CodeManager\Repository\CodeManager
 */
class EntityDBSnapshotRepository extends AbstractRepository {

    /** @var DBTable $db_table */
    private $db_table;

    /**
     * @param  DBSchema  $db_schema
     * @param  DBService $db_service
     * @return array
     */
    public function get_db_snapshot(DBSchema $db_schema, DBService $db_service): array {
        $current_db_size = $db_schema->execute_get_size(false);
        if ($this->db_table === null) {
            $this->db_table = $db_service->get_db_table_by_name(EntityDBSnapshot::get_db_table_name());
            $this->db_table->set_sort_field_time(EntityDBSnapshot::$sort_field_time);

            if ($this->db_table->has_rows()) {
                $latest_db_snapshot_data = $this->db_table->execute_get_latest();
                $latest_snapshot_time    = $latest_db_snapshot_data[2];
                $latest_size             = $latest_db_snapshot_data[4];
                $latest_schema_updated   = $latest_db_snapshot_data[5];
                #var_dump($latest_schema_updated);
                #var_dump($latest_size === $current_db_size);
                $delta = TIME::delta_to_now_in_hours($latest_snapshot_time);
                #var_dump($delta);
                if (!$latest_schema_updated && $latest_size === $current_db_size && $delta < 4.0) {
                    /** @var EntityDBSnapshot $match */
                    $match = $this->findOneBy(['id' => $latest_db_snapshot_data[0]]);
                    return [$match, false];
                }
            }
        }
        return [$this->create_new_db_snapshot($db_schema), true];
    }

    /**
     * @param  DBSchema $db_schema
     * @return EntityDBSnapshot
     */
    private function create_new_db_snapshot(DBSchema $db_schema): EntityDBSnapshot {
        $table_report = [];
        $tables       = $db_schema->get_all_db_tables();
        /** @var DBTable $table */
        foreach ($tables as $name => $table) {
            $table_report[$name] = $table->execute_get_size(false);
        }
        $entity = new EntityDBSnapshot();
        return $entity->set_timestamp(-1)
            ->set_size_in_bytes($db_schema->execute_get_size(false))
            ->set_num_tables($db_schema->execute_num_created_tables())
            ->set_report($table_report);
    }
}
