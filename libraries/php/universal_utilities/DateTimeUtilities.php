<?php


namespace QuasarSource\Utilities;


use DateTime;

class DateTimeUtilities {

    public static function now() : DateTime {
        return new DateTime('now');
    }

}
