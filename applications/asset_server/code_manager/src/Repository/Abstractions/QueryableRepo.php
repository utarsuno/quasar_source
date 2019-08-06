<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Service\DBService;
use CodeManager\Service\LoggerService;
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

    /** @var LoggerService $logger */
    protected $logger;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    public function __destruct() {
        unset($this->db_table, $this->db_service, $this->logger);
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @return mixed
     */
    public function get_latest() {
        return $this->get_db_table()->execute_get_latest();
    }

    /**
     * @return bool
     */
    public function is_empty(): bool {
        return !$this->get_db_table()->has_rows();
    }

    /**
     * @param DBService $db_service
     */
    public function set_db_service(DBService $db_service): void {
        $this->db_service = $db_service;
        $this->logger     = $db_service->service_get_logger();
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
        return $this->get_db_table()->execute_custom($this->raw_query($query));
    }

    /**
     * @return DBTable
     */
    protected function get_db_table(): DBTable {
        /** @var AbstractEntity $entity_class */
        $entity_class = $this->get_entity_class();
        var_dump('ENTITY CLASS IS {' . $entity_class . '}');
        $db_table = $this->db_service->get_db_table_by_name($entity_class::$db_table_name);
        if (isset($entity_class::$sort_field_time) && !$db_table->is_sort_field_set()) {
            $db_table->set_sort_field_time($entity_class::$sort_field_time);
        }
        return $db_table;
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
