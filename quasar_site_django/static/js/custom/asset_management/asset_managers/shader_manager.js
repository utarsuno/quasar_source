'use strict';

const SHADER_TRANSITION_FRAGEMENT = 'transition/transition_fragment.frag';
const SHADER_TRANSITION_VERTEX    = 'transition/transition_vertex.vert';
const SHADER_MATERIAL_TRANSITION  = 1;

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
    //this.uniforms        = [];
    this.set_uniform = function(k, v) {
        //this.uniforms[k] = v;
        this.shader_material.uniforms[k] = v;
    };
}

function ShaderMaterialTransition() {
    this.__init__();
}

ShaderMaterialTransition.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_TRANSITION_VERTEX, SHADER_TRANSITION_FRAGEMENT);
        this.texture = MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_TRANSITION, TRANSITION_GRID);
        this.shader_material = new THREE.ShaderMaterial({
            uniforms: {
                texture_diffuse_new_scene: {
                    value: null
                },
                texture_diffuse_old_scene: {
                    value: null
                },
                mix_ratio: {
                    value: 0.0
                },
                threshold: {
                    value: 0.1
                },
                texture_mix: {
                    value: this.texture
                }
            },
            vertexShader: this.shader_vertex,
            fragmentShader: this.shader_fragment
        });

        //l(this.shader_vertex);
        //l(this.shader_fragment);
        //l(this.texture);

        this._uniform_key_texture_diffuse_new_scene = 'texture_diffuse_new_scene';
        this._uniform_key_texture_diffuse_old_scene = 'texture_diffuse_old_scene';
        this._uniform_key_mix_ratio                 = 'mix_ratio';
        this._uniform_key_threshold                 = 'threshold';
        this._uniform_key_texture_transition_affect = 'texture_mix';

        this._set_texture_for_transition_affect(this.texture);
        this.set_threshold(0.1);
    },

    set_texture_for_old_scene: function(t) {
        this.set_uniform(this._uniform_key_texture_diffuse_old_scene, t);
    },

    set_texture_for_new_scene: function(t) {
        this.set_uniform(this._uniform_key_texture_diffuse_new_scene, t);
    },

    set_mix_ratio: function(r) {
        this.set_uniform(this._uniform_key_mix_ratio, r);
    },

    set_threshold: function(t) {
        this.set_uniform(this._uniform_key_threshold, t);
    },

    _set_texture_for_transition_affect: function(t) {
        this.set_uniform(this._uniform_key_texture_transition_affect, t);
    },

    get_shader_material: function() {
        return this.shader_material;
    }
};