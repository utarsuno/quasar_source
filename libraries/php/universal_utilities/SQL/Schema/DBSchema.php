<?php declare(strict_types=1);

namespace QuasarSource\Utilities\SQL\Schema;

use Doctrine\DBAL\Connection;
use QuasarSource\Utilities\SQL\Representation\SQLQuery;
use QuasarSource\Utilities\SQL\Representation\SQLQueryGroup;
use QuasarSource\Utilities\StringUtilities as STR;
use QuasarSource\Utilities\SystemUtilities as SYS;

/**
 * Class DBSchema
 * @package QuasarSource\Utilities\SQL\Representation
 */
final class DBSchema extends SQLQueryGroup {

    private const INFO_SCHEMA        = 'information_schema';
    private const INFO_SCHEMA_TABLES = 'information_schema.tables';

    /** @var SQLQuery $query_get_num_tables */
    private $query_get_num_tables;

    /** @var SQLQuery $query_get_table_names */
    private $query_get_table_names;

    /** @var SQLQuery $query_get_db_size */
    private $query_get_db_size;

    /** @var SQLQuery $query_get_size */
    private $query_get_size;

    /** @var string $sql_db_size */
    private $sql_db_size;

    /** @var string $sql_db_size_pretty */
    private $sql_db_size_pretty;

    /**
     * DBSchema constructor.
     * @param Connection $connection
     */
    public function __construct(Connection $connection) {
        parent::__construct(SYS::get_env('DB_NAME'), $connection);
        $this->sql_db_size        = 'pg_database_size' . STR::parentheses('', $this->db_name_quotes);
        $this->sql_db_size_pretty = STR::parentheses('pg_size_pretty', $this->sql_db_size);
    }

    /**
     * @param bool $pretty_output
     * @return mixed
     */
    public function get_total_size(bool $pretty_output=false) {
        if ($this->cache_is_cold('query_get_db_size')) {
            return $this->first_execute($this->query_get_size->SELECT(
                $pretty_output ? $this->sql_db_size_pretty : $this->sql_db_size
            ));
        }
        return $this->query_get_db_size->execute();
    }

    /**
     * @return mixed|mixed[]
     */
    public function get_num_tables() {
        if ($this->cache_is_cold('query_get_num_tables')) {
            return $this->first_execute($this->query_get_num_tables->SELECT()->COUNT()
                ->FROM(self::INFO_SCHEMA_TABLES)->WHERE_EQUAL_TO_STR('table_schema', 'public')
                ->AND_WHERE_EQUAL_TO_STR('table_type', 'BASE TABLE')
            );
        }
        return $this->query_get_num_tables->execute();
    }

    /**
     * @return mixed|mixed[]
     */
    public function get_table_names() {
        if ($this->cache_is_cold('query_get_table_names')) {
            return $this->first_execute($this->query_get_table_names->SELECT('table_name')
                ->FROM(self::INFO_SCHEMA_TABLES)
                ->WHERE_EQUAL_TO_STR('table_schema', 'public')
                ->AND_WHERE_EQUAL_TO_STR('table_type', 'BASE TABLE')
            );
        }
        return $this->query_get_table_names->execute();
    }

    /**
     * @see https://www.postgresql.org/docs/9.1/sql-analyze.html
     *
     * @return mixed
     */
    protected function analyze() {
        if ($this->cache_is_cold('query_analyze')) {
            return $this->first_execute($this->query_analyze->raw('ANALYZE VERBOSE'));
        }
        return $this->query_analyze->execute();
    }

}
