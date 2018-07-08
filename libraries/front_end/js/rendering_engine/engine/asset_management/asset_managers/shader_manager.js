'use strict';

$_QE.prototype.ShaderManager = function(engine) {
    $_QE.prototype.AssetManagerAbstraction.call(this, null, engine);

    this._shader_spritesheet_fragment = ''; // #pre-process_get_shader_spritesheet.frag
    this._shader_spritesheet_vertex   = ''; // #pre-process_get_shader_spritesheet.vert
    this._shader_film_fragment        = ''; // #pre-process_get_shader_film.frag
    this._shader_film_vertex          = ''; // #pre-process_get_shader_film.vert
    this._shader_transition_fragment  = ''; // #pre-process_get_shader_transition.frag
    this._shader_transition_vertex    = ''; // #pre-process_get_shader_transition.vert

    this._assets[ASSET_SHADER_MATERIAL_TRANSITION]  = null;
    this._assets[ASSET_SHADER_MATERIAL_NOISE]       = null;
    this._assets[ASSET_SHADER_MATERIAL_SPRITESHEET] = null;

    this._assets[ASSET_SHADER_SPRITESHEET_FRAGMENT] = this._shader_spritesheet_fragment;
    this._assets[ASSET_SHADER_SPRITESHEET_VERTEX]   = this._shader_spritesheet_vertex;
    this._assets[ASSET_SHADER_TRANSITION_FRAGMENT]  = this._shader_transition_fragment;
    this._assets[ASSET_SHADER_TRANSITION_VERTEX]    = this._shader_transition_vertex;
    this._assets[ASSET_SHADER_NOISE_FRAGMENT]       = this._shader_film_fragment;
    this._assets[ASSET_SHADER_NOISE_VERTEX]         = this._shader_film_vertex;

    this._custom_load_assets = function(assets_to_load) {
        let number_of_loads_started = 0;
        while (number_of_loads_started < assets_to_load.length) {
            this._check_if_shader_is_loaded(assets_to_load[number_of_loads_started]);
            this.engine.manager_assets.asset_loaded(assets_to_load[number_of_loads_started]);
            number_of_loads_started += 1;
        }
    };

    this._check_if_shader_is_loaded = function(shader) {
        if (this._assets[shader] === null) {
            switch(shader) {
            case ASSET_SHADER_MATERIAL_TRANSITION:
                this._assets[shader] = new $_QE.prototype.ShaderMaterialTransition();
                break;
            case ASSET_SHADER_MATERIAL_NOISE:
                this._assets[shader] = new $_QE.prototype.ShaderMaterialNoise();
                break;
            case ASSET_SHADER_MATERIAL_SPRITESHEET:
                this._assets[shader] = new $_QE.prototype.ShaderMaterialSpriteSheet();
                break;
            }
        }
    };
};