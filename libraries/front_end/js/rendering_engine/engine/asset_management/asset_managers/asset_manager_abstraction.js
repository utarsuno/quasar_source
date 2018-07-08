'use strict';

$_QE.prototype.AssetManagerAbstraction = function(loader_class, engine) {
    this.loader_class = loader_class;
    this.engine       = engine;

    this._assets                            = {};

    this.assets_required_for_initial_render = [];
    this.assets_required_dynamically_loaded = [];

    this.get_asset = function(asset_name) {
        return this._assets[asset_name];
    };

    this.add_initial_render_required_asset = function(a) {
        this.assets_required_for_initial_render.push(a);
        this.engine.manager_assets.asset_set_number_to_load += 1;
    };

    this._asset_loaded = function(asset_name, asset_content) {
        this._assets[asset_name] = asset_content;
        this.engine.manager_assets.asset_loaded(asset_name);
    };

    this.load_required_initial_render_assets = function() {
        this._load_assets(this.assets_required_for_initial_render);
    };

    this.load_required_dynamically_loaded_assets = function() {
        this._load_assets(this.assets_required_dynamically_loaded);
    };

    this._load_assets = function(assets_to_load) {
        if (this.loader_class === null) {
            this._custom_load_assets(assets_to_load);
            return;
        }

        let number_of_loads_started = 0;
        let asset_full_path;
        let asset_name;

        while (number_of_loads_started < assets_to_load.length) {

            asset_name = assets_to_load[number_of_loads_started];

            asset_full_path = '/assets/' + asset_name;
            let loader = new this.loader_class();

            loader.load(asset_full_path,

                function(asset_content) {
                    this._asset_loaded(asset_name, asset_content);
                }.bind(this),

                function(xhr) {
                    // On success load.
                },

                function(xhr) {
                    l('Error loading asset : ' + asset_name);
                    l(xhr);
                }.bind(this)

            );

            number_of_loads_started += 1;
        }
    };

};