'use strict';

$_QE.prototype.ClientFunctionalityWindowFocus = function() {

    this.has_window_focus = null;

    this.on_window_focus_gain = function(event) {
        this.has_window_focus = true;
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_window_focus_loss = function(event) {
        this.has_window_focus = false;
        event.preventDefault();
        event.stopPropagation();
    };

    window.addEventListener('focus', this.on_window_focus_gain.bind(this), true);
    window.addEventListener('blur', this.on_window_focus_loss.bind(this), true);
};