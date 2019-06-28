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
    abstract protected function analyze();
}
