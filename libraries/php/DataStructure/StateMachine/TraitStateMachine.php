<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\StateMachine;

use RuntimeException;

/**
 * Trait TraitStateMachine
 * @package QuasarSource\DataStructure\StateMachine
 * @internal optional_func(string $func_name)
 */
trait TraitStateMachine {

    /** @var array $states */
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
            $this->states[$state] = false;
        }
        if ($default_state !== null) {
            $this->state_set_default($default_state);
        }
    }

    /**
     * @param string $state
     */
    protected function state_add(string $state): void {
        $this->states[$state] = false;
    }

    /**
     * @param  string $state
     * @return bool
     */
    protected function state_is_on(string $state): bool {
        return $this->states[$state];
    }

    /**
     * @param string $state
     */
    protected function state_enter($state): void {
        if ($this->state_current === $state) {
            throw new RuntimeException('Can\'t enter the same state!');
        }
        if ($this->state_previous !== null) {
            $this->optional_func('state_on_exit_' . $state);
            $this->states[$this->state_current] = false;
            $this->state_previous               = $this->state_current;
        }
        $this->state_current  = $state;
        $this->states[$state] = true;
        $this->optional_func('state_on_enter_' . $state);
    }

    /**
     * @param  string $state_name
     * @return void
     */
    protected function state_set_default($state_name): void {
        $this->state_add($state_name);
        $this->state_enter($state_name);
    }
}
