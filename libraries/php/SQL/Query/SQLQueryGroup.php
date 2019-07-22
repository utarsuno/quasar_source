<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use Doctrine\DBAL\Connection;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\CommonFeatures\TraitName;

/**
 * Class SQLQueryGroup
 * @package QuasarSource\SQL\Representation
 */
abstract class SQLQueryGroup implements InterfaceSQLQueryOwner {
    use TraitName;
    // Used to cache SQLQuery objects for re-use.
    use TraitCacheTable;

    protected const QUERY_GET_SIZE        = 'get_size';
    protected const QUERY_GET_SIZE_PRETTY = 'get_size_pretty';

    /** @var Connection */
    protected $connection;

    protected $attributes = [
        SQLQuery::ATTRIBUTE_SELF_TYPE => null,
        SQLQuery::ATTRIBUTE_SELF_NAME => null,
    ];

    /**
     * @param string     $table_name
     * @param Connection $connection
     * @param array      $attributes
     */
    public function __construct(string $table_name, Connection $connection, array $attributes) {
        $this->connection = $connection;
        $this->set_name_and_label($table_name, static::class);
        foreach ($attributes as $k => $v) {
            $this->attributes[$k] = $v;
        }
    }

    /**
     * @param  SQLQuery $query
     * @return mixed|mixed[]
     */
    public function execute_custom(SQLQuery $query) {
        if (!$query->prepared()) {
            $query->multi_row()->multi_cols();
            $query->prepare($this->connection);
        }
        return $query->execute();
    }

    /**
     * @param  string $query_name
     * @return mixed
     */
    public function execute(string $query_name) {
        if (!$this->cache_has($query_name)) {
            $query                          = new SQLQuery($this);
            $initialize_query_function_name = 'query_set_' . $query_name;
            $this->cache_set($query_name, $query);
            $this->$initialize_query_function_name($query);
            $query->prepare($this->connection);
            return $query->execute();
        }
        /** @var SQLQuery $query */
        $query = $this->cache_get($query_name);
        if (!$query->prepared()) {
            $query->prepare($this->connection);
        }
        return $query->execute();
    }

    /**
     * @param  SQLQuery $query
     * @return mixed|mixed[]
     */
    public function execute_query(SQLQuery $query) {
        if (!$query->prepared()) {
            $query->prepare($this->connection);
        }
        return $query->execute();
    }

    /**
     * @param  bool $pretty
     * @return mixed
     */
    public function get_size(bool $pretty) {
        if ($pretty) {
            return $this->execute(self::QUERY_GET_SIZE_PRETTY);
        }
        return $this->execute(self::QUERY_GET_SIZE);
    }

    # ----------------------------------- C O N T R A C T {InterfaceSQLQueryOwner} -----------------------------------
    /**
     * @param  string $key
     * @return mixed
     */
    public function get_attribute(string $key) {
        return $this->attributes[$key];
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------

    /**
     * @param  SQLQuery $query
     * @return mixed
     */
    public function query_set_get_size(SQLQuery $query) {
        $name = '(' . $query->get_owner_name(true) . ')';
        if ($query->owner_is_table()) {
            return $query->SELECT()->raw_add(' pg_total_relation_size' . $name);
        }
        return $query->SELECT()->raw_add(' pg_database_size' . $name);
    }

    /**
     * @param  SQLQuery $query
     * @return mixed
     */
    public function query_set_get_size_pretty(SQLQuery $query) {
        $name = '(' . $query->get_owner_name(true) . ')';
        if ($query->owner_is_table()) {
            return $query->SELECT()->PRETTY_SIZE(' pg_total_relation_size' . $name);
        }
        return $query->SELECT()->PRETTY_SIZE(' pg_database_size' . $name);
    }
}
