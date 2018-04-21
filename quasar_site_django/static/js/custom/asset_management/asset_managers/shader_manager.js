'use strict';

const SHADER_TRANSITION_FRAGEMENT = 'transition/transition_fragment.frag';
const SHADER_TRANSITION_VERTEX    = 'transition/transition_vertex.vert';
const SHADER_NOISE_FRAGEMENT      = 'film/film_fragment.frag';
const SHADER_NOISE_VERTEX         = 'film/film_vertex.vert';
const SHADER_MATERIAL_TRANSITION  = 1;
const SHADER_MATERIAL_NOISE       = 2;

function ShaderManager() {
    this.__init__();
}

ShaderManager.prototype = {

    __init__: function() {
        this._all_shaders = {};
        this._all_shader_materials = {};
    },

    create_global_shader_materials: function() {
        this._all_shader_materials[SHADER_MATERIAL_TRANSITION] = new ShaderMaterialTransition();
        this._all_shader_materials[SHADER_MATERIAL_NOISE]      = new ShaderMaterialNoise();
    },

    set_shader: function(shader_name, shader_content) {
        this._all_shaders[shader_name] = shader_content;
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

function ShaderMaterialTransition() {
    this.__init__();
}

ShaderMaterialTransition.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_TRANSITION_VERTEX, SHADER_TRANSITION_FRAGEMENT);
        this.texture = MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_TRANSITION, TRANSITION_GRID);

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
        ShaderMaterialAbstraction.call(this, SHADER_NOISE_VERTEX, SHADER_NOISE_FRAGEMENT);

        this._uniform_key_t_diffuse  = 'tDiffuse';
        this._uniform_key_time       = 'time';
        this._uniform_key_nIntensity = 'nIntensity';

        this.set_uniform(this._uniform_key_t_diffuse , null);
        this.set_uniform(this._uniform_key_time      , 0.0);
        this.set_uniform(this._uniform_key_nIntensity, 0.4);

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