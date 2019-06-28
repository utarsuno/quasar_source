<?php declare(strict_types=1);

namespace QuasarSource\Utilities\SQL\Representation;

use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\Driver\Statement;
use Doctrine\DBAL\FetchMode;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\Utilities\StringUtilities as STR;

/**
 * Class SQLQuery
 * @package QuasarSource\Utilities\SQL\Representation
 */
class SQLQuery {
    use TraitFlagTable;

    /** @var string $sql */
    private $sql               = '';

    /** @var Statement $statement */
    private $statement;

    /** @var int $response_num_rows */
    private $response_num_rows = -1;

    /** @var int $response_num_cols */
    private $response_num_cols = 1;

    /**
     * @return SQLQuery
     */
    public static function new(): SQLQuery {
        return new self();
    }

    /**
     * @param string $sql
     * @return SQLQuery
     */
    public function raw(string $sql): SQLQuery {
        $this->sql = $sql;
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
        $this->statement->execute();
        if ($this->response_num_cols === 1) {
            return $this->statement->fetch();
        }
        return $this->statement->fetchAll();
    }

    /**
     * @param string $fields_to_count
     * @return SQLQuery
     */
    public function COUNT($fields_to_count='*'): self {
        $this->sql .= 'COUNT(' . $fields_to_count . ') ';
        return $this;
    }

    /**
     * @param string $from
     * @return SQLQuery
     */
    public function FROM(string $from): self {
        $this->sql .= 'FROM ' . $from . ' ';
        return $this;
    }

    /**
     * @return string
     */
    public function __toString(): string {
        return $this->sql;
    }

    /**
     * @param $limit
     * @return SQLQuery
     */
    public function LIMIT($limit=1): self {
        $this->sql .= ' LIMIT ' . ((string) $limit) . ' ';
        return $this;
    }

    /*__   __   __   ___  __      __
     /  \ |__) |  \ |__  |__)    |__) \ /
     \__/ |  \ |__/ |___ |  \    |__)  |  */

    /**
     * @param string $field
     * @return SQLQuery
     */
    public function ORDER_BY(string $field): self {
        $this->sql .= ' ORDER BY ' . $field . ' ';
        return $this;
    }

    /**
     * @param string $field
     * @return SQLQuery
     */
    public function ORDER_BY_DESC(string $field): self {
        $this->sql .= ' ORDER BY ' . $field . ' DESC ';
        return $this;
    }

    /**
     * @param string $field
     * @return SQLQuery
     */
    public function ORDER_BY_ASC(string $field): self {
        $this->sql .= ' ORDER BY ' . $field . ' ASC ';
        return $this;
    }

    /**
     * @param string $field
     * @param $limit
     * @return SQLQuery
     */
    public function ORDER_BY_DESC_LIMIT(string $field, $limit=1): self {
        $this->sql .= ' ORDER BY ' . $field . ' DESC ';
        return $this->LIMIT($limit);
    }

    /**
     * @param string $field
     * @param $limit
     * @return SQLQuery
     */
    public function ORDER_BY_ASC_LIMIT(string $field, $limit=1): self {
        $this->sql .= ' ORDER BY ' . $field . ' ASC ' . ((string) $limit) . ' ';
        return $this->LIMIT($limit);
    }

    /*          ___  __   ___
     |  | |__| |__  |__) |__
     |/\| |  | |___ |  \ |___ */

    /**
     * @return SQLQuery
     */
    public function WHERE(): self {
        $this->sql .= 'WHERE ';
        return $this;
    }

    /**
     * @param $fields
     * @param $values
     * @return SQLQuery
     */
    public function WHERE_EQUAL_TO($fields, $values): self {
        return $this->WHERE()->EQUAL_TO($fields, $values);
    }

    /**
     * @param string $field
     * @param string $value
     * @return SQLQuery
     */
    public function WHERE_EQUAL_TO_STR(string $field, string $value): self {
        return $this->WHERE()->EQUAL_TO_STR($field, $value);
    }

    /**
     * @param $fields
     * @param $values
     * @return SQLQuery
     */
    public function AND_WHERE_EQUAL_TO($fields, $values): self {
        $this->sql .= 'AND ';
        return $this->EQUAL_TO($fields, $values);
    }

    /**
     * @param $field
     * @param $value
     * @return SQLQuery
     */
    public function AND_WHERE_EQUAL_TO_STR($field, string $value): self {
        $this->sql .= 'AND ';
        return $this->EQUAL_TO_STR($field, $value);
    }

    /*___  __                    ___  __
     |__  /  \ |  |  /\  |        |  /  \
     |___ \__X \__/ /~~\ |___     |  \__/ */

    /**
     * @param $fields
     * @param $values
     * @return SQLQuery
     */
    public function EQUAL_TO($fields, $values): self {
        if (is_string($fields) && is_string($values)) {
            $this->sql .= $fields . ' = '. $values . ' ';
        }
        return $this;
    }

    /**
     * @param string $field
     * @param string $value
     * @return SQLQuery
     */
    public function EQUAL_TO_STR(string $field, string $value): self {
        $this->sql .= $field . ' = '. STR::in_quotes($value) . ' ';
        return $this;
    }

    /*__   ___       ___  __  ___
     /__` |__  |    |__  /  `  |
     .__/ |___ |___ |___ \__,  | */

    /**
     * @param string $fields
     * @param string $from
     * @return SQLQuery
     */
    public function SELECT_FROM(string $fields, string $from): self {
        $this->sql .= 'SELECT ' . $fields . ' FROM ' . $from;
        return $this;
    }

    /**
     * @param string $from
     * @return SQLQuery
     */
    public function SELECT_ALL(string $from): self {
        $this->sql .= 'SELECT * FROM ' . $from . ' ';
        return $this;
    }

    /**
     * @param string $fields
     * @param string $from
     * @return SQLQuery
     */
    public function SELECT_COUNT_FROM(string $fields, string $from): self {
        $this->sql              .= 'SELECT COUNT(' . $fields . ') FROM ' . $from . ' ';
        $this->response_num_cols = 1;
        $this->response_num_rows = 1;
        return $this;
    }

    /**
     * @param string $field
     * @param string $as
     * @return SQLQuery
     */
    public function SELECT_AS(string $field, string $as): self {
        $this->SELECT($field);
        $this->sql .= ' AS ' . $as . ' ';
        return $this;
    }

    /**
     * @param null $optional_fields
     * @return SQLQuery
     */
    public function SELECT($optional_fields = null): self {
        $this->sql .= 'SELECT ';
        if ($optional_fields !== null) {
            if (is_string($optional_fields)) {
                $this->response_num_cols = 1;
                $this->sql              .= $optional_fields . ' ';
            } else if (is_array($optional_fields)) {
                $this->response_num_cols = count($optional_fields);
                if ($this->response_num_cols > 0) {
                    foreach ($optional_fields as $field) {
                        $this->sql .= ', ' . $field;
                    }
                    $this->sql .= implode(',', $optional_fields);
                    var_dump($this->sql);
                    $this->sql = STR::remove_last_n($this->sql, 2);
                    var_dump($this->sql);
                    exit(2);
                    #$this->sql = StringUtilities::indexed()
                }
            }
        }
        return $this;
    }

}
