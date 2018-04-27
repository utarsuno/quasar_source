'use strict';

const SHADER_MATERIAL_TRANSITION  = 1; // #pre-process_global_constant
const SHADER_MATERIAL_NOISE       = 2; // #pre-process_global_constant
const SHADER_MATERIAL_SPRITESHEET = 3; // #pre-process_global_constant

const SHADER_SPRITESHEET_FRAGMENT = 1; // #pre-process_global_constant
const SHADER_SPRITESHEET_VERTEX   = 2; // #pre-process_global_constant
const SHADER_TRANSITION_FRAGMENT  = 3; // #pre-process_global_constant
const SHADER_TRANSITION_VERTEX    = 4; // #pre-process_global_constant
const SHADER_NOISE_FRAGMENT       = 5; // #pre-process_global_constant
const SHADER_NOISE_VERTEX         = 6; // #pre-process_global_constant

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
        this._all_shader_materials[SHADER_MATERIAL_TRANSITION]  = new ShaderMaterialTransition();
        this._all_shader_materials[SHADER_MATERIAL_NOISE]       = new ShaderMaterialNoise();
        this._all_shader_materials[SHADER_MATERIAL_SPRITESHEET] = new ShaderMaterialSpriteSheet();
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


/*__   ___  ___         ___  __      __             __   ___  __                ___  ___  __               __
 |  \ |__  |__  | |\ | |__  |  \    /__` |__|  /\  |  \ |__  |__)     |\/|  /\   |  |__  |__) |  /\  |    /__`
 |__/ |___ |    | | \| |___ |__/    .__/ |  | /~~\ |__/ |___ |  \     |  | /~~\  |  |___ |  \ | /~~\ |___ .__/ */
function ShaderMaterialAbstraction(vertex_shader_name, fragment_shader_name) {
    this.shader_vertex   = MANAGER_SHADER.get_shader(vertex_shader_name);
    this.shader_fragment = MANAGER_SHADER.get_shader(fragment_shader_name);
    this.uniforms        = {};
    this.set_uniform = function(k, v) {
        this.uniforms[k] = {'value': v};
    };
    this.set_uniform_value = function(k, v) {
        this.shader_material.uniforms[k].value = v;
    };
    this.add_to_uniform_value = function(k, v) {
        this.shader_material.uniforms[k].value += v;
    };
    this._set_shader_material = function() {
        this.shader_material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.shader_vertex,
            fragmentShader: this.shader_fragment
        });
    };
    this.get_shader_material = function() {
        return this.shader_material;
    };
}

function ShaderMaterialSpriteSheet() {
    this.__init__();
}

ShaderMaterialSpriteSheet.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_SPRITESHEET_VERTEX, SHADER_SPRITESHEET_FRAGMENT);
        this.texture = MANAGER_TEXTURE.get_texture(SPRITESHEET_ICONS);

        this._uniform_offset  = 'offset';
        this._uniform_texture = 'texture';
        this._uniform_color   = 'color';

        //this.set_uniform(this._uniform_offset, new THREE.Vector2(64, 0));
        this.set_uniform(this._uniform_offset, 2);
        this.set_uniform(this._uniform_texture, this.texture);
        this.set_uniform(this._uniform_color, COLOR_WHITE);

        this._set_shader_material();
    },
    set_offset: function(offset) {
        this.set_uniform_value(this._uniform_offset, offset);
        //this.shader_material.uniforms.offset.needsUpdate = true;
    },
    get_material: function(offset) {
        let clone = this.shader_material.clone();
        clone.uniforms[this._uniform_offset] = {'value': offset};
        clone.uniforms[this._uniform_texture] = {'value': this.texture};
        clone.uniforms[this._uniform_color] = {'value': COLOR_WHITE};
        return clone;
    }
};

function ShaderMaterialTransition() {
    this.__init__();
}

ShaderMaterialTransition.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_TRANSITION_VERTEX, SHADER_TRANSITION_FRAGMENT);
        this.texture = MANAGER_TEXTURE.get_texture(TRANSITION_GRID);

        this._uniform_key_texture_diffuse_new_scene = 'texture_diffuse_new_scene';
        this._uniform_key_texture_diffuse_old_scene = 'texture_diffuse_old_scene';
        this._uniform_key_mix_ratio                 = 'mix_ratio';
        this._uniform_key_threshold                 = 'threshold';
        this._uniform_key_texture_transition_affect = 'texture_mix';

        this.set_uniform(this._uniform_key_texture_diffuse_new_scene, null);
        this.set_uniform(this._uniform_key_texture_diffuse_old_scene, null);
        this.set_uniform(this._uniform_key_mix_ratio, 0.0);
        this.set_uniform(this._uniform_key_threshold, 0.1);
        this.set_uniform(this._uniform_key_texture_transition_affect, this.texture);
        this._set_shader_material();
    },

    set_texture_for_old_scene: function(t) {
        this.set_uniform_value(this._uniform_key_texture_diffuse_old_scene, t);
    },

    set_texture_for_new_scene: function(t) {
        this.set_uniform_value(this._uniform_key_texture_diffuse_new_scene, t);
    },

    set_mix_ratio: function(r) {
        this.set_uniform_value(this._uniform_key_mix_ratio, r);
    },

    set_threshold: function(t) {
        this.set_uniform_value(this._uniform_key_threshold, t);
    },

    _set_texture_for_transition_affect: function(t) {
        this.set_uniform_value(this._uniform_key_texture_transition_affect, t);
    }
};

function ShaderMaterialNoise() {
    this.__init__();
}

ShaderMaterialNoise.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_NOISE_VERTEX, SHADER_NOISE_FRAGMENT);

        this._uniform_key_t_diffuse  = 'tDiffuse';
        this._uniform_key_time       = 'time';
        this._uniform_key_nIntensity = 'nIntensity';

        this.set_uniform(this._uniform_key_t_diffuse , null);
        this.set_uniform(this._uniform_key_time      , 0.0);
        this.set_uniform(this._uniform_key_nIntensity, 0.2);

        this._set_shader_material();
    },

    set_time: function(t) {
        this.set_uniform_value(this._uniform_key_time, t);
    },

    add_time: function(t) {
        this.add_to_uniform_value(this._uniform_key_time, t);
    },

    set_intensity: function(i) {
        this.set_uniform_value(this._uniform_key_nIntensity, i);
    },

    set_t_diffuse: function(td) {
        this.set_uniform_value(this._uniform_key_t_diffuse, td);
    }
};