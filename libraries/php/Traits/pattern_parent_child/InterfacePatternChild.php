<?php declare(strict_types=1);

namespace QuasarSource\Traits\PatternParentChild;


Interface InterfacePatternChild {

    public function set_parent($parent, bool $raise_exception_if_parent_exists=true): void;

    public function has_parent();

    public function get_parent();

}
