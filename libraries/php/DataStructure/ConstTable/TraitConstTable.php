<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\ConstTable;

use function array_key_exists;
use http\Exception\RuntimeException;

/**
 * Trait TraitConstTable
 * @package QuasarSource\DataStructure\ConstTable
 */
trait TraitConstTable {

    /** @var array $const_table */
    protected $const_table = [];

    /**
     * @param string $key
     * @return mixed
     */
    public function const_get(string $key) {
        if (!$this->const_has($key)) {
            throw new RuntimeException('TODO: Exception for TraitConstTable ');
        }
        return $this->const_table[$key];
    }

    /**
     * @param  string $key
     * @param  mixed  $value
     * @return void
     */
    public function const_set(string $key, $value): void {
        if ($this->const_has($key)) {
            throw new RuntimeException('TODO: Exception for TraitConstTable ');
        }
        if ($value === null) {
            $this->const_table[$key] = $this->const_calculate($key);
        } else {
            $this->const_table[$key] = $value;
        }
    }

    /**
     * @param string $key
     * @return bool
     */
    public function const_has(string $key): bool {
        return array_key_exists($key, $this->const_table);
    }
}
