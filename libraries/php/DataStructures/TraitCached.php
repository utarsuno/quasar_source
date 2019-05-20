<?php

namespace QuasarSource\DataStructures;

trait TraitCached {

    /** @var array $cached_values */
    protected $cached_values = [];

    public function cache_get(string $key) {
        if (!array_key_exists($key, $this->cached_values)) {
            $this->cache_set($key);
        }
        return $this->cached_values[$key];
    }
}
