$_QE.prototype.ShaderMaterialTransition = function() {
    this.texture = QE.manager_assets.get_asset(ASSET_TEXTURE_TRANSITION);

    let uniforms = {};
    uniforms[SHADER_UNIFORM_TRANSITION_NEW_SCENE]   = this._get_value(null);
    uniforms[SHADER_UNIFORM_TRANSITION_OLD_SCENE]   = this._get_value(null);
    uniforms[SHADER_UNIFORM_TRANSITION_MIX_RATIO]   = this._get_value(0.0);
    uniforms[SHADER_UNIFORM_TRANSITION_THRESHOLD]   = this._get_value(0.1);
    uniforms[SHADER_UNIFORM_TRANSITION_TEXTURE_MIX] = this._get_value(this.texture);

    this._set_shader_material(
        QE.manager_assets.shader_transition_vertex,
        QE.manager_assets.shader_transition_fragment,
        uniforms
    );
};


Object.assign($_QE.prototype.ShaderMaterialTransition.prototype, $_QE.prototype.ShaderMaterialAbstraction.prototype, {

    set_texture_for_old_scene: function(t) {
        this.set_uniform(SHADER_UNIFORM_TRANSITION_OLD_SCENE, t);
    },

    set_texture_for_new_scene: function(t) {
        this.set_uniform(SHADER_UNIFORM_TRANSITION_NEW_SCENE, t);
    },

    set_mix_ratio: function(r) {
        this.set_uniform(SHADER_UNIFORM_TRANSITION_MIX_RATIO, r);
    },

    set_threshold: function(t) {
        this.set_uniform(SHADER_UNIFORM_TRANSITION_THRESHOLD, t);
    },

    _set_texture_for_transition_affect: function(t) {
        this.set_uniform(SHADER_UNIFORM_TRANSITION_TEXTURE_MIX, t);
    },
});
