<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits\PatternParentChild;


trait TraitPatternParentAndChild {
    use TraitPatternChild;
    use TraitPatternParent;

    public function is_root_parent() : bool {
        return $this->parent === null;
    }

    public function get_root_parent() {
        if ($this->is_root_parent()) {
            return $this;
        }
        return $this->parent->get_root_parent();
    }
}
