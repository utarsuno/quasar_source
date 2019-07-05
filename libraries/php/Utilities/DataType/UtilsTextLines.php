<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities\DataType;

/**
 * Class UtilsArray
 * @package QuasarSource\Utilities\DataType
 */
abstract class UtilsTextLines {

    /**
     * @param  array  $base
     * @param  array  $pattern_match
     * @param  string $contained_text
     * @return bool
     */
    public static function does_line_after_pattern_match_contain_sub_text(array $base, array $pattern_match, string $contained_text): bool {
        $pos = UtilsArray::position_after_pattern($base, $pattern_match);
        if ($pos === -1) {
            throw new \RuntimeException('Pattern{' . json_encode($pattern_match) . '} not found in {' . json_encode($base) . '}');
        }
        $line = $base[$pos];
        return UtilsString::has($line, $contained_text);
    }

}
