<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits\PatternParentChild;

use QuasarSource\Utils\Exception\LogicException;

trait TraitPatternChild {

    protected $parent;
    private $callback_on_parent_set;

    public function has_parent() : bool {
        return $this->parent !== null;
    }

    /**
     * @param $parent
     * @param bool $raise_exception_if_parent_exists
     * @throws LogicException
     */
    public function set_parent($parent, bool $raise_exception_if_parent_exists=true): void {
        if ($raise_exception_if_parent_exists && ($this->parent !== null && $parent !== $this->parent)) {
            throw LogicException::invalid_function_call('set_parent', 'Can not set parent when current parent is not null!');
        }
        $this->parent = $parent;
        if (!$this->parent->has_child($this)) {
            $this->parent->add_child($this);
        }
        if ($this->callback_on_parent_set !== null) {
            call_user_func($this->callback_on_parent_set, $parent);
        }
    }

    public function get_parent() {
        return $this->parent;
    }

    protected function set_on_parent_set($function): void {
        $this->callback_on_parent_set = $function;
    }

}
