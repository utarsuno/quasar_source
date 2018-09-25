'use strict';

$_QE.prototype.Client = function(engine) {
    this.engine   = engine;
    this.renderer = null;

    // Sets flags indicating which potential features are enabled on this client.
    $_QE.prototype.ClientFeatures.call(this);

    // Inherit functionalities needed.
    $_QE.prototype.ClientFunctionalityCookies.call(this);

    this.full_initialize = function() {
        if (this.is_feature_enabled(CLIENT_FEATURE_FULL_SCREEN)) {
            $_QE.prototype.ClientFunctionalityFullScreen.call(this);
        }
        if (this.is_feature_enabled(CLIENT_FEATURE_POINTER_LOCK)) {
            $_QE.prototype.ClientFunctionalityPointerLock.call(this);
        }

        //$_QE.prototype.ClientFunctionalityWindowFocus.call(this);
        $_QE.prototype.ClientFunctionalityWindowResize.call(this);
    };

};

