'use strict';

const ASSET_TEXUTRE_SPRITESHEET_ICONS = 'a.png';  // #pre-process_global_constant
const ASSET_TEXUTRE_TRANSITION_GRID   = 'b.png';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_FRONT      = 'f.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_BACK       = 'ba.jpg'; // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_LEFT       = 'l.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_RIGHT      = 'r.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_TOP        = 't.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_BOTTOM     = 'bo.jpg'; // #pre-process_global_constant

const ASSET_SHADER_MATERIAL_TRANSITION  = 'sm1'; // #pre-process_global_constant
const ASSET_SHADER_MATERIAL_NOISE       = 'sm2'; // #pre-process_global_constant
const ASSET_SHADER_MATERIAL_SPRITESHEET = 'sm3'; // #pre-process_global_constant

const ASSET_SHADER_SPRITESHEET_FRAGMENT = 's1';  // #pre-process_global_constant
const ASSET_SHADER_SPRITESHEET_VERTEX   = 's2';  // #pre-process_global_constant
const ASSET_SHADER_TRANSITION_FRAGMENT  = 's3';  // #pre-process_global_constant
const ASSET_SHADER_TRANSITION_VERTEX    = 's4';  // #pre-process_global_constant
const ASSET_SHADER_NOISE_FRAGMENT       = 's5';  // #pre-process_global_constant
const ASSET_SHADER_NOISE_VERTEX         = 's6';  // #pre-process_global_constant

const ASSET_REQUIRED_SPRITESHEET = 1; // #pre-process_global_constant
const ASSET_REQUIRED_FILM_SHADER = 2; // #pre-process_global_constant

$_QE.prototype.AssetManager = function(engine) {
    this.engine = engine;

    this.currently_loading = false;

    this.asset_set_number_to_load = 0;
    this.asset_set_number_loaded  = 0;

    this._initial_required_render_assets = [];

    this.asset_loaded = function(asset_name) {
        this.asset_set_number_loaded += 1;

        // TEMP.
        l('Asset loaded {' + asset_name + '}');

        if (this.asset_set_number_loaded === this.asset_set_number_to_load) {
            this.currently_loading = false;
            this.current_callback();
        }
    };

    this.add_initial_render_required_asset = function(a) {
        this._initial_required_render_assets.push(a);
    };

    this.load_required_initial_render_assets = function(callback, manager_shaders, manager_textures) {
        this.manager_textures = manager_textures;
        this.manager_shaders  = manager_shaders;
        this.current_callback = callback;
        this.currently_loading = true;

        let i;
        for (i = 0; i < this._initial_required_render_assets.length; i++) {
            switch(this._initial_required_render_assets[i]) {
            case ASSET_REQUIRED_SPRITESHEET:
                this.manager_textures.add_initial_render_required_asset(ASSET_TEXUTRE_SPRITESHEET_ICONS);
                this.manager_shaders.add_initial_render_required_asset(ASSET_SHADER_MATERIAL_SPRITESHEET);
                break;
            case ASSET_REQUIRED_FILM_SHADER:
                this.manager_shaders.add_initial_render_required_asset(ASSET_SHADER_MATERIAL_NOISE);
                break;
            }
        }

        this.manager_textures.load_required_initial_render_assets();
        this.manager_shaders.load_required_initial_render_assets();
    };


    //this.loader_finished_callback = this.check_if_initial_resources_loaded.bind(this);



};
