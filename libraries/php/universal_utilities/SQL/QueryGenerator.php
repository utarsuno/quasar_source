<?php

namespace QuasarSource\Utilities\SQL;

abstract class QueryGenerator {

    public function __construct() {
    }

    public static function SELECT_COUNT_ALL_FROM(string $field, string $table): string {
        return 'SELECT count(' . $field . ') FROM ' . $table;
    }

    public static function SELECT_COUNT_AS(string $field, string $alias): string {
        return 'SELECT count(' . $alias . ') AS ' . $alias;
    }

    public static function FROM(string $table): string {
        return ' FROM ' . $table . ' ';
    }

    public static function WHERE_EQUALS(string $field, string $value): string {
        return ' WHERE ' . $field . '=' . $value;
    }
}


