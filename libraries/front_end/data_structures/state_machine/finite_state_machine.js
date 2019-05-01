'use strict';

$_QE.prototype.FiniteStateMachine = function() {};

$_QE.prototype.FiniteStateMachine.prototype = {

    __init__state_machine: function() {
        this.state_current  = null;
        this.state_previous = null;
    },

    add_state: function(state_id, state_exit_function, state_enter_function) {
        let state = new $_QE.prototype.State(state_id, state_exit_function, state_enter_function);
        if (this._states === null) {
            this._states = [];
        }
        this._states.push(state);
        return state;
    },

    process_current_state: function(delta) {

    },

    _get_state: function(state) {
        let s;
        for (s = 0; s < this._states.length; s++) {
            if (this._states[s].id === state) {
                return this._states[s];
            }
        }
    },

    _set_state: function(state) {
        if (this.state_current !== state) {
            this.state_previous = this.state_current;
            if (this.state_previous !== null) {
                this.state_previous.exit();
            }
            this.state_current = state;
            this.state_current.enter();
        }
    },

    set_state: function(state) {
        if (Number.isInteger(state)) {
            this._set_state(this._get_state(state));
        } else {
            this._set_state(state);
        }
    },

    get_current_state_id: function() {
        return this.state_current.id;
    },

    is_current_state: function(state) {
        if (this.state_current === null) {
            return false;
        }
        if (Number.isInteger(state)) {
            return this.get_current_state_id() === state;
        }
        return state === this.state_current;
    },

};
