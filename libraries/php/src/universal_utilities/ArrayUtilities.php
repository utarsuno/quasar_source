<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities;
require_once '/quasar_source/libraries/php/autoload.php';


class ArrayUtilities {

    public static function remove_first_n(array & $array, int $number_to_remove) : void {
        $array = array_slice($array, $number_to_remove);
    }

}
