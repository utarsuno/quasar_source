<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType;

use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\DataType\UtilsArray  as ARY;

/**
 * Class UtilsArray
 * @package QuasarSource\Utils\DataType
 */
abstract class UtilsTextLines {

    /**
     * @param  array $text_lines
     * @param  string $pattern
     * @return array
     */
    public static function parse_out_last_section(array $text_lines, string $pattern): array {
        $last_section = null;
        $section      = [];
        $in_section   = false;
        foreach ($text_lines as $line) {
            if (STR::has($line, $pattern)) {
                if ($in_section) {
                    $last_section = $section;
                    $section      = [$line];
                } else {
                    $in_section = true;
                    $section[]  = $line;
                }
            } else if ($in_section) {
                $section[] = $line;
            }
        }
        return $last_section;
    }

    /**
     * @param  array  $text_lines
     * @param  string $pattern
     * @return array
     */
    public static function parse_into_sections(array $text_lines, string $pattern): array {
        $sections   = [];
        $section    = [];
        $in_section = false;
        foreach ($text_lines as $line) {
            if (STR::has($line, $pattern)) {
                if ($in_section) {
                    $sections[] = $section;
                    $section    = [$line];
                } else {
                    $in_section = true;
                    $section[]  = $line;
                }
            } else if ($in_section) {
                $section[] = $line;
            }
        }
        return $sections;
    }

    /**
     * @param  string $string
     * @return array
     */
    public static function parse_string(string $string): array {
        return explode(PHP_EOL, $string);
    }

    /**
     * @param  array $base
     * @param  string $start_with_text
     * @return array
     */
    public static function get_lines_starting_with(array $base, string $start_with_text): array {
        $lines = [];
        foreach ($base as $line) {
            if (STR::starts_with($line, $start_with_text)) {
                $lines[] = $line;
            }
        }
        return $lines;
    }

    /**
     * @param  array  $base
     * @param  array  $pattern_match
     * @param  string $contained_text
     * @return bool
     */
    public static function does_line_after_pattern_contain_text(array $base, array $pattern_match, string $contained_text): bool {
        $pos = ARY::position_after_pattern($base, $pattern_match);
        if ($pos === -1) {
            throw new \RuntimeException('Pattern{' . json_encode($pattern_match) . '} not found in {' . json_encode($base) . '}');
        }
        $line = $base[$pos];
        return STR::has($line, $contained_text);
    }

}
