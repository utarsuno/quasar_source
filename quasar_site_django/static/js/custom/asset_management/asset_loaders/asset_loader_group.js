'use strict';

const ASSET_GROUP_AUDIO   = 'audio/';   // #pre-process_global_constant
const ASSET_GROUP_TEXTURE = 'texture/'; // #pre-process_global_constant
const ASSET_GROUP_SHADER  = 'shaders/'; // #pre-process_global_constant
const ASSET_GROUP_JSON    = 'json/';    // #pre-process_global_constant

function AssetLoaderGroup(asset_group_type, loading_manager, fully_loaded_callback) {

    this._loading_manager = loading_manager;
    this._loading_manager.asset_groups.push(this);

    this._fully_loaded_callback = fully_loaded_callback;

    this._asset_base_url = '/home/git_repos/quasar_source/quasar_site_django/static/assets/' + asset_group_type;
    this._assets = {};
    this._number_of_assets_to_load = 0;
    this._number_of_assets_loaded  = 0;

    this._add_required_initial_asset = function(asset_name) {
        this._assets[asset_name] = null;
        this._number_of_assets_to_load += 1;
    };

    this._initial_assets_to_load_set = function() {
        this._loading_manager._number_of_resources_to_load += this._number_of_assets_to_load;
    };

    this._add_required_initial_assets(this._initial_assets_to_load_set.bind(this));

    this._asset_loaded = function(asset_name) {
        this._loading_manager.asset_loaded(asset_name);
        this._number_of_assets_loaded += 1;
        if (this._number_of_assets_to_load === this._number_of_assets_loaded) {
            this._loading_manager._number_of_asset_groups_loaded += 1;
            this._fully_loaded_callback();
        }
    };

    this.load_assets = function() {
        let asset;
        for (asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {

                let loader = new this.loader_class();
                loader.load(this._asset_base_url + asset,

                    function(asset_name) {
                        this.send_asset_to(asset_name, arguments[1]);
                        this._asset_loaded(asset_name);
                    }.bind(this, asset),

                    function(xhr) {
                        // On success load.
                    },

                    function(xhr) {
                        l('Error loading asset : ' + arguments[0]);
                        l('Error was :');
                        l(xhr);
                    }.bind(this, asset)

                );

            }
        }
    };

}