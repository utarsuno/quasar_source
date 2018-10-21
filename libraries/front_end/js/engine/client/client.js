'use strict';

$_QE.prototype.Client = function(engine) {
    this.engine   = engine;
    this.renderer = null;

    this._check_supported_features();

    this.full_initialize = function() {
        if (this._features.is_enabled(CLIENT_FEATURE_FULL_SCREEN)) {
            $_QE.prototype.ClientFunctionalityFullScreen.call(this);
        }
        if (this._features.is_enabled(CLIENT_FEATURE_POINTER_LOCK)) {
            $_QE.prototype.ClientFunctionalityPointerLock.call(this);
        }

        //$_QE.prototype.ClientFunctionalityWindowFocus.call(this);
        window.addEventListener('resize', this.on_window_resize.bind(this), true);
    };

};


/*
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
 */