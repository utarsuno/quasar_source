'use strict';

$_QE.prototype.ShaderMaterialNoise = function() {

    let uniforms = {};
    uniforms[SHADER_UNIFORM_NOISE_T_DIFFUSE]   = this._get_value(null);
    uniforms[SHADER_UNIFORM_NOISE_TIME]        = this._get_value(0.0);
    uniforms[SHADER_UNIFORM_NOISE_N_INTENSITY] = this._get_value(0.2);

    this._set_shader_material(
        QE.manager_assets.shader_film_vertex,
        QE.manager_assets.shader_film_fragment,
        uniforms
    );
};

Object.assign($_QE.prototype.ShaderMaterialNoise.prototype, $_QE.prototype.ShaderMaterialAbstraction.prototype, {

    set_time: function(t) {
        this.set_uniform(SHADER_UNIFORM_NOISE_TIME, t);
    },

    add_time: function(t) {
        this.add_to_uniform(SHADER_UNIFORM_NOISE_TIME, t);
    },

    set_intensity: function(i) {
        this.set_uniform(SHADER_UNIFORM_NOISE_N_INTENSITY, i);
    },

    set_t_diffuse: function(td) {
        this.set_uniform(SHADER_UNIFORM_NOISE_T_DIFFUSE, td);
    },
});
