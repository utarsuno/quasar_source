<?php


namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use Doctrine\DBAL\Driver\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities      as DBG;
use QuasarSource\Utilities\SQL\PostgreSQL\PostgreSQLTableUtilities as TABLE;
use QuasarSource\Utilities\SQL\PostgreSQL\PostgreSQLUtilities as SQL;


abstract class QueryableRepository extends AbstractRepository {

    /** @var Connection */
    private $connection;

    /** @var string */
    private $table_name;

    /** @var string */
    private $sort_field_time;

    public function __construct(EntityManagerInterface $em, Mapping\ClassMetadata $class) {
        parent::__construct($em, $class);
        $this->connection = $this->_em->getConnection();
    }

    public function set_table_name(string $table_name): void {
        $this->table_name = $table_name;
    }

    public function set_sort_field_time(string $field_name): void {
        $this->sort_field_time = $field_name;
    }

    protected function execute_query(string $sql, bool $single_result=false): ?array {
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll();
        if ($single_result) {
            if (count($results) !== 0) {
                return $results[0];
            }
            return null;
        }
        return $results;
    }

    protected function get_table_size(): ?int {
        $result = $this->execute_query(TABLE::get_size($this->table_name), true);
        if ($result !== null) {
            return $result['pg_total_relation_size'];
        }
        return null;
    }

    protected function get_newest_entity() {
        return $this->execute_query(TABLE::get_latest($this->table_name, $this->sort_field_time), true);
    }

    protected function get_oldest_entity() {
        return $this->execute_query(TABLE::get_oldest($this->table_name, $this->sort_field_time), true);
    }

}
