<?php declare(strict_types=1);

namespace QuasarSource\Utils\Time;

/**
 * Class UtilsUnixTime
 * @package QuasarSource\Utils\Time
 */
abstract class UtilsUnixTime {

    private const ONE_DAY_IN_SECONDS  = 86400.0;
    private const ONE_HOUR_IN_SECONDS = 3600;

    /**
     * @param  string $datetime
     * @return int
     */
    public static function parse_string_date(string $datetime): int {
        return strtotime($datetime);
    }

    /**
     * @param  float $unix_time
     * @return float
     */
    public static function convert_to_days(float $unix_time): float {
        return $unix_time / self::ONE_DAY_IN_SECONDS;
    }

    /**
     * @param  float $unix_time
     * @return float
     */
    public static function convert_to_hours(float $unix_time): float {
        return $unix_time / self::ONE_HOUR_IN_SECONDS;
    }

    /**
     * @param  float $time_instance_from
     * @return float
     */
    public static function delta_to_now(float $time_instance_from): float {
        return microtime(true) - $time_instance_from;
    }

    /**
     * @param  float $time_instance_from
     * @return float
     */
    public static function delta_to_now_in_hours(float $time_instance_from): float {
        return (microtime(true) - $time_instance_from) / self::ONE_HOUR_IN_SECONDS;
    }

    /**
     * @return string
     */
    public static function now_as_string(): string {
        return number_format(microtime(true) * 1000,0,'.','');
    }

    /**
     * @return int
     */
    public static function now(): int {
        return time();
    }

    /**
     * @return float
     */
    public static function now_as_float(): float {
        return microtime(true);
    }

    /**
     * @param  int $t0
     * @param  int $t1
     * @return float
     */
    public static function difference_in_days(int $t0, int $t1): float {
        return ($t1 - $t0) / self::ONE_DAY_IN_SECONDS;
    }

}