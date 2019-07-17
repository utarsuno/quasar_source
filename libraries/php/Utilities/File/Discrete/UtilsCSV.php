<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\File\Discrete;

use QuasarSource\Utilities\DataType\UtilsString as STR;
use QuasarSource\Utilities\File\UtilsFile;

/**
 * Class UtilsCSV
 * @package QuasarSource\Utilities\File\Discrete
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
        $content[] = self::split_csv($lines[0]);
        $index     = 1;
        while ($index < $num_lines) {
            $content[] = self::split_csv($lines[$index]);
            ++$index;
        }
        return $content;
    }

    /**
     * @param string $line
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
