<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\FlagTable;

use function array_key_exists;

/**
 * Trait TraitFlagTable
 * @package QuasarSource\DataStructure\CacheTable
 */
trait TraitFlagTable {

    /** @var array $table_flags */
    protected $table_flags = [];

    /**
     * @param string $flag
     * @return bool
     */
    public function flag_is_on(string $flag): bool {
        return $this->table_flags[$flag];
    }

    /**
     * @param string $flag
     * @return bool
     */
    public function flag_is_off(string $flag): bool {
        return !$this->table_flags[$flag];
    }

    /**
     * @param string $flag
     * @param bool $value
     */
    public function flag_set(string $flag, bool $value): void {
        $this->table_flags[$flag] = $value;
    }

    /**
     * @param string $flag
     */
    public function flag_set_on(string $flag): void {
        $this->table_flags[$flag] = true;
    }

    /**
     * @param string $flag
     */
    public function flag_set_off(string $flag): void {
        $this->table_flags[$flag] = false;
    }

    /**
     * @param array $flags_and_values
     */
    public function flags_set(array $flags_and_values): void {
        foreach ($flags_and_values as $flag => $value) {
            $this->table_flags[$flag] = $value;
        }
    }

    /**
     * @param string $flag
     * @return bool
     */
    public function flag_get(string $flag): bool {
        return $this->table_flags[$flag];
    }

    /**
     * @param string $flag
     * @return bool
     */
    public function flag_exists(string $flag): bool {
        return array_key_exists($flag, $this->table_flags);
    }

    /**
     * @param string $flag
     * @return bool
     */
    public function flag_exists_as_on(string $flag): bool {
        return array_key_exists($flag, $this->table_flags) && $this->table_flags[$flag];
    }

    /**
     * @param string $flag
     * @return bool
     */
    public function flag_exists_as_off(string $flag): bool {
        return array_key_exists($flag, $this->table_flags) && !$this->table_flags[$flag];
    }
}
