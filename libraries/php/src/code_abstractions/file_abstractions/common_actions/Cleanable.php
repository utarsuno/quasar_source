<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-25
 * Time: 18:13
 */

namespace QuasarSource\CodeAbstractions\File\CommonActions;

Interface Cleanable {

    public function clean() : void;

    public function is_cleanable() : bool;

    public function is_clean() : ?bool;

}

