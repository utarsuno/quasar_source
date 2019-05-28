<?php

namespace QuasarSource\Utilities\SQL\PostgreSQL;
use QuasarSource\Utilities\SQL\QueryGenerator;
use QuasarSource\Utilities\StringUtilities as STR;


abstract class PostgreSQLUtilities {

    protected const SELECT           = 'SELECT ';
    protected const PRETTY           = 'pg_size_pretty(';
    protected const SIZE_DB          = 'pg_database_size(';
    protected const LIMIT_ONE        = ' LIMIT 1 ';
    protected const SORT             = ' ORDER BY ';
    protected const SELECT_ALL       = self::SELECT . '* ';
    protected const FROM             = ' FROM ';
    protected const SELECT_ALL_FROM  = self::SELECT_ALL . self::FROM;
    protected const AS               = ' AS ';
    protected const ASCENDING        = ' ASC ';
    protected const DESCENDING       = ' DESC ';
    protected const COUNT            = ' COUNT(';
    protected const WHERE            = ' WHERE ';
    protected const SELECT_COUNT_ALL = self::SELECT . self::COUNT . '*) ';

    public static function get_number_of_tables(): string {
        return self::SELECT_COUNT_ALL . QueryGenerator::FROM('information_schema.tables');
    }

    public static function get_db_size(string $db_name, bool $pretty_output=false): string {
        return self::get_size_query($db_name, self::SIZE_DB, $pretty_output);
    }

    protected static function get_size_query(string $name, string $size_type, bool $pretty_output): string {
        $size = $size_type . self::safe($name);
        if ($pretty_output) {
            return self::SELECT . self::PRETTY . $size . '))';
        }
        return self::SELECT . $size . ')';
    }

    protected static function safe(string $name): string {
        return STR::wrapped_in_quotes($name, true, false);
    }

}
