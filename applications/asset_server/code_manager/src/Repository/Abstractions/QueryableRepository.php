<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Service\DBService;
use QuasarSource\SQL\DBTable;
use QuasarSource\SQL\Representation\InterfaceSQLQueryOwner;
use QuasarSource\SQL\Representation\SQLQuery;

/**
 * Class QueryableRepository
 * @package CodeManager\Repository\Abstractions
 */
abstract class QueryableRepository extends AbstractRepository implements InterfaceSQLQueryOwner {

    /** @var DBTable $db_table */
    protected $db_table;

    /**
     * @param DBService $db_service
     * @param string    $entity_class
     */
    protected function set_db_table(DBService $db_service, string $entity_class): void {
        /** @var AbstractEntity $entity_class */
        if (!isset($entity_class::$db_table_name)) {
            throw new \RuntimeException('{' . $entity_class . '} does not have a table name public const set.');
        }
        $this->db_table = $db_service->get_db_table_by_name($entity_class::$db_table_name);
        if (isset($entity_class::$sort_field_time)) {
            $this->db_table->set_sort_field_time($entity_class::$sort_field_time);
        }
    }

    /**
     * @param  string $query
     * @return SQLQuery
     */
    protected function raw_query(string $query): SQLQuery {
        $sql = new SQLQuery($this);
        $sql->raw_set($query);
        return $sql;
    }

    /**
     * @param  string $query
     * @return mixed|mixed[]
     */
    protected function execute_custom_query(string $query) {
        return $this->db_table->execute_custom($this->raw_query($query));
    }

    # ----------------------------------- C O N T R A C T {InterfaceSQLQueryOwner} -----------------------------------
    /**
     * @param  string $key
     * @return mixed
     */
    public function get_attribute(string $key) {
        return $this->db_table->get_attribute($key);
    }

}
