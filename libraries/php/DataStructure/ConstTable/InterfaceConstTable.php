<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\ConstTable;

/**
 * Interface ConstTableInterface
 * @package QuasarSource\DataStructure\ConstTable
 */
interface ConstTableInterface {
    /**
     * @param string $key
     * @return mixed
     */
    public function const_get(string $key);

    /**
     * @param string $key
     * @return bool
     */
    public function const_has(string $key): bool;

    /**
     * @param  string $key
     * @param  mixed  $value
     * @return void
     */
    public function const_set(string $key, $value): void;

    /**
     * @param string $key
     * @return mixed
     */
    public function const_calculate(string $key);
}
