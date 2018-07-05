'use strict';


$_QE.prototype.ServerRequest = function() {

    this.binded_button = null;

    this.bind_to_button = function(button_to_bind_to) {
        this.binded_button = button_to_bind_to;
        this.binded_button.add_button_state();
    };

    this.lock_button = function() {
        if (is_defined(this.binded_button)) {
            this.binded_button.lock();
        }
    };

    this.unlock_button = function() {
        if (is_defined(this.binded_button)) {
            this.binded_button.unlock();
        }
    };
};