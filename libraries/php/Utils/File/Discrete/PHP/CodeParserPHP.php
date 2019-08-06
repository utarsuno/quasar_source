<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete\PHP;

use QuasarSource\Utils\DataType\UtilsArray     as ARY;
use QuasarSource\Utils\DataType\UtilsString    as STR;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use RuntimeException;

/**
 * Class CodeParserPHP
 * @package QuasarSource\Utils\File\Discrete\PHP
 */
abstract class CodeParserPHP {

    /**
     * @param  string $variable_name
     * @param  array  $array
     * @return array
     */
    private static function array_as_code(string $variable_name, array $array): array {
        $code   = [];
        $code[] = '$' . $variable_name . ' += [' . PHP_EOL;
        $inner  = [];
        foreach ($array as $k => $v) {
            $inner[] = "\t'" . $k . "' => '" . $v . "'," . PHP_EOL;
        }
        $clean_assignment_lines = TEXT_LINES::column_aligned($inner, '=>');
        foreach ($clean_assignment_lines as $l) {
            $code[] = $l;
        }
        $code[] = '];' . PHP_EOL;
        return $code;
    }

    #$marker_one = '{A U T O   G E N E R A T E D   C O D E}:{0x0}';
    #$maker_end  = '{E N D}:{0x0}';

    /**
     * @param  array  $code_lines
     * @param  string $array_name
     * @param  array  $replacement
     * @return array
     */
    public static function replace_array(array $code_lines, string $array_name, array $replacement): array {
        $new_code    = [];
        $after_split = [];
        $i           = 0;
        $num         = count($code_lines);
        $inside      = false;
        $got_in      = false;

        while ($i < $num) {
            $line = $code_lines[$i];
            switch (STR::get_match_index($line, ['{A U T O   G E N E R A T E D   C O D E}:{0x0}', '{E N D}:{0x0}'])) {
                case 0:
                    if ($inside) {
                        throw new RuntimeException('Invalid auto-generated-code syntax!');
                    }
                    $got_in     = true;
                    $inside     = true;
                    $new_code[] = $line;
                    break;
                case 1:
                    if (!$inside) {
                        throw new RuntimeException('Invalid auto-generated-code syntax!');
                    }
                    $inside        = false;
                    $after_split[] = $line;
                    break;
                default:
                    if (!$inside) {
                        if ($got_in) {
                            $after_split[] = $line;
                        } else {
                            $new_code[] = $line;
                        }
                    }
                    break;
            }
            ++$i;
        }
        #$sections = UtilsTextLines::parse_into_sections($code_lines, [$marker_one, $maker_end]);
        if ($inside || !$got_in) {
            throw new RuntimeException('Invalid auto-generated-code syntax!');
        }
        #$replaced_code = self::array_as_code($array_name, $replacement);
        #return ARY::add_vals_from_3($new_code, $before_split, $replaced_code, $after_split);
        #return ARY::add_vals_from_2($new_code, $replaced_code, $after_split);
        return ARY::add_vals_from_3($new_code, self::array_as_code($array_name, $replacement), $after_split, []);
    }

}
