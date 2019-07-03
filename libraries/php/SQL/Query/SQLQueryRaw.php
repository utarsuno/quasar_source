<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\Driver\Statement;
use Doctrine\DBAL\FetchMode;
use QuasarSource\DataStructure\ConstTable\TraitConstTable;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\Enum\SQLFetchModes;
use QuasarSource\Utilities\UtilsString as STR;

/**
 * Class SQLQueryRaw
 * @package QuasarSource\SQL\Representation
 */
abstract class SQLQueryRaw {

    /** @var Statement $statement */
    protected $statement;

    /** @var string $sql */
    protected $sql               = '';

    /** @var int $response_num_rows */
    protected $response_num_rows = -1;

    /** @var int $response_num_cols */
    protected $response_num_cols = 1;

    /**
     * @return SQLQueryRaw
     */
    public function expecting_multiple_rows(): self {
        $this->response_num_rows = 2;
        return $this;
    }

    /**
     * @param Connection $connection
     * @return self
     */
    public function prepare(Connection $connection): self {
        $this->statement = $connection->prepare($this->sql);
        if ($this->response_num_cols === 1) {
            $this->statement->setFetchMode(FetchMode::COLUMN, 0);
        }
        return $this;
    }

    /**
     * @return mixed|mixed[]
     */
    public function execute() {
        $response = $this->statement->execute();
        #var_dump($response);
        #var_dump(gettype($response));

        $num_rows_affects = $this->statement->rowCount();
        #var_dump($num_rows_affects);

        #var_dump($this->response_num_rows);
        if ($this->response_num_cols === 1) {
            if ($this->response_num_rows <= 1) {
                return $this->execute_and_free_query($this->statement, SQLFetchModes::FETCH);
            }
            return $this->execute_and_free_query($this->statement, SQLFetchModes::FETCH_ALL);
        }
        return $this->execute_and_free_query($this->statement, SQLFetchModes::FETCH_ALL);
    }

    /**
     * @param string $sql
     * @return SQLQueryRaw
     */
    public function raw_set(string $sql): self {
        $this->sql = $sql;
        return $this;
    }

    /**
     * @param string $sql
     * @return SQLQueryRaw
     */
    protected function raw_add(string $sql): self {
        $this->sql .= $sql . ' ';
        return $this;
    }

    /**
     * @return string
     */
    public function __toString(): string {
        return $this->sql;
    }

    # --------------------------------------- P R I V A T E -- U T I L I T I E S ---------------------------------------

    /**
     * @param Statement $query
     * @param string $fetch_mode
     * @return mixed
     */
    private function execute_and_free_query(Statement $query, string $fetch_mode) {
        #$results = $query->execute();
        switch ($fetch_mode) {
            case SQLFetchModes::FETCH:
                $results = $query->fetch();
                break;
            case SQLFetchModes::FETCH_ALL:
                $results = $query->fetchAll();
                break;
            default:
                $results = $query->execute();
                break;
        }
        $query->closeCursor();
        return $results;
    }

}
