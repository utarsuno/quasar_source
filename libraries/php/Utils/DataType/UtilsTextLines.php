<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType;

use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\DataType\UtilsArray  as ARY;
use RuntimeException;

/**
 * Class UtilsArray
 * @package QuasarSource\Utils\DataType
 */
abstract class UtilsTextLines {

    /**
     * @param  array  $lines
     * @param  string $start
     * @param  string $end
     * @param  array  $insert
     * @return array
     */
    public static function insert_lines_inbetween(array $lines, string $start, string $end, array $insert): array {
        $processed = [];
        $started   = false;
        foreach ($lines as $line) {
            if (STR::has($line, $start)) {
                if ($started) {
                    throw new RuntimeException('Start pattern found twice{' . $start . '}');
                }
                $started     = true;
                $processed[] = $line;
            } else if (STR::has($line, $end)) {
                if (!$started) {
                    throw new RuntimeException('End pattern found before start{' . $end . '}');
                }
                UtilsArray::ref_append_values($processed, $insert);
                $processed[] = $line;
            } else {
                $processed[] = $line;
            }
        }
        if (count($processed) === count($lines)) {
            throw new RuntimeException('Did not find start-end patterns in lines provided! Start{' . $start . '} End{' . $end . '}');
        }
        return $processed;
    }

    /**
     * @param  string|array $lines
     * @param  string       $align_on
     * @return array
     */
    public static function column_aligned($lines, string $align_on): array {
        $depths = [];
        if (is_string($lines)) {
            $lines = STR::split_clean($lines);
        }
        foreach ($lines as $line) {
            $depths[] = STR::position_of($line, $align_on, false);
        }
        $num_lines = count($lines);
        $max_depth = ARY::max($depths);
        for ($i = 0; $i < $num_lines; $i++) {
            $lines[$i] = STR::insert_before($lines[$i], str_repeat(' ', $max_depth - $depths[$i]), $align_on);
        }
        return $lines;
    }

    /**
     * @param  array  $text_lines
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
        #(is_array($pattern) && STR::has_any($line, $pattern)) || (is_string($pattern) && STR::has($line, $pattern))
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
