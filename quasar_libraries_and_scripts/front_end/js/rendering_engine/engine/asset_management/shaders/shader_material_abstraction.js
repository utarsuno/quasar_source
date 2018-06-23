'use strict';

$_QE.prototype.ShaderMaterialAbstraction = function(vertex_shader_name, fragment_shader_name) {
    this.shader_vertex   = QE.manager_shaders.get_asset(vertex_shader_name);
    this.shader_fragment = QE.manager_shaders.get_asset(fragment_shader_name);
    this.uniforms        = {};
    this.set_uniform = function(k, v) {
        this.uniforms[k] = {'value': v};
    };
    // TODO : Pre-process this out.
    this.set_uniform_value = function(k, v) {
        this.shader_material.uniforms[k].value = v;
    };
    // TODO : Pre-process this out.
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
};