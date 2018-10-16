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

