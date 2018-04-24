'use strict';

function JSONGroup(loading_manager, fully_loaded_callback) {
    this.__init__(loading_manager, fully_loaded_callback);
}

JSONGroup.prototype = {

    __init__: function(loading_manager, fully_loaded_callback) {
        // Inherit.
        AssetGroup.call(this, ASSET_GROUP_JSON, loading_manager, fully_loaded_callback);
    },

    _json_object_loaded: function(json_object, asset_name) {
        MANAGER_JSON.set_json_object(asset_name, json_object);

        this._asset_loaded(asset_name);
    },

    load_assets: function() {
        let asset;
        for (asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {

                let loader = new THREE.JSONLoader();
                loader.load(this._asset_base_url + asset,

                    function (json_object) {
                        this._json_object_loaded(arguments[1], arguments[0]);
                    }.bind(this, asset),

                    function (xhr) {
                        // On load % success.
                    },

                    function(xhr) {
                        l('Error loading asset : ' + arguments[0]);
                    }.bind(this, asset)

                );

            }
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
    _add_required_initial_assets: function(callback) {
        this._add_required_initial_asset(JSON_SPRITESHEET);
        callback();
    }
};