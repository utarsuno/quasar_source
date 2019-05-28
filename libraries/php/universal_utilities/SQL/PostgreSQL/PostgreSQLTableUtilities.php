<?php

namespace QuasarSource\Utilities\SQL\PostgreSQL;
use QuasarSource\Utilities\SQL\QueryGenerator;
use QuasarSource\Utilities\StringUtilities as STR;


abstract class PostgreSQLTableUtilities extends PostgreSQLUtilities {

    protected const SIZE_TABLE = 'pg_total_relation_size(';

    public static function get_num_rows(string $table_name, string $count_field='id', bool $slow_and_precise=true): string {
        if ($slow_and_precise) {
            return QueryGenerator::SELECT_COUNT_AS($count_field, 'exact_count') . QueryGenerator::FROM('postgres.' . $table_name);
        }
        return self::SELECT . 'reltuples::bigint' . self::AS . 'estimate' . self::FROM . 'pg_class' . self::WHERE . 'relname=' . self::safe($table_name);
    }

    public static function get_oldest(string $table_name, string $sort_field): string {
        return self::get_single_by_sorted_field($table_name, $sort_field, self::ASCENDING);
    }

    public static function get_latest(string $table_name, string $sort_field): string {
        return self::get_single_by_sorted_field($table_name, $sort_field, self::DESCENDING);
    }

    public static function get_size(string $table_name, bool $pretty_output=false): string {
        return parent::get_size_query($table_name, self::SIZE_TABLE, $pretty_output);
    }

    private static function get_single_by_sorted_field(string $table_name, string $sort_field, string $sort_order): string {
        return self::SELECT_ALL_FROM . $table_name . self::SORT . $sort_field . $sort_order . self::LIMIT_ONE;
    }
}
