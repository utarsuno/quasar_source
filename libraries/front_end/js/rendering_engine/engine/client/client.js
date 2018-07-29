'use strict';

$_QE.prototype.Client = function() {

    this._features = [];

    this.is_mobile = function() {
        return this._feature_mobile.is_enabled;
    };

    this.on_engine_load = function() {
        // Add the required features.
        this._features.push(new $_QE.prototype.ClientFeatureCanvas());
        this._features.push(new $_QE.prototype.ClientFeatureWebGL());

        // Inherit functionalities needed.
        $_QE.prototype.ClientFunctionalityPauseMenu.call(this);
        $_QE.prototype.ClientFunctionalityCookies.call(this);
    };

    this.ensure_required_features_are_enabled = function() {
        let f = this._features.length - 1;
        while (f >= 0) {
            if (this._features[f].is_required && !this._features[f].is_enabled) {
                this.show_error(this._features[f].name, 'is not enabled');
                return false;
            }
            f--;
        }
        return true;
    };

    this.full_initialize = function() {
        this._features.push(new $_QE.prototype.ClientFeatureWebWorkers());
        this._feature_mobile = new $_QE.prototype.ClientFeatureMobile();
        this._features.push(this._feature_mobile);
        this._features.push(new $_QE.prototype.ClientFeatureVirtualReality());
        let feature = new $_QE.prototype.ClientFeatureFullScreen();
        this._features.push(feature);
        if (feature.is_enabled) {
            $_QE.prototype.ClientFunctionalityFullScreen.call(this);
        }
        feature = new $_QE.prototype.ClientFeaturePointerLock();
        this._features.push(feature);
        if (feature.is_enabled) {
            $_QE.prototype.ClientFunctionalityPointerLock.call(this);
        }

        //$_QE.prototype.ClientFunctionalityWindowFocus.call(this);
        $_QE.prototype.ClientFunctionalityWindowResize.call(this);
        $_QE.prototype.ClientFunctionalityDebug.call(this);
    };

    //////

    this.renderer = null;

    this.pre_render_initialize = function(renderer) {
        this.renderer = renderer;
        this._fetch_window_dimensions();
        this.renderer.pre_render_initialize();

        //this.initialize_window_resize();
    };

    this.resume = function() {
        this.hide_pause_menu();
        if (!this.is_mobile()) {
            this.request_pointer_lock();
        }
        QE.reset_delta();
    };

};
