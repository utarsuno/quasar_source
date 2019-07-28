<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType\Object;

/**
 * Class UtilsInteger
 * @package QuasarSource\Utils
 */
abstract class UtilsInteger {

    /**
     * @param  int  $n      [the number of bytes                               ]
     * @param  bool $signed [should byte representation support negative values]
     * @return int          [base 10 representation of the max value possible  ]
     */
    public static function get_max_value_for_n_bytes(int $n, bool $signed=true): int {
        return $signed ? (2 ** (($n * 8) - 1)) - 1 : (2 ** ($n * 8)) - 1;
    }

    /**
     * @param  int  $n      [the number of bytes                               ]
     * @param  bool $signed [should byte representation support negative values]
     * @return int          [base 10 representation of the min value possible  ]
     */
    public static function get_min_value_for_n_bytes(int $n, bool $signed=true): int {
        return $signed ? -(2 ** (($n * 8) - 1)) : 0;
    }

}
