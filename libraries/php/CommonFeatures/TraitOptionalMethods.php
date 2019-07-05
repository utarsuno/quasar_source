<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\CommonFeatures;

/**
 * Trait TraitOptionalMethods
 * @package QuasarSource\CommonFeatures
 */
trait TraitOptionalMethods {

    /**
     * @param  string $func_name
     * @return mixed|null
     */
    protected function optional_func(string $func_name) {
        if (method_exists($this, $func_name)) {
            return $this->$func_name();
        }
        return null;
    }

    /**
     * @param  string $func_name
     * @param  mixed  $arg
     * @return mixed|null
     */
    protected function optional_func_with_arg(string $func_name, $arg) {
        if (method_exists($this, $func_name)) {
            return $this->$func_name($arg);
        }
        return null;
    }

}
