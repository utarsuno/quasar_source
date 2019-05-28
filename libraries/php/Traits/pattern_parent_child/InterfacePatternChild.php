<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 23:54
 */

namespace QuasarSource\Traits\PatternParentChild;


Interface InterfacePatternChild {

    public function set_parent($parent, bool $raise_exception_if_parent_exists=true): void;

    public function has_parent();

    public function get_parent();

}
