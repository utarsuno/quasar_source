<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use Doctrine\DBAL\Connection;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\SQL\TraitDBConnection;
use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class SQLQueryGroup
 * @package QuasarSource\SQL\Representation
 */
abstract class SQLQueryGroup implements InterfaceSQLQueryOwner {
    use TraitName;
    // Used to cache SQLQuery objects for re-use.
    use TraitCacheTable;
    use TraitDBConnection;

    protected $attributes = [
        SQLQuery::ATTRIBUTE_SELF_TYPE => null,
        SQLQuery::ATTRIBUTE_SELF_NAME => null
    ];

    /** @var SQLQuery $query_get_size */
    private $query_get_size;

    /** @var SQLQuery $query_get_size_pretty */
    private $query_get_size_pretty;

    /**
     * @param string     $table_name
     * @param Connection $connection
     * @param array      $attributes
     */
    public function __construct(string $table_name, Connection $connection, array $attributes) {
        $this->set_db_connection($connection);
        $this->set_name_and_label($table_name, static::class);
        foreach ($attributes as $k => $v) {
            $this->attributes[$k] = $v;
        }
    }

    public function __destruct() {
        unset($this->query_get_size, $this->query_get_size_pretty);
    }

    /**
     * @param  $query
     * @return mixed|mixed[]
     */
    public function execute_query($query) {
        if (is_string($query)) {
            return $this->execute_custom($this->create_new_query($query));
        }
        return $this->prepare_and_execute_query($query);
    }

    /**
     * @param  SQLQuery $query
     * @return mixed|mixed[]
     */
    public function execute_custom(SQLQuery $query) {
        if (!$query->prepared()) {
            $query->multi_row()->multi_cols();
        }
        return $this->prepare_and_execute_query($query);
    }

    /**
     * @param  string $query_name
     * @return mixed
     */
    public function execute(string $query_name) {
        if (!$this->cache_has($query_name)) {
            $query                          = $this->create_new_query();
            $initialize_query_function_name = 'query_set_' . $query_name;
            $this->cache_set($query_name, $query);
            $this->$initialize_query_function_name($query);
            return $this->prepare_and_execute_query($query);
        }
        /** @var SQLQuery $query */
        $query = $this->cache_get($query_name);
        return $this->prepare_and_execute_query($query);
    }

    /**
     * @param  bool $pretty
     * @return mixed
     */
    public function get_size(bool $pretty=false) {
        if ($pretty) {
            if ($this->query_get_size_pretty === null) {
                $func_name = $this->is_table() ? 'pg_total_relation_size(' : 'pg_database_size(';
                $this->query_get_size_pretty = $this->create_new_query()
                    ->SELECT()->PRETTY_SIZE($func_name . $this->get_owner_name(true) . ')');
            }
            return $this->execute_query($this->query_get_size_pretty);
        }
        if ($this->query_get_size === null) {
            $func_name  = $this->is_table() ? 'pg_total_relation_size' : 'pg_database_size';
            $this->query_get_size = $this->create_new_query()
                ->SELECT()->raw_func($func_name, $this->get_owner_name(true));
        }
        return $this->execute_query($this->query_get_size);
    }

    /**
     * @param  string|null $sql
     * @return SQLQuery
     */
    protected function create_new_query(string $sql=null): SQLQuery {
        $query = new SQLQuery($this);
        if ($sql !== null) {
            $query->raw_set($sql);
        }
        return $query;
    }

    # ----------------------------------- C O N T R A C T {InterfaceSQLQueryOwner} -----------------------------------
    /**
     * @param  string $key
     * @return mixed
     */
    public function get_attribute(string $key) {
        return $this->attributes[$key];
    }

    /**
     * @param  bool $use_single_quotes
     * @return string
     */
    public function get_owner_name(bool $use_single_quotes=false): string {
        return STR::in_quotes($this->get_attribute(SQLQuery::ATTRIBUTE_SELF_NAME), $use_single_quotes);
    }

    /**
     * @return bool
     */
    public function is_table(): bool {
        return $this->attributes[SQLQuery::ATTRIBUTE_SELF_TYPE] === SQLQuery::VAL_TYPE_TABLE;
    }

}
