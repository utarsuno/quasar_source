<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\Driver\Statement;
use Doctrine\DBAL\FetchMode;
use RuntimeException;

/**
 * Class SQLQueryRaw
 * @package QuasarSource\SQL\Representation
 */
abstract class SQLQueryRaw {

    private const FETCH     = 'fetch';
    private const FETCH_ALL = 'fetch_all';
    private const FETCH_NUM = 'fetch_num';

    /** @var Statement $statement */
    protected $statement;

    /** @var string $sql */
    protected $sql          = '';

    /** @var bool $is_multi_row */
    protected $is_multi_row = false;

    /** @var int $is_multi_col */
    protected $is_multi_col = false;

    /** @var bool $is_prepared */
    private $is_prepared    = false;

    public function __destruct() {
        unset($this->statement, $this->sql, $this->is_multi_col, $this->is_multi_row, $this->is_prepared);
    }

    /**
     * @return SQLQueryRaw
     */
    public function multi_row(): self {
        $this->is_multi_row = true;
        return $this;
    }

    /**
     * @return SQLQueryRaw
     */
    public function multi_cols(): self {
        $this->is_multi_col = true;
        return $this;
    }

    /**
     * @return bool
     */
    public function prepared(): bool {
        return $this->is_prepared;
    }

    /**
     * @param Connection $connection
     * @return self
     */
    public function prepare(Connection $connection): self {
        if ($this->is_prepared) {
            throw new RuntimeException('SQLQuery is already prepared!');
        }
        $this->is_prepared = true;
        $this->statement   = $connection->prepare($this->sql);
        if (!$this->is_multi_col) {
            $this->statement->setFetchMode(FetchMode::COLUMN, 0);
        } else if ($this->is_multi_col) {
            $this->statement->setFetchMode(FetchMode::NUMERIC);
        }
        return $this;
    }

    /**
     * @return mixed|mixed[]
     */
    public function execute() {
        if (!$this->is_prepared) {
            throw new RuntimeException('Can\'t execute a SQLQuery that isn\'t prepared!');
        }
        if (!$this->is_multi_col) {
            if (!$this->is_multi_row) {
                return $this->execute_and_free_query(self::FETCH);
            }
            return $this->execute_and_free_query(self::FETCH_ALL);
        }
        if ($this->is_multi_col && !$this->is_multi_row) {
            return $this->execute_and_free_query(self::FETCH);
        }
        return $this->execute_and_free_query(self::FETCH_ALL);
    }

    /**
     * @param  string $sql
     * @return SQLQueryRaw
     */
    public function raw_set(string $sql): self {
        $this->sql = $sql;
        return $this;
    }

    /**
     * @param  string $function_name
     * @param  mixed  $value
     * @return SQLQueryRaw
     */
    public function raw_func(string $function_name, $value): self {
        $this->sql .= $function_name . '(' . $value . ') ';
        return $this;
    }

    /**
     * @param string $sql
     * @return SQLQueryRaw
     */
    public function raw_add(string $sql): self {
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
     * @param  string $fetch_mode
     * @return mixed
     */
    private function execute_and_free_query(string $fetch_mode) {
        #$num_rows_affects = $this->statement->rowCount();
        if (!$this->statement->execute()) {
            throw new RuntimeException('Query failed: {' . ((string) $this->statement) . '}');
        }
        switch ($fetch_mode) {
            case self::FETCH:
                $results = $this->statement->fetch();
                break;
            case self::FETCH_ALL:
                $results = $this->statement->fetchAll();
                break;
            default:
                $results = $this->statement->execute();
                break;
        }
        $this->statement->closeCursor();
        return $results;
    }

}
