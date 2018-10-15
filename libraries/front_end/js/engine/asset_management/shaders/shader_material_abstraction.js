'use strict';

$_QE.prototype.ShaderMaterialAbstraction = function() {};

Object.assign($_QE.prototype.ShaderMaterialAbstraction.prototype, {

    _get_value: function(v) {
        return {'value': v};
    },

    set_uniform: function(k, v) {
        this.shader_material.uniforms[k].value = v;
    },

    add_to_uniform: function(k, v) {
        this.shader_material.uniforms[k].value += v;
    },

    _set_shader_material: function(vertex_shader, fragment_shader, uniforms) {
        this.shader_material = new THREE.ShaderMaterial({
            uniforms      : uniforms,
            vertexShader  : vertex_shader,
            fragmentShader: fragment_shader
        });
    },

    get_shader_material: function() {
        return this.shader_material;
    },
});
