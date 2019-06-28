<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits\PatternParentChild;
use QuasarSource\Utilities\Exception\LogicException;


trait TraitPatternParent {

    private $children = [];
    private $callback_on_child_added;

    public function has_child($child) : bool {
        foreach ($this->children as $c) {
            if ($child === $c) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param $child
     * @param bool $raise_exception_if_child_exists
     * @throws LogicException
     */
    public function add_child($child, bool $raise_exception_if_child_exists=true): void {
        if ($raise_exception_if_child_exists && $this->has_child($child)) {
            throw LogicException::invalid_function_call('add_child', 'Can not add child to parent when it already exists!');
        }
        $this->children[] = $child;
        if (!$child->has_parent()) {
            $child->set_parent($this);
        }
        if ($this->callback_on_child_added !== null) {
            call_user_func($this->callback_on_child_added, $child);
        }
    }

    protected function set_on_child_added($function): void {
        $this->callback_on_child_added = $function;
    }

    public function get_children(): array {
        return $this->children;
    }
}
