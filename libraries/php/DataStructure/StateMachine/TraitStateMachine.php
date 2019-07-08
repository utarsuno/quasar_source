<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\StateMachine;

use RuntimeException;

/**
 * Trait TraitStateMachine
 * @package QuasarSource\DataStructure\StateMachine
 * @internal optional_func(string $func_name)
 */
trait TraitStateMachine {

    /**
     * Schema:
     *   0 => <active>
     *   1 => <num_entries>
     *   2 => <is_meeseeks>
     *
     * @var array $states
     */
    protected $states = [];

    /** @var string $state_previous */
    protected $state_previous;

    /** @var string $state_current */
    protected $state_current;

    /**
     * @param array  $states
     * @param string $default_state
     */
    protected function init_trait_state_machine(array $states, $default_state=null): void {
        foreach ($states as $state) {
            $this->state_add($state);
        }
        if ($default_state !== null) {
            $this->state_set_default($default_state);
        }
    }

    protected function destruct_trait_state_machine(): void {
        unset($this->state_previous, $this->state_current, $this->states);
    }

    /**
     * @param string $state
     * @param bool $meeseeks_state
     */
    protected function state_add(string $state, bool $meeseeks_state=false): void {
        $this->states[$state] = [false, 0, $meeseeks_state];
    }

    /**
     * @param string $state
     */
    protected function state_enter(string $state): void {
        if ($this->state_current === $state) {
            throw new RuntimeException('Can\'t enter the same state!');
        }
        if ($this->state_current !== null) {
            $this->state_previous = $this->state_current;
            $this->optional_func_with_arg('state_on_exit_' . $this->state_current, $state);
            $this->_state_exit($this->state_current);
        }
        $this->_state_enter($state);
    }

    /**
     * @param string $state
     */
    private function _state_enter(string $state): void {
        $this->state_current     = $state;
        $this->states[$state][0] = true;
        ++$this->states[$state][1];
        if ($this->state_is_meeseeks($state) && $this->state_num_enters($state) > 1) {
            throw new RuntimeException('Can\'t re-enter a meeseeks state{' . $state . '}');
        }
        $this->optional_func_with_arg('state_on_enter_' . $state, $this->state_previous);
    }

    /**
     * @param string $state
     */
    protected function _state_exit(string $state): void {
        $this->states[$state][0] = false;
    }

    # ------------------------------------------------- S E T T E R S --------------------------------------------------

    /**
     * @param  string $state_name
     * @return void
     */
    protected function state_set_default($state_name): void {
        $this->state_add($state_name);
        $this->state_enter($state_name);
    }

    /**
     * @param string $state
     * @param bool $on
     */
    protected function state_set_meeseeks(string $state, bool $on=true): void {
        $this->states[$state][2] = $on;
    }

    # ------------------------------------------------- G E T T E R S --------------------------------------------------

    /**
     * @param  string $state
     * @return bool
     */
    protected function state_is_on(string $state): bool {
        return $this->states[$state][0];
    }

    /**
     * @param  string $state
     * @return int
     */
    protected function state_num_enters(string $state): int {
        return $this->states[$state][1];
    }

    /**
     * @param  string $state
     * @return bool
     */
    protected function state_is_meeseeks(string $state): bool {
        return $this->states[$state][2];
    }

}
