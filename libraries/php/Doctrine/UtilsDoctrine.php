<?php declare(strict_types=1);

namespace QuasarSource\Doctrine;

use InvalidArgumentException;
use QuasarSource\Utils\DataType\Object\UtilsHex;

/**
 * Class UtilsDoctrine
 * @package QuasarSource\Doctrine
 */
abstract class UtilsDoctrine {

    /**
     * @param  $value
     * @return string|null
     */
    public static function convert_to_non_empty_string_or_null($value): ?string {
        if ($value === null) {
            return null;
        }
        if (is_array($value) && count($value) > 0) {
            return json_encode($value);
        }
        if (is_string($value)) {
            return $value;
        }
        if (is_numeric($value)) {
            return (string) $value;
        }
        throw new InvalidArgumentException(
            'Parameter type{' . gettype($value) . '} can\'t be converted to string for as a PostgreSQL value'
        );
    }

    /**
     * @param  int $value
     * @return bool
     */
    public static function does_value_fit_into_smallint(int $value): bool {
        // Max === UtilsInteger::get_max_value_for_n_bytes(2, true)
        // Min === UtilsInteger::get_min_value_for_n_bytes(2, true)
        #var_dump(UtilsInteger::get_max_value_for_n_bytes(2, true));
        #var_dump(UtilsInteger::get_min_value_for_n_bytes(2, true));
        return $value >= -32768 && $value <= 32767;
    }

    /**
     * @param  int $value
     * @return bool
     */
    public static function does_value_fit_into_int(int $value): bool {
        // Max === UtilsInteger::get_max_value_for_n_bytes(2, true)
        // Min === UtilsInteger::get_min_value_for_n_bytes(2, true)
        #var_dump(UtilsInteger::get_max_value_for_n_bytes(2, true));
        #var_dump(UtilsInteger::get_min_value_for_n_bytes(2, true));
        return $value >= -2147483648 && $value <= 2147483647;
    }

}
