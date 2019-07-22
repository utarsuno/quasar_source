<?php declare(strict_types=1);

namespace QuasarSource\Finance;

use http\Exception\InvalidArgumentException;

/**
 * Class UtilsFinance
 * @package QuasarSource\Finance
 */
abstract class UtilsFinance {

    /**
     * @param  $cash_value
     * @return int
     */
    public static function parse_cash_to_pennies($cash_value): int {
        if (is_int($cash_value)) {
            return $cash_value * 100;
        }
        if (is_float($cash_value)) {
            return self::round_cash_float($cash_value);
        }
        if (is_string($cash_value)) {
            return self::round_cash_float((float) $cash_value);
        }
        throw new InvalidArgumentException(
            'CashValue must be an int, string, or float. Got{' . gettype($cash_value) . '} instead!'
        );
    }

    /**
     * @param  int $pennies
     * @return string
     */
    public static function parse_pennies_to_cash(int $pennies): string {
        if ($pennies === 0) {
            return '$0';
        }
        $cash = $pennies < 0 ? '-$' : '$';
        if ($pennies < 100 && $pennies > -100) {
            return $cash . '0.' . $pennies;
        }
        return $cash . self::unround_pennies($pennies);
    }

    /**
     * @param  float $val
     * @return int
     */
    private static function round_cash_float(float $val): int {
        return (int) round($val * 100.0, 2, PHP_ROUND_HALF_UP);
    }

    /**
     * @param int $val
     * @return int
     */
    protected static function unround_pennies(int $val): int {
        return (int) round($val / 100.0, 2, PHP_ROUND_HALF_UP);
    }

}
