'use strict';

$_QE.prototype.DynamicallyLoadable = function() {

    this.is_loaded = false;

    this.notify_function = null;

    this.finished_loading = function() {
        if (is_defined(this.notify_function)) {
            this.notify_function();
        }
    };

};