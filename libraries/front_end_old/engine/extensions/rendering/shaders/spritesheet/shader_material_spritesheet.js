$_QE.prototype.ShaderMaterialSpriteSheet = function(shader_material, icon) {
    if (shader_material != null) {
        this.shader_material = shader_material.get_clone(icon);
    } else {
        this.texture = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET);

        let uniforms = {};
        uniforms[SHADER_UNIFORM_SPRITESHEET_OFFSET]  = this._get_value(2);
        uniforms[SHADER_UNIFORM_SPRITESHEET_TEXTURE] = this._get_value(this.texture);
        uniforms[SHADER_UNIFORM_SPRITESHEET_COLOR]   = this._get_value(QE.COLOR_WHITE);
        uniforms[SHADER_UNIFORM_SPRITESHEET_ALPHA]   = this._get_value(1.0);

        this._set_shader_material(
            QE.manager_assets.shader_spritesheet_vertex,
            QE.manager_assets.shader_spritesheet_fragment,
            uniforms
        );
        this.shader_material.transparent = true;
    }
};

Object.assign($_QE.prototype.ShaderMaterialSpriteSheet.prototype, $_QE.prototype.ShaderMaterialAbstraction.prototype, {

    set_icon: function(icon) {
        this.set_uniform(SHADER_UNIFORM_SPRITESHEET_OFFSET, icon);
    },

    set_alpha: function(a) {
        this.set_uniform(SHADER_UNIFORM_SPRITESHEET_ALPHA, a);
    },

    set_color: function(c) {
        this.set_uniform(SHADER_UNIFORM_SPRITESHEET_COLOR, c);
    },

    get_clone: function(icon) {
        let sm = this.shader_material.clone();
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_OFFSET].value  = icon;
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_TEXTURE].value = this.texture;
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_COLOR].value   = QE.COLOR_WHITE;
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_ALPHA].value   = 1.0;
        sm.transparent                                        = true;
        return sm;
    }
});
