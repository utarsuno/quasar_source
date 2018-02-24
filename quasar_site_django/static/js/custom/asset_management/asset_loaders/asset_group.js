'use strict';

function AssetGroup(asset_group_type, loading_manager, fully_loaded_callback) {

    this._loading_manager = loading_manager;
    this._fully_loaded_callback = fully_loaded_callback;

    this._asset_base_url = '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/' + asset_group_type + '/';
    this._assets = {};
    this._number_of_assets_to_load = 0;
    this._number_of_assets_loaded  = 0;

    this._loaded = false;

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
            this._loaded = true;
            this._fully_loaded_callback();
        }
    };
}