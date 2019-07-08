<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use QuasarSource\DataStructure\CacheTable\TraitCacheTableStatic;
use QuasarSource\Utilities\DataType\UtilsString as STR;

/**
 * Class AbstractEntity
 * @package CodeManager\Entity\Abstractions
 */
abstract class AbstractEntity {
    use FieldID;
    use TraitCacheTableStatic;

    /** @var string $sort_field_time */
    public static $sort_field_time;

    /**
     * @return string
     */
    public static function get_db_table_name(): string {
        return self::cache_get(static::class);
    }

    /**
     * @param  string $key
     * @return string
     */
    public static function cache_calculate(string $key): string {
        $table_name = $key;
        STR::ref_remove_up_to_last_match_inclusive($table_name, '\\');
        STR::ref_remove($table_name, 'Entity');
        STR::ref_replace_many($table_name, [
            'DB'   => 'db_',
            'Code' => 'code_'
        ]);
        STR::ref_to_lower($table_name);
        return $table_name;
    }

}
