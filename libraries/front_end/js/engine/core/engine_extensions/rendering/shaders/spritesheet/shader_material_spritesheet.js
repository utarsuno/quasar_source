'use strict';


$_QE.prototype.ShaderMaterialSpriteSheet = function() {
    this.texture = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET);

    let uniforms = {};
    uniforms[SHADER_UNIFORM_SPRITESHEET_OFFSET]  = this._get_value(2);
    uniforms[SHADER_UNIFORM_SPRITESHEET_TEXTURE] = this._get_value(this.texture);
    uniforms[SHADER_UNIFORM_SPRITESHEET_COLOR]   = this._get_value(QE.COLOR_WHITE);

    this._set_shader_material(
        QE.manager_assets.shader_spritesheet_vertex,
        QE.manager_assets.shader_spritesheet_fragment,
        uniforms
    );
};

Object.assign($_QE.prototype.ShaderMaterialSpriteSheet.prototype, $_QE.prototype.ShaderMaterialAbstraction.prototype, {

    set_offset: function(offset) {
        this.set_uniform(SHADER_UNIFORM_SPRITESHEET_OFFSET, offset);
        //this.shader_material.uniform.offset.needsUpdate = true;
    },

    get_clone: function(icon) {
        let sm = this.shader_material.clone();
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_OFFSET].value  = icon;
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_TEXTURE].value = this.texture;
        sm.uniforms[SHADER_UNIFORM_SPRITESHEET_COLOR].value   = QE.COLOR_WHITE;
        return sm;
    }
});
