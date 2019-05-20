<?php

namespace QuasarSource\DataStructures;

interface Cached {
    public function cache_get(string $key);
    public function cache_set(string $key): void;
}