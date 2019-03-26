<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits;

trait TraitPatternName {

    protected $name;

    public function set_name(string $name) : void {
        $this->name = $name;
    }

    public function get_name() : string {
        return $this->name;
    }

    public function __toString() : string {
        return $this->name;
    }
}
