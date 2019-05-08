<?php


namespace CodeManager\Entity\Abstractions;


abstract class EntityAbstraction {

    /** @var array $cached_values */
    protected $cached_values = [];

    protected function get_cache_value(string $cache_key) {
        if (!array_key_exists($cache_key, $this->cached_values)) {
            $this->cached_values[$cache_key] = $this->calculate_cache_value($cache_key);
        }
        return $this->cached_values[$cache_key];
    }

    abstract protected function calculate_cache_value(string $cache_key);
}

