<?php declare(strict_types=1);

namespace QuasarSource\SQL;

use Doctrine\DBAL\Connection;
use QuasarSource\SQL\Representation\SQLQuery;
use QuasarSource\SQL\Representation\SQLQueryGroup;

/**
 * Class DBSchema
 * @package QuasarSource\SQL\Representation
 */
final class DBSchema extends SQLQueryGroup {

    private const QUERY_GET_NUM_TABLES      = 'get_num_tables';
    private const QUERY_GET_TABLE_NAMES     = 'get_table_names';
    private const QUERY_GET_TABLE_NAMES_ALL = 'get_all_table_names';

    private $db_tables = [];

    /**
     * DBSchema constructor.
     * @param string     $db_name
     * @param Connection $connection
     */
    public function __construct(string $db_name, Connection $connection) {
        parent::__construct(
            $db_name,
            $connection,
            [SQLQuery::ATTRIBUTE_SELF_TYPE => SQLQuery::VAL_TYPE_SCHEMA, SQLQuery::ATTRIBUTE_SELF_NAME => $db_name]
        );
        $table_names = $this->get_names_of_created_tables();
        foreach ($table_names as $table_name) {
            $this->db_tables[$table_name] = new DBTable($table_name, $this->connection);
        }
    }

    /**
     * @param  string $table_name
     * @return DBTable
     */
    public function get_db_table(string $table_name): DBTable {
        return $this->db_tables[$table_name];
    }

    /**
     * @return int
     */
    public function get_num_created_tables(): int {
        return $this->execute(self::QUERY_GET_NUM_TABLES);
    }

    /**
     * @return array
     */
    public function get_names_of_created_tables(): array {
        return $this->execute(self::QUERY_GET_TABLE_NAMES);
    }

    /**
     * @return array
     */
    public function get_names_of_all_tables(): array {
        return $this->execute(self::QUERY_GET_TABLE_NAMES_ALL);
    }

    /**
     * @return array
     */
    public function get_table_names_and_sizes(): array {
        $tables = [];
        /** @var DBTable $table */
        foreach ($this->db_tables as $name => $table) {
            $tables[$name] = $table->get_size(false);
        }
        return $tables;
    }

    # --------------------------------------- P R I V A T E -- U T I L I T I E S ---------------------------------------

    /**
     * @param  SQLQuery $query
     * @return SQLQuery
     */
    private function public_tables_only(SQLQuery $query): SQLQuery {
        return $query->FROM('information_schema.tables')
            ->WHERE_EQUAL_TO_STR('table_schema', 'public')
            ->AND_EQUAL_TO_STR('table_type', 'BASE TABLE');
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------

    /**
     * @param  SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_num_tables(SQLQuery $query): SQLQuery {
        return $this->public_tables_only($query->SELECT()->COUNT());
    }

    /**
     * @param  SQLQuery $query
     * @return mixed
     */
    public function query_set_get_table_names(SQLQuery $query): SQLQuery {
        return $this->public_tables_only($query->SELECT('table_name'))->multi_row();
    }

    /**
     * @param SQLQuery $query
     * @return mixed
     */
    public function query_set_get_all_table_names(SQLQuery $query): SQLQuery {
        return $query->SELECT('table_name')->FROM('information_schema.tables')->multi_row();
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_analyze_db(SQLQuery $query): SQLQuery {
        /** @var SQLQuery $q */
        $q = $query->raw_set('ANALYZE VERBOSE');
        return $q;
    }

    /**
     * @param SQLQuery $query
     * @param DBTable $table
     * @return SQLQuery
     */
    public function query_set_analyze_table(SQLQuery $query, DBTable $table): SQLQuery {
        /** @var SQLQuery $q */
        $q = $query->raw_set('ANALYZE VERBOSE ' . $table->get_name());
        return $q;
    }
}
