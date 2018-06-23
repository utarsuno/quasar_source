'use strict';

$_QE.prototype.ShaderMaterialNoise = function() {
    $_QE.prototype.ShaderMaterialAbstraction.call(this, ASSET_SHADER_NOISE_VERTEX, ASSET_SHADER_NOISE_FRAGMENT);

    this._uniform_key_t_diffuse  = 'tDiffuse';
    this._uniform_key_time       = 'time';
    this._uniform_key_nIntensity = 'nIntensity';

    this.set_uniform(this._uniform_key_t_diffuse , null);
    this.set_uniform(this._uniform_key_time      , 0.0);
    this.set_uniform(this._uniform_key_nIntensity, 0.2);

    this._set_shader_material();

    this.set_time = function(t) {
        this.set_uniform_value(this._uniform_key_time, t);
    };

    this.add_time = function(t) {
        this.add_to_uniform_value(this._uniform_key_time, t);
    };

    this.set_intensity = function(i) {
        this.set_uniform_value(this._uniform_key_nIntensity, i);
    };

    this.set_t_diffuse = function(td) {
        this.set_uniform_value(this._uniform_key_t_diffuse, td);
    };
};
