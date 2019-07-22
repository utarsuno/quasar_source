<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Service\DBService;
use QuasarSource\SQL\DBTable;
use QuasarSource\SQL\Representation\InterfaceSQLQueryOwner;
use QuasarSource\SQL\Representation\SQLQuery;
use RuntimeException;

/**
 * Class QueryableRepo
 * @package CodeManager\Repository\Abstractions
 */
abstract class QueryableRepo extends AbstractRepo implements InterfaceSQLQueryOwner {

    /** @var DBTable $db_table */
    private $db_table;

    /** @var DBService $db_service */
    protected $db_service;

    /**
     * @return bool
     */
    public function is_empty(): bool {
        return $this->get_db_table()->execute_get_num_rows() === 0;
    }

    /**
     * @param DBService $db_service
     */
    public function set_db_service(DBService $db_service): void {
        $this->db_service = $db_service;
        $this->set_needed_repos();
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

    /**
     * @return DBTable
     */
    protected function get_db_table(): DBTable {
        /*
        if ($this->db_table === null) {
            $entity_class = static::ENTITY_CLASS;
            if (!isset($entity_class::$db_table_name)) {
                throw new RuntimeException('{' . $entity_class . '} does not have a table name public const set.');
            }
            $this->db_table = $this->db_service->get_db_table_by_name($entity_class::$db_table_name);
            if (isset($entity_class::$sort_field_time)) {
                $this->db_table->set_sort_field_time($entity_class::$sort_field_time);
            }
            // TODO: Eventually investigate if it's worth having this duplicate return statement.
            // Logic of having it is that while branch prediction pains will happen, exiting the scope fully instead of
            // bubbling to the scope outside the if statement MIGHT be faster by a TINY amount lol.
            return $this->db_table;
        }
        return $this->db_table;*/
        $entity_class = static::ENTITY_CLASS;
        if (!isset($entity_class::$db_table_name)) {
            throw new RuntimeException('{' . $entity_class . '} does not have a table name public const set.');
        }
        return $this->db_service->get_db_table_by_name($entity_class::$db_table_name);
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------

    abstract public function set_needed_repos(): void;

    # ------------------------------------ C O N T R A C T {InterfaceSQLQueryOwner} ------------------------------------
    /**
     * @param  string $key
     * @return mixed
     */
    public function get_attribute(string $key) {
        return $this->db_table->get_attribute($key);
    }

}
