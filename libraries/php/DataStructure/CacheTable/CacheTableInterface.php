<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\CacheTable;

/**
 * Interface CacheTableInterface
 * @package QuasarSource\DataStructure\CacheTable
 */
interface CacheTableInterface {
    /**
     * @param string $key
     * @return mixed
     */
    public function cache_get(string $key);

    /**
     * @param string $key
     * @return bool
     */
    public function cache_has(string $key): bool;

    /**
     * @param string $key
     * @return void
     */
    public function cache_set(string $key): void;

    /**
     * @param string $key
     * @return mixed
     */
    public function cache_calculate(string $key);
}