import State from 'state';

let FiniteStateMachine = function() {};

FiniteStateMachine.prototype = {

    __init__state_machine: function() {
        this.state_current  = null;
        this.state_previous = null;
        this.states         = [];
    },

    add_state: function(state_id, state_exit_function, state_enter_function) {
        let state = new State.State(state_id, state_exit_function, state_enter_function);
        this.states.push(state);
        return state;
    },

    _get_state: function(state) {
        let s;
        for (s = 0; s < this.states.length; s++) {
            if (this.states[s].id === state) {
                return this.states[s];
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

export default {
    FiniteStateMachine: FiniteStateMachine
}