<?php declare(strict_types=1);

namespace QuasarSource\SQL;

use Doctrine\DBAL\Connection;
use QuasarSource\SQL\Representation\SQLQuery;
use QuasarSource\SQL\Representation\SQLQueryGroup;

/**
 * Class DBTable
 * @package QuasarSource\SQL\Representation
 */
final class DBTable extends SQLQueryGroup {

    private const QUERY_GET_NUM_ROWS_CHEAP     = 'get_num_rows_cheap';
    private const QUERY_GET_NUM_ROWS_EXPENSIVE = 'get_num_rows_expensive';
    private const QUERY_GET_OLDEST             = 'get_oldest';
    private const QUERY_GET_LATEST             = 'get_latest';

    private $sort_field_time;

    /**
     * DBTable constructor.
     * @param string     $table_name
     * @param Connection $connection
     */
    public function __construct(string $table_name, Connection $connection) {
        parent::__construct($table_name, $connection);
        $this->attributes[SQLQuery::ATTRIBUTE_SELF_TYPE] = SQLQuery::VAL_TYPE_TABLE;
        $this->attributes[SQLQuery::ATTRIBUTE_SELF_NAME] = $this->get_name();
    }

    /**
     * @param string $sort_field
     */
    public function set_sort_field_time(string $sort_field): void {
        $this->sort_field_time = $sort_field;
    }

    /**
     * @return bool
     */
    public function has_rows(): bool {
        return $this->execute(self::QUERY_GET_NUM_ROWS_EXPENSIVE) !== 0;
    }

    # --------------------------------------------- P U B L I C -- A P I -----------------------------------------------

    /**
     * @return mixed
     */
    public function execute_get_oldest() {
        return $this->execute(self::QUERY_GET_OLDEST);
    }

    /**
     * @return mixed
     */
    public function execute_get_latest() {
        return $this->execute(self::QUERY_GET_LATEST);
    }

    /**
     * @param  bool $cheap_operation
     * @return int
     */
    public function execute_get_num_rows(bool $cheap_operation=false): int {
        if ($cheap_operation) {
            return $this->execute(self::QUERY_GET_NUM_ROWS_CHEAP);
        }
        return $this->execute(self::QUERY_GET_NUM_ROWS_EXPENSIVE);
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------

    /**
     * @param  SQLQuery $query
     * @param  string   $field
     * @return SQLQuery
     */
    public function query_set_get_oldest(SQLQuery $query, string $field=null): SQLQuery {
        if ($field === null) {
            $field = $this->sort_field_time;
        }
        return $query->SELECT_ALL()->FROM_SELF()->ASCENDING_ON($field)->LIMIT(1);
    }

    /**
     * @param  SQLQuery $query
     * @param  string  $field
     * @return SQLQuery
     */
    public function query_set_get_latest(SQLQuery $query, string $field=null): SQLQuery {
        if ($field === null) {
            $field = $this->sort_field_time;
        }
        return $query->SELECT_ALL()->FROM_SELF()->DESCENDING_ON($field)->LIMIT(1);
    }

    /**
     * @param  SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_num_rows_cheap(SQLQuery $query): SQLQuery {
        return $query->SELECT_AS('reltuples::bigint', 'estimate')
            ->FROM('pg_class')->WHERE_EQUAL_TO_SELF('relname');
    }

    /**
     * @param  SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_num_rows_expensive(SQLQuery $query): SQLQuery {
        return $query->SELECT_COUNT_FROM_SELF('id');
    }
}
