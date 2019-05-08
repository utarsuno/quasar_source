'use strict';

$_QE.prototype.State = function(state_id, on_exit, on_enter) {
    this.id       = state_id;
    this.on_exit  = on_exit;
    this.on_enter = on_enter;
};

$_QE.prototype.State.prototype = {

    enter: function() {
        if (this.on_enter != null) {
            this.on_enter();
        }
    },

    exit: function() {
        if (this.on_exit != null) {
            this.on_exit();
        }
    }

};
