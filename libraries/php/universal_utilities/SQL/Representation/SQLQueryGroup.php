<?php declare(strict_types=1);

namespace QuasarSource\Utilities\SQL\Representation;

use Doctrine\DBAL\Connection;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\Traits\TraitName;
use QuasarSource\Utilities\SQL\Feature\TraitQueryCache;
use QuasarSource\Utilities\StringUtilities as STR;
use QuasarSource\Utilities\SystemUtilities as SYS;

/**
 * Class SQLQueryGroup
 * @package QuasarSource\Utilities\SQL\Representation
 */
abstract class SQLQueryGroup {
    use TraitName;
    use TraitQueryCache;
    // Used to cache SQLQuery objects for re-use.
    use TraitCacheTable;

    /** @var string $db_name */
    protected $db_name;

    /** @var string $db_name_quotes */
    protected $db_name_quotes;

    /** @var string $name_sql_safe */
    protected $name_sql_safe;

    /** @var string $name_sql_wrapped */
    protected $name_sql_wrapped;

    /** @var \Doctrine\DBAL\Driver\Connection */
    protected $connection;

    /** @var SQLQuery $query_analyze */
    protected $query_analyze;

    /** @var SQLQuery $query_get_size */
    protected $query_get_size;

    /** @var SQLQuery $query_get_size_pretty */
    protected $query_get_size_pretty;

    /**
     * SQLQueryGroup constructor.
     * @param string     $table_name
     * @param Connection $connection
     */
    public function __construct(string $table_name, Connection $connection) {
        $this->connection       = $connection;
        $this->db_name          = SYS::get_env('DB_NAME');
        $this->db_name_quotes   = STR::in_quotes($this->db_name);
        $this->name_sql_safe    = STR::in_quotes($table_name);
        $this->name_sql_wrapped = STR::parentheses('', $this->name_sql_safe);
        $this->set_name_and_label($table_name, static::class);
    }

    /**
     * @see https://www.postgresql.org/docs/9.1/sql-analyze.html
     *
     * @return mixed
     */
    protected function analyze() {
        if ($this->cache_is_cold('query_analyze')) {
            return $this->first_execute($this->query_set_analyze($this->query_analyze));
        }
        return $this->query_analyze->execute();
    }

    /**
     * @param bool $pretty_output
     * @return int|string
     */
    public function get_size(bool $pretty_output=false) {
        if ($pretty_output) {
            if ($this->cache_is_cold('query_get_size_pretty')) {
                return $this->first_execute($this->query_set_get_size_pretty($this->query_get_size_pretty));
            }
            return $this->query_get_size_pretty->execute();
        }
        if ($this->cache_is_cold('query_get_size')) {
            return $this->first_execute($this->query_set_get_size($this->query_get_size));
        }
        return $this->query_get_size->execute();
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    abstract protected function query_set_get_size(SQLQuery $query): SQLQuery;

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    abstract protected function query_set_get_size_pretty(SQLQuery $query): SQLQuery;

    /**
     * @param SQLQuery $query
     * @return SQLQuery
     */
    abstract protected function query_set_analyze(SQLQuery $query): SQLQuery;
}
