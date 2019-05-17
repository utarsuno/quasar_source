let State = function(state_id, on_enter, on_exit) {
    this.id       = state_id;
    this.on_enter = on_enter;
    this.on_exit  = on_exit;
};

State.prototype = {
    enter: function() {
        if (this.on_enter !== null) {
            this.on_enter();
        }
    },
    exit: function() {
        if (this.on_exit !== null) {
            this.on_exit();
        }
    }
};

export default {
    State: State
}
