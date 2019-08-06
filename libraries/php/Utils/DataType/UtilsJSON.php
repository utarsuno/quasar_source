<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType\Object;

use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class UtilsHex
 * @package QuasarSource\Utils
 */
abstract class UtilsJSON {

    private const REMOVE_TERMS = [',}]', ',]}', '],}', '},]'];

    /**
     * @param  string|array $json_data
     * @return string
     */
    public static function to_pretty_json($json_data): string {
        if (is_array($json_data)) {
            /*foreach ($json_data as $k => $v) {
                foreach (self::REMOVE_TERMS as $term) {
                    if (STR::has($v, $term)) {
                        throw new RuntimeException(
                            'JSON data contains value with a remove term, one of {' . json_encode(self::REMOVE_TERMS) . '}'
                        );
                    }
                }
            }*/
            $json_data = json_encode($json_data);
        }
        if (STR::ends_in($json_data, ',')) {
            STR::ref_remove_last_char($json_data);
        }
        STR::ref_replace($json_data, '\/', '/');
        foreach (self::REMOVE_TERMS as $term) {
            if (STR::has($json_data, $term)) {
                STR::ref_remove($json_data, $term);
            }
        }
        return $json_data;
    }

}
