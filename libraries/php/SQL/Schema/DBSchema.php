<?php declare(strict_types=1);

namespace QuasarSource\SQL\Schema;

use Doctrine\DBAL\Connection;
use QuasarSource\SQL\Representation\SQLQuery;
use QuasarSource\SQL\Representation\SQLQueryGroup;
use QuasarSource\SQL\Table\DBTable;

/**
 * Class DBSchema
 * @package QuasarSource\SQL\Representation
 */
final class DBSchema extends SQLQueryGroup {

    private const INFO_SCHEMA          = 'information_schema';
    private const INFO_SCHEMA_TABLES   = 'information_schema.tables';

    public const QUERY_GET_NUM_TABLES  = 'get_num_tables';
    public const QUERY_GET_TABLE_NAMES = 'get_table_names';
    #public const QUERY_GET_TABLE_SIZE

    /**
     * DBSchema constructor.
     * @param string     $db_name
     * @param Connection $connection
     */
    public function __construct(string $db_name, Connection $connection) {
        parent::__construct($db_name, $connection);
        $this->attributes[SQLQuery::ATTRIBUTE_SELF_TYPE] = SQLQuery::VAL_TYPE_SCHEMA;
        $this->attributes[SQLQuery::ATTRIBUTE_SELF_NAME] = $this->get_name();
    }

    /**
     * @return array
     */
    public function get_all_db_tables(): array {
        $table_names = $this->execute(self::QUERY_GET_TABLE_NAMES);
        $tables      = [];
        foreach ($table_names as $name) {
            var_dump($name);
            #$tables[] = new DBTable($name, $this->connection);
        }
        return $tables;
    }

    # ---

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_num_tables(SQLQuery $query): SQLQuery {
        return $this->query_func_public_tables_only($query->SELECT()->COUNT());
    }

    /**
     * @param SQLQuery $query
     * @return mixed
     */
    public function query_set_get_table_names(SQLQuery $query): SQLQuery {
        return $this->query_func_public_tables_only($query->SELECT('table_name'));
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_analyze_db(SQLQuery $query): SQLQuery {
        return $query->ANALYZE_DB();
    }

    /**
     * @param SQLQuery $query
     * @param DBTable $table
     * @return SQLQuery
     */
    public function query_set_analyze_table(SQLQuery $query, DBTable $table): SQLQuery {
        return $query->ANALYZE_TABLE($table->get_name());
    }

    # --------------------------------------- P R I V A T E -- U T I L I T I E S ---------------------------------------

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    private function query_func_public_tables_only(SQLQuery $query): SQLQuery {
        return $query->FROM(self::INFO_SCHEMA_TABLES)->WHERE_EQUAL_TO_STR('table_schema', 'public')
            ->AND_EQUAL_TO_STR('table_type', 'BASE TABLE');
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------
}
