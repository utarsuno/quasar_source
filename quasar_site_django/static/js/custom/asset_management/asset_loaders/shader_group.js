'use strict';

function ShaderGroup(loading_manager, fully_loaded_callback) {
    this.__init__(loading_manager, fully_loaded_callback);
}

ShaderGroup.prototype = {

    __init__: function(loading_manager, fully_loaded_callback) {
        // Inherit.
        AssetGroup.call(this, ASSET_GROUP_SHADER, loading_manager, fully_loaded_callback);
    },

    _shader_loaded: function(shader, asset_name) {
        MANAGER_SHADER.set_shader(asset_name, shader);

        this._asset_loaded(asset_name);
    },

    load_assets: function() {
        let asset;
        for (asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {

                let loader = new THREE.FileLoader();
                loader.load(this._asset_base_url + asset,

                    function(shader) {
                        this._shader_loaded(arguments[1], arguments[0]);
                    }.bind(this, asset),

                    function(xhr) {
                        // On load % success.
                    },

                    function(xhr) {
                        l('Error loading shader : ' + arguments[0]);
                    }.bind(this, asset)

                );
            }
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
    _add_required_initial_assets: function(callback) {
        this._add_required_initial_asset(SHADER_TRANSITION_FRAGMENT);
        this._add_required_initial_asset(SHADER_TRANSITION_VERTEX);
        this._add_required_initial_asset(SHADER_NOISE_FRAGMENT);
        this._add_required_initial_asset(SHADER_NOISE_VERTEX);
        callback();
    }
};