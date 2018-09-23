'use strict';

$_QE.prototype.DynamicallyLoadable = function() {

    this.is_loaded = false;

    this.notify_function = null;

    this.finished_loading = function() {
        if (this.notify_function != null) {
            this.notify_function();
        }
    };

};