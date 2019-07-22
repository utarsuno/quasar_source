<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\File\UtilsFile;

/**
 * Class UtilsCSV
 * @package QuasarSource\Utils\File\Discrete
 */
final class UtilsCSV extends UtilsFile {

    /**
     * @param  string $path
     * @return array
     */
    public static function get(string $path): array {
        self::is_valid($path);
        $content   = [];
        $lines     = parent::get($path);
        $num_lines = count($lines);
        # first line is headers.
        $headers   = self::split_csv($lines[0]);
        $index     = 1;
        while ($index < $num_lines) {
            $content[] = self::split_csv($lines[$index]);
            ++$index;
        }
        return [$headers, $content];
    }

    /**
     * @param  string $line
     * @return array
     */
    private static function split_csv(string $line): array {
        $contents     = STR::split($line, ',');
        $len_contents = count($contents);
        if (STR::ends_with($contents[$len_contents - 1], PHP_EOL)) {
            $contents[$len_contents - 1] = trim($contents[$len_contents - 1]);
        }
        return $contents;
    }
}
