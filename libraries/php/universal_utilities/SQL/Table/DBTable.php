<?php declare(strict_types=1);

namespace QuasarSource\Utilities\SQL\Table;

use Doctrine\DBAL\Connection;
use QuasarSource\Utilities\SQL\Representation\SQLQuery;
use QuasarSource\Utilities\SQL\Representation\SQLQueryGroup;
use QuasarSource\Utilities\StringUtilities as STR;

/**
 * Class DBTable
 * @package QuasarSource\Utilities\SQL\Representation
 */
final class DBTable extends SQLQueryGroup {

    /** @var SQLQuery $query_get_num_rows_cheap */
    private $query_get_num_rows_cheap;

    /** @var SQLQuery $query_get_num_rows_expensive */
    private $query_get_num_rows_expensive;

    /** @var SQLQuery $query_get_latest */
    private $query_get_latest;

    /** @var SQLQuery $query_get_oldest */
    private $query_get_oldest;

    /** @var string $sql_table_size */
    private $sql_table_size;

    /** @var string $sql_table_size_pretty */
    private $sql_table_size_pretty;

    /**
     * DBTable constructor.
     * @param string     $table_name
     * @param Connection $connection
     */
    public function __construct(string $table_name, Connection $connection) {
        parent::__construct($table_name, $connection);
        $this->sql_table_size        = 'pg_total_relation_size' . $this->name_sql_wrapped;
        $this->sql_table_size_pretty = STR::parentheses('pg_size_pretty', $this->sql_table_size);
    }

    /**
     * @param string $field
     * @return mixed|mixed[]
     */
    public function get_oldest(string $field) {
        if ($this->cache_is_cold('query_get_oldest')) {
            return $this->first_execute($this->query_get_oldest
                ->SELECT('*')->FROM($this->name_sql_safe)->ORDER_BY_ASC_LIMIT($field)
            );
        }
        return $this->query_get_oldest->execute();
    }

    /**
     * @param string $field
     * @return mixed|mixed[]
     */
    public function get_latest(string $field) {
        if ($this->cache_is_cold('query_get_latest')) {
            return $this->first_execute($this->query_get_latest
                ->SELECT('*')->FROM($this->name_sql_safe)->ORDER_BY_DESC_LIMIT($field)
            );
        }
        return $this->query_get_latest->execute();
    }

    /**
     * @param bool $cheap_operation
     *
     * @return mixed
     */
    public function get_num_rows(bool $cheap_operation=false) {
        if ($cheap_operation) {
            if ($this->cache_is_cold('query_get_num_rows_cheap')) {
                return $this->first_execute($this->query_get_num_rows_cheap
                    ->SELECT_AS('reltuples::bigint', 'estimate')->FROM('pg_class')
                    ->WHERE_EQUAL_TO('relname', $this->name_sql_safe)
                );
            }
            return $this->query_get_num_rows_cheap->execute();
        }
        if ($this->cache_is_cold('query_get_num_rows_expensive')) {
            return $this->first_execute($this->query_get_num_rows_expensive
                ->SELECT_COUNT_FROM('id', $this->name_sql_safe)
            );
        }
        return $this->query_get_num_rows_expensive->execute();
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    protected function query_set_get_size(SQLQuery $query): SQLQuery {
        return $query->SELECT($this->sql_table_size);
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    protected function query_set_get_size_pretty(SQLQuery $query): SQLQuery {
        return $query->SELECT($this->sql_table_size_pretty);
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    protected function query_set_analyze(SQLQuery $query): SQLQuery {
        return $query->raw('ANALYZE VERBOSE ' . $this->db_name . '.' . $this->name_sql_wrapped);
    }
}
