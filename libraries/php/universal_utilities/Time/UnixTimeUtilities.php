<?php declare(strict_types=1);

namespace QuasarSource\Utilities\Time;


abstract class UnixTimeUtilities {

    public static function now_as_string(): string {
        return number_format(microtime(true) * 1000,0,'.','');
    }

    public static function now(): int {
        return time();
    }

    public static function difference_in_days(int $t0, int $t1): float {
        return ($t1 - $t0) / 86400.0;
    }

}