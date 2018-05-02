'use strict';

const ASSET_GROUP_AUDIO   = 'audio/';   // #pre-process_global_constant
const ASSET_GROUP_TEXTURE = 'texture/'; // #pre-process_global_constant

ManagerManager.prototype.AssetLoaderGroup = function(asset_group_type, loading_manager) {
    this._loading_manager = loading_manager;
    this._loading_manager.asset_groups.push(this);
    this._loading_manager._number_of_resources_to_load += this._number_of_assets_to_load;

    this._asset_base_url = '/home/git_repos/quasar_source/quasar_site_django/static/assets/' + asset_group_type;
    this._number_of_assets_loaded  = 0;

    this._asset_loaded = function(asset_name) {
        this._loading_manager.asset_loaded(asset_name);
        this._number_of_assets_loaded += 1;
        if (this._number_of_assets_to_load === this._number_of_assets_loaded) {
            this._loading_manager._number_of_asset_groups_loaded += 1;
            //this._fully_loaded_callback();
            this._loading_manager.loader_finished_callback();
        }
    };

    this.load_assets = function() {
        let a = 0;
        let asset_full_name;
        while (a < this._number_of_assets_to_load) {
            asset_full_name = this.get_asset_path_name(a);
            let loader = new this.loader_class();
            loader.load(this._asset_base_url + asset_full_name,

                function(asset, asset_content) {
                    this.send_asset_to(asset, asset_content);
                    this._asset_loaded(asset_full_name);
                }.bind(this, a),

                //function(asset) {
                //    this.send_asset_to(asset, arguments[1]);
                //    this._asset_loaded(asset_full_name);
                //}.bind(this, a),

                function(xhr) {
                    // On success load.
                },

                function(xhr) {
                    l('Error loading asset : ' + asset_full_name);
                    l('Error was :');
                    l(xhr);
                }.bind(this, a)

            );
            a += 1;
        }
    };
};