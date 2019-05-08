<?php


namespace QuasarSource\Utilities\Files;
use \QuasarSource\Utilities\Files\FileUtilities as UFO;

abstract class AbstractFileParser {

    public static function get_content(string $path) {
        UFO::is_valid($path);
        return static::parse_content($path);
    }

    abstract protected static function parse_content(string $path);
}
