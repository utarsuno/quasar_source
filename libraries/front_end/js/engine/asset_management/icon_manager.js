'use strict';

$_QE.prototype.IconManager = function(engine) {
    this.engine = engine;

    this.get_icon_material = function(icon) {
        this._shader_material = this.engine.manager_assets.get_asset(ASSET_SHADER_MATERIAL_SPRITE_SHEET);
        let m                 = this._shader_material.get_clone(icon);
        m.transparent         = true;
        m.needsUpdate         = true;
        return m;
    };

    this.initialize = function() {
        this.texture             = this.engine.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET);
        this.texture.magFilter   = THREE.NearestFilter;
        this.texture.minFilter   = THREE.NearestFilter;
        this.texture.needsUpdate = true;
    };

};
