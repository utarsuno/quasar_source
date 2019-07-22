<?php declare(strict_types=1);

namespace QuasarSource\Utils;

/**
 * Interface InterfaceDivisible
 * @package QuasarSource\Utils
 */
interface InterfaceDivisible {

    /*__   ___        __                  __
     |__) |__   |\/| /  \ \  /  /\  |    /__`
     |  \ |___  |  | \__/  \/  /~~\ |___ .__/ */

    /**
     * @param  mixed $base
     * @param  int   $num_to_remove
     * @return mixed
     */
    public static function remove_first_n($base, int $num_to_remove);

    /**
     * @param  mixed $base
     * @param  int   $num_to_remove
     * @return void
     */
    public static function ref_remove_first_n(& $base, int $num_to_remove): void;

}
