'use strict';

$_QE.prototype.ShaderMaterialSpriteSheet = function() {
    $_QE.prototype.ShaderMaterialAbstraction.call(this, QE.manager_assets.shader_spritesheet_vertex, QE.manager_assets.shader_spritesheet_fragment);
    this.texture = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET);

    this._uniform_offset  = 'offset';
    this._uniform_texture = 'texture';
    this._uniform_color   = 'color';

    //this.set_uniform(this._uniform_offset, new THREE.Vector2(64, 0));
    this.set_uniform(this._uniform_offset, 2);
    this.set_uniform(this._uniform_texture, this.texture);
    this.set_uniform(this._uniform_color, QE.COLOR_WHITE);

    this._set_shader_material();

    this.set_offset = function(offset) {
        this.set_uniform_value(this._uniform_offset, offset);
        //this.shader_material.uniform.offset.needsUpdate = true;
    };

    this.get_material = function(offset) {
        let clone = this.shader_material.clone();
        clone.uniforms[this._uniform_offset] = {'value': offset};
        clone.uniforms[this._uniform_texture] = {'value': this.texture};
        clone.uniforms[this._uniform_color] = {'value': QE.COLOR_WHITE};
        return clone;
    };
};