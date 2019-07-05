<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use Doctrine\DBAL\Connection;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\DataStructure\ConstTable\TraitConstTable;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\Utilities\DataType\UtilsString as STR;
use QuasarSource\Utilities\SystemOS\UtilsSystem as SYS;

/**
 * Class SQLQueryGroup
 * @package QuasarSource\SQL\Representation
 */
abstract class SQLQueryGroup implements InterfaceSQLQueryOwner {
    use TraitName;
    // Used to cache SQLQuery objects for re-use.
    use TraitCacheTable;

    public const QUERY_GET_SIZE        = 'get_size';
    public const QUERY_GET_SIZE_PRETTY = 'get_size_pretty';

    /** @var \Doctrine\DBAL\Driver\Connection */
    protected $connection;

    protected $attributes = [
        SQLQuery::ATTRIBUTE_SELF_TYPE => null,
        SQLQuery::ATTRIBUTE_SELF_NAME => null,
    ];

    /**
     * @param string $query_name
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
        return $this->cache_get($query_name)->execute();
    }

    /**
     * SQLQueryGroup constructor.
     * @param string     $table_name
     * @param Connection $connection
     */
    public function __construct(string $table_name, Connection $connection) {
        $this->connection       = $connection;
        $this->set_name_and_label($table_name, static::class);
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_size(SQLQuery $query): SQLQuery {
        return $query->SELECT()->SIZE_OF_SELF(false);
    }

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    public function query_set_get_size_pretty(SQLQuery $query): SQLQuery {
        return $query->SELECT()->SIZE_OF_SELF(true);
    }

    /**
     * @param string $key
     * @return mixed
     */
    public function get_attribute(string $key) {
        return $this->attributes[$key];
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------

}
