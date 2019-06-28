<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\CacheTable;

use function array_key_exists;

/**
 * Trait TraitCacheTable
 * @package QuasarSource\DataStructure\CacheTable
 */
trait TraitCacheTable {

    /** @var array $cache_table */
    protected $cache_table = [];

    /**
     * @param string $key
     * @return mixed
     */
    public function cache_get(string $key) {
        if (!$this->cache_has($key)) {
            $this->cache_set($key);
        }
        return $this->cache_table[$key];
    }

    /**
     * @param string $key
     */
    public function cache_set(string $key): void {
        $this->cache_table[$key] = $this->cache_calculate($key);
    }

    /**
     * @param string $key
     * @return bool
     */
    public function cache_has(string $key): bool {
        return array_key_exists($key, $this->cache_table);
    }
}
