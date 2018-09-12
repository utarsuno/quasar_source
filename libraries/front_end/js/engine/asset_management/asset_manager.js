'use strict';

$_QE.prototype.AssetManager = function(engine) {

    this.engine = engine;

    this.shader_spritesheet_fragment = ''; // #pre-process_get_shader_spritesheet.frag
    this.shader_spritesheet_vertex   = ''; // #pre-process_get_shader_spritesheet.vert
    this.shader_film_fragment        = ''; // #pre-process_get_shader_film.frag
    this.shader_film_vertex          = ''; // #pre-process_get_shader_film.vert
    this.shader_transition_fragment  = ''; // #pre-process_get_shader_transition.frag
    this.shader_transition_vertex    = ''; // #pre-process_get_shader_transition.vert

    this._assets = {};

    this.on_asset_load = function(asset_name, asset_data) {
        l('Loaded {' + asset_name + '}');
        this._assets[asset_name] = asset_data;
    };

    this.get_asset = function(asset_name) {
        return this._assets[asset_name];
    };

    this.load_pre_render_assets = function() {
        let me          = this;
        let asset_batch = new $_QE.prototype.AssetBatch();
        let asset_needed;

        if (engine.engine_setting_shaders_enabled) {
            if (engine.engine_setting_shader_transition_enabled) {
                asset_needed = new $_QE.prototype.AssetFile(ASSET_TEXTURE_TRANSITION, ASSET_TYPE_TEXTURE, null);
                asset_batch.add_asset(asset_needed);
                asset_batch.add_asset(new $_QE.prototype.AssetFile(ASSET_SHADER_MATERIAL_TRANSITION, ASSET_TYPE_SHADER_MATERIAL, asset_needed));
            }
            if (engine.engine_setting_spritesheet_enabled) {
                asset_needed = new $_QE.prototype.AssetFile(ASSET_TEXTURE_SPRITE_SHEET, ASSET_TYPE_TEXTURE, null);
                asset_batch.add_asset(asset_needed);
                asset_batch.add_asset(new $_QE.prototype.AssetFile(ASSET_SHADER_MATERIAL_SPRITE_SHEET, ASSET_TYPE_SHADER_MATERIAL, asset_needed));

            }
            if (engine.engine_setting_shader_grain_enabled) {
                asset_batch.add_asset(new $_QE.prototype.AssetFile(ASSET_SHADER_MATERIAL_NOISE, ASSET_TYPE_SHADER_MATERIAL, null));
            }
            asset_batch.add_asset(new $_QE.prototype.AssetFile(ASSET_TEXTURE_FONT_DEFAULT, ASSET_TYPE_TEXTURE, null));
        }

        $_QE.prototype.CANVAS_FONT_SMALLER = ['16px Arial', 16, 3];
        $_QE.prototype.CANVAS_FONT_LARGER  = ['20px Arial', 20, 4];

        return new Promise(function(resolve, reject) {
            asset_batch.load_batch().then(function() {
                resolve();
            }).catch(function(error) {
                reject(error);
            });
        });
    };

};
