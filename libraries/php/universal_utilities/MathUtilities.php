<?php


namespace QuasarSource\Utilities;


class MathUtilities {

    public static function get_percentage_changed(float $base, float $new, bool $get_as_string) : float {
        if ($get_as_string) {
            return StringUtilities::formatted_number(100.0 * (1.0 - ($new / $base)));
        }
        return 1.0 - ($new / $base);
    }

}
