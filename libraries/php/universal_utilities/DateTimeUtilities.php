<?php

namespace QuasarSource\Utilities;
use DateTime;


abstract class DateTimeUtilities {

    public static function unix_timestamp(): string {
        return number_format(microtime(true) * 1000,0,'.','');
    }

    public static function now(): DateTime {
        return new DateTime('now');
    }

    public static function is_not_today(DateTime $dt): bool {
        return self::is_different_day($dt, self::now());
    }

    public static function is_different_day(DateTime $dt0, DateTime $dt1): bool {
        return date_format($dt0, 'Ymd') !== date_format($dt1, 'Ymd');
    }

}
