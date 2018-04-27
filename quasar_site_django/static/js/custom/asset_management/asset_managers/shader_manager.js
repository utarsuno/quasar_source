'use strict';

const SHADER_TRANSITION_FRAGMENT  = 'transition/transition_fragment.frag'; // #pre-process_global_constant
const SHADER_TRANSITION_VERTEX    = 'transition/transition_vertex.vert';   // #pre-process_global_constant
const SHADER_NOISE_FRAGMENT       = 'film/film_fragment.frag';             // #pre-process_global_constant
const SHADER_NOISE_VERTEX         = 'film/film_vertex.vert';               // #pre-process_global_constant
const SHADER_SPRITESHEET_FRAGMENT = 'spritesheet/spritesheet.frag';        // #pre-process_global_constant
const SHADER_SPRITESHEET_VERTEX   = 'spritesheet/spritesheet.vert';        // #pre-process_global_constant
const SHADER_MATERIAL_TRANSITION  = 1;                                     // #pre-process_global_constant
const SHADER_MATERIAL_NOISE       = 2;                                     // #pre-process_global_constant
const SHADER_MATERIAL_SPRITESHEET = 3;                                     // #pre-process_global_constant

function ShaderManager() {
    this.__init__();
}

ShaderManager.prototype = {

    __init__: function() {
        this._all_shaders = {};
        this._all_shader_materials = {};
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
    this.get_shader_material_copy = function() {
        let clone = this.shader_material.clone();
        clone.uniforms = this.uniforms;
        return clone;
    };
}

function ShaderMaterialSpriteSheet() {
    this.__init__();
}

ShaderMaterialSpriteSheet.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_SPRITESHEET_VERTEX, SHADER_SPRITESHEET_FRAGMENT);
        this.texture = MANAGER_TEXTURE.get_texture(null, SPRITESHEET_ICONS);

        this._uniform_offset  = 'offset';
        this._uniform_repeat  = 'repeat';
        this._uniform_texture = 'texture';
        this._uniform_color   = 'color';

        //this.set_uniform(this._uniform_offset, new THREE.Vector2(64, 0));
        this.set_uniform(this._uniform_offset, 2);
        this.set_uniform(this._uniform_repeat, new THREE.Vector2(1 / 27, 0));
        this.set_uniform(this._uniform_texture, this.texture);
        this.set_uniform(this._uniform_color, COLOR_BLUE);

        this._set_shader_material();
    },
    set_offset: function(offset) {
        this.set_uniform_value(this._uniform_offset, offset);
        //this.shader_material.uniforms.offset.needsUpdate = true;
    },
    get_material: function(offset) {
        let clone = this.shader_material.clone();
        clone.uniforms = this.uniforms;
        clone.uniforms[this._uniform_offset].value = offset;
        return clone;
    }
};

function ShaderMaterialTransition() {
    this.__init__();
}

ShaderMaterialTransition.prototype = {
    __init__: function() {
        ShaderMaterialAbstraction.call(this, SHADER_TRANSITION_VERTEX, SHADER_TRANSITION_FRAGMENT);
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