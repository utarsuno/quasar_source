'use strict';

$_QE.prototype.ShaderMaterialTransition = function() {
    $_QE.prototype.ShaderMaterialAbstraction.call(this, ASSET_SHADER_TRANSITION_VERTEX, ASSET_SHADER_TRANSITION_FRAGMENT);
    this.texture = QE.manager_textures.get_asset(ASSET_TEXUTRE_TRANSITION_GRID);

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

    this.set_texture_for_old_scene = function(t) {
        this.set_uniform_value(this._uniform_key_texture_diffuse_old_scene, t);
    };

    this.set_texture_for_new_scene = function(t) {
        this.set_uniform_value(this._uniform_key_texture_diffuse_new_scene, t);
    };

    this.set_mix_ratio = function(r) {
        this.set_uniform_value(this._uniform_key_mix_ratio, r);
    };

    this.set_threshold = function(t) {
        this.set_uniform_value(this._uniform_key_threshold, t);
    };

    this._set_texture_for_transition_affect = function(t) {
        this.set_uniform_value(this._uniform_key_texture_transition_affect, t);
    };
};