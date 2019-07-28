<?php declare(strict_types=1);

namespace QuasarSource\SQL;

use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use QuasarSource\SQL\Representation\SQLQueryRaw;
use QuasarSource\Utils\SystemOS\UtilsSystem as SYS;

/**
 * Trait TraitDBConnection
 * @package QuasarSource\SQL
 */
trait TraitDBConnection {

    /** @var Connection */
    protected $db_connection;

    /**
     * @param EntityManagerInterface $em
     */
    public function trait_construct_db_connection(EntityManagerInterface $em): void {
        $this->db_connection = $em->getConnection();
    }

    public function trait_destruct_db_connection(): void {
        if ($this->db_connection !== null) {
            $this->close_db_connection();
        }
    }

    public function close_db_connection(): void {
        $this->db_connection->close();
        $this->db_connection = null;
        SYS::ask_for_garbage_collection();
    }

    /**
     * @param Connection $connection
     */
    public function set_db_connection(Connection $connection): void {
        $this->db_connection = $connection;
    }

    /**
     * @return Connection
     */
    public function get_db_connection(): Connection {
        return $this->db_connection;
    }

    /**
     * @param  SQLQueryRaw $query
     * @return void
     */
    protected function prepare_query(SQLQueryRaw $query): void {
        if (!$query->prepared()) {
            $query->prepare($this->db_connection);
        }
    }

    /**
     * @param  SQLQueryRaw $query
     * @return mixed|mixed[]
     */
    protected function prepare_and_execute_query(SQLQueryRaw $query) {
        $this->prepare_query($query);
        return $query->execute();
    }

}
