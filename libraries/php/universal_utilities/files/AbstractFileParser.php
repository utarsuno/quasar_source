<?php


namespace QuasarSource\Utilities\Files;


abstract class AbstractFileParser {

    public static function get_content(string $path) {
        FileUtilities::is_valid($path);
        return static::parse_content($path);
    }

    abstract protected static function parse_content(string $path);
}
