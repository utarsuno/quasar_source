<?php declare(strict_types=1);

namespace QuasarSource\SQL\Table;

use Doctrine\DBAL\Connection;
use QuasarSource\SQL\Representation\SQLQuery;
use QuasarSource\SQL\Representation\SQLQueryGroup;
use QuasarSource\Utilities\UtilsString as STR;

/**
 * Class DBTable
 * @package QuasarSource\SQL\Representation
 */
final class DBTable extends SQLQueryGroup {

    public const QUERY_GET_NUM_ROWS_CHEAP     = 'get_num_rows_cheap';
    public const QUERY_GET_NUM_ROWS_EXPENSIVE = 'get_num_rows_expensive';

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
     * @param SQLQuery $query
     * @param $field
     * @return SQLQuery
     */
    public function query_set_get_oldest(SQLQuery $query, $field): SQLQuery {
        return $query->SELECT_ALL()->FROM_SELF()->ASCENDING_ON($field)->LIMIT(1);
    }

    /**
     * @param SQLQuery $query
     * @param $field
     * @return SQLQuery
     */
    public function query_set_get_latest(SQLQuery $query, $field): SQLQuery {
        return $query->SELECT_ALL()->FROM_SELF()->DESCENDING_ON($field)->LIMIT(1);
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_num_rows_cheap(SQLQuery $query): SQLQuery {
        return $query->SELECT_AS('reltuples::bigint', 'estimate')
            ->FROM('pg_class')->WHERE_EQUAL_TO_SELF('relname');
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_num_rows_expensive(SQLQuery $query): SQLQuery {
        return $query->SELECT_COUNT_FROM_SELF('id');
    }
}
