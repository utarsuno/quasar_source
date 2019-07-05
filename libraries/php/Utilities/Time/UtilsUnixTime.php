<?php declare(strict_types=1);

namespace QuasarSource\Utilities\Time;

/**
 * Class UtilsUnixTime
 * @package QuasarSource\Utilities\Time
 */
abstract class UtilsUnixTime {

    /**
     * @param float $time_instance_from
     * @return float
     */
    public static function delta_to_now(float $time_instance_from): float {
        return microtime(true) - $time_instance_from;
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

    public static function difference_in_days(int $t0, int $t1): float {
        return ($t1 - $t0) / 86400.0;
    }

}