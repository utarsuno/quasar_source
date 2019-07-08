<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\CacheTable;

use function array_key_exists;

/**
 * Trait TraitCacheTableStatic
 * @package QuasarSource\DataStructure\CacheTable
 */
trait TraitCacheTableStatic {

    /** @var array $cache_table */
    public static $cache_table = [];

    /**
     * @param  string $key
     * @return mixed
     */
    public static function cache_get(string $key) {
        if (!self::cache_has($key)) {
            self::cache_set($key);
        }
        return self::$cache_table[$key];
    }

    /**
     * @param  string $key
     * @param  mixed  $value
     * @return void
     */
    public static function cache_set(string $key, $value=null): void {
        if ($value === null) {
            self::$cache_table[$key] = static::cache_calculate($key);
        } else {
            self::$cache_table[$key] = $value;
        }
    }

    /**
     * @param  string $key
     * @return bool
     */
    public static function cache_has(string $key): bool {
        return array_key_exists($key, self::$cache_table);
    }
}
