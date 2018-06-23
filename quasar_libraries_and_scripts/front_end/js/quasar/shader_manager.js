'use strict';

const SHADER_MATERIAL_TRANSITION  = '1'; // #pre-process_global_constant
const SHADER_MATERIAL_NOISE       = '2'; // #pre-process_global_constant
const SHADER_MATERIAL_SPRITESHEET = '3'; // #pre-process_global_constant

const SHADER_SPRITESHEET_FRAGMENT = '1'; // #pre-process_global_constant
const SHADER_SPRITESHEET_VERTEX   = '2'; // #pre-process_global_constant
const SHADER_TRANSITION_FRAGMENT  = '3'; // #pre-process_global_constant
const SHADER_TRANSITION_VERTEX    = '4'; // #pre-process_global_constant
const SHADER_NOISE_FRAGMENT       = '5'; // #pre-process_global_constant
const SHADER_NOISE_VERTEX         = '6'; // #pre-process_global_constant

$_QE.prototype.ShaderManager = function() {
    this._shader_spritesheet_fragment = ''; // #pre-process_get_shader_spritesheet.frag
    this._shader_spritesheet_vertex   = ''; // #pre-process_get_shader_spritesheet.vert
    this._shader_film_fragment        = ''; // #pre-process_get_shader_film.frag
    this._shader_film_vertex          = ''; // #pre-process_get_shader_film.vert
    this._shader_transition_fragment  = ''; // #pre-process_get_shader_transition.frag
    this._shader_transition_vertex    = ''; // #pre-process_get_shader_transition.vert

    this.create_global_shader_materials = function() {
        this._all_shader_materials[SHADER_MATERIAL_TRANSITION]  = new $_QE.prototype.ShaderMaterialTransition();
        this._all_shader_materials[SHADER_MATERIAL_NOISE]       = new $_QE.prototype.ShaderMaterialNoise();
        this._all_shader_materials[SHADER_MATERIAL_SPRITESHEET] = new $_QE.prototype.ShaderMaterialSpriteSheet();
    };

    this.set_shader = function(shader_name, shader_content) {
        this._all_shaders[shader_name] = shader_content;
    };

    this.get_shader_material_abstraction = function(shader_material_name) {
        return this._all_shader_materials[shader_material_name];
    };

    this.get_shader = function(shader_name) {
        return this._all_shaders[shader_name];
    };

    this._set_shader(SHADER_SPRITESHEET_FRAGMENT, this._shader_spritesheet_fragment);
    this._set_shader(SHADER_SPRITESHEET_VERTEX, this._shader_spritesheet_vertex);

    this._set_shader(SHADER_TRANSITION_FRAGMENT, this._shader_transition_fragment);
    this._set_shader(SHADER_TRANSITION_VERTEX, this._shader_transition_vertex);

    this._set_shader(SHADER_NOISE_FRAGMENT, this._shader_film_fragment);
    this._set_shader(SHADER_NOISE_VERTEX, this._shader_film_vertex);
};

$_QE.prototype.get_shader_manager = function() {

    function ShaderManager() {
        this.__init__();
    }

    ShaderManager.prototype = {

        __init__: function() {
            this._all_shaders = {};
            this._all_shader_materials = {};

            this._shader_spritesheet_fragment = ''; // #pre-process_get_shader_spritesheet.frag
            this._shader_spritesheet_vertex   = ''; // #pre-process_get_shader_spritesheet.vert
            this._shader_film_fragment        = ''; // #pre-process_get_shader_film.frag
            this._shader_film_vertex          = ''; // #pre-process_get_shader_film.vert
            this._shader_transition_fragment  = ''; // #pre-process_get_shader_transition.frag
            this._shader_transition_vertex    = ''; // #pre-process_get_shader_transition.vert

            this._set_shader(SHADER_SPRITESHEET_FRAGMENT, this._shader_spritesheet_fragment);
            this._set_shader(SHADER_SPRITESHEET_VERTEX, this._shader_spritesheet_vertex);

            this._set_shader(SHADER_TRANSITION_FRAGMENT, this._shader_transition_fragment);
            this._set_shader(SHADER_TRANSITION_VERTEX, this._shader_transition_vertex);

            this._set_shader(SHADER_NOISE_FRAGMENT, this._shader_film_fragment);
            this._set_shader(SHADER_NOISE_VERTEX, this._shader_film_vertex);
        },

        create_global_shader_materials: function() {
            this._all_shader_materials[SHADER_MATERIAL_TRANSITION]  = new $_QE.prototype.ShaderMaterialTransition();
            this._all_shader_materials[SHADER_MATERIAL_NOISE]       = new $_QE.prototype.ShaderMaterialNoise();
            this._all_shader_materials[SHADER_MATERIAL_SPRITESHEET] = new $_QE.prototype.ShaderMaterialSpriteSheet();
        },

        _set_shader: function(shader_name, shader_content) {
            this._all_shaders[shader_name] = shader_content;
        },

        set_shader: function(shader_name, shader_content) {
            MANAGER_SHADER._set_shader(shader_name, shader_content);
        },

        get_shader_material_abstraction: function(shader_material_name) {
            return this._all_shader_materials[shader_material_name];
        },

        get_shader: function(shader_name) {
            return this._all_shaders[shader_name];
        },
    };

    return new ShaderManager();
};
