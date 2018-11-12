'use strict';

$_QE.prototype.AssetManager = function(engine) {

    this.engine                      = engine;

    this.shader_spritesheet_fragment = ''; // #pre-process_get_shader_spritesheet.frag
    this.shader_spritesheet_vertex   = ''; // #pre-process_get_shader_spritesheet.vert
    this.shader_film_fragment        = ''; // #pre-process_get_shader_film.frag
    this.shader_film_vertex          = ''; // #pre-process_get_shader_film.vert
    this.shader_transition_fragment  = ''; // #pre-process_get_shader_transition.frag
    this.shader_transition_vertex    = ''; // #pre-process_get_shader_transition.vert
    this.shader_background_fragment  = ''; // #pre-process_get_shader_background.frag
    this.shader_background_vertex    = ''; // #pre-process_get_shader_background.vert

};

$_QE.prototype.AssetManager.prototype = {
    _assets: {},

    on_asset_load: function(asset_name, asset_data) {
        //l('Loaded {' + asset_name + '}');
        this._assets[asset_name] = asset_data;
    },

    get_asset: function(asset_name) {
        return this._assets[asset_name];
    },

    load_pre_render_assets: function() {
        //let me = this;
        let asset_batch = new $_QE.prototype.AssetBatch();
        let asset_needed;

        // if (engine.engine_setting_shaders_enabled) {
        // if (engine.engine_setting_shader_transition_enabled) {
        // if (engine.engine_setting_spritesheet_enabled) {
        // if (engine.engine_setting_shader_grain_enabled) {
        // etc ...

        asset_needed = asset_batch.add_asset_texture(ASSET_TEXTURE_TRANSITION);
        asset_batch.add_asset_shader(ASSET_SHADER_MATERIAL_TRANSITION, asset_needed);

        asset_needed = asset_batch.add_asset_texture(ASSET_TEXTURE_SPRITE_SHEET);
        asset_batch.add_asset_shader(ASSET_SHADER_MATERIAL_SPRITE_SHEET, asset_needed);

        asset_batch.add_asset_shader(ASSET_SHADER_MATERIAL_NOISE);
        asset_batch.add_asset_shader(ASSET_SHADER_MATERIAL_BACKGROUND);

        this._load_tile_batch(asset_batch);

        let self = this;

        return new Promise(function(resolve, reject) {
            asset_batch.load_batch().then(function() {
                self._initialize_icon_shader();
                resolve();
            }).catch(function(error) {
                reject(error);
            });
        });
    },

    get_icon_shader: function(icon) {
        return new $_QE.prototype.ShaderMaterialSpriteSheet(this.get_asset(ASSET_SHADER_MATERIAL_SPRITE_SHEET), icon);
    },

    _initialize_icon_shader: function() {
        this.texture             = this.get_asset(ASSET_TEXTURE_SPRITE_SHEET);
        this.texture.magFilter   = THREE.NearestFilter;
        this.texture.minFilter   = THREE.NearestFilter;
        this.texture.needsUpdate = true;
    },
};

// Eventually delete:
/*
    // For icons.
    get_icon_material: function(icon) {
        this._shader_material = this.get_asset(ASSET_SHADER_MATERIAL_SPRITE_SHEET);
        //let m                 = this._shader_material.get_clone(icon);
        //m.transparent         = true;
        //m.needsUpdate         = true;
        //
        return this._shader_material.get_clone(icon);
    },
 */