<?php declare(strict_types=1);

namespace QuasarSource\SQL\Enum;

/**
 * Class SQLFunctions
 * @package QuasarSource\SQL\Enum
 */
abstract class SQLFunctions {
    public const SIZE_OF_OUTPUT_MADE_PRETTY = 'pg_size_pretty';
    public const SIZE_OF_TABLE              = 'pg_total_relation_size';
    public const SIZE_OF_DB                 = 'pg_database_size';
}
