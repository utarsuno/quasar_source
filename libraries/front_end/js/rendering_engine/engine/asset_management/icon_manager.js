'use strict';

$_QE.prototype.IconManager = function() {

    this.get_icon_material = function(icon) {
        this._shader_material = QE.manager_assets.get_asset(ASSET_SHADER_MATERIAL_SPRITE_SHEET);
        let m = this._shader_material.get_material(icon);
        m.transparent = true;
        m.needsUpdate = true;
        return m;
    };

    this.initialize = function() {
        this.texture = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET);
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;
        this.texture.needsUpdate = true;
    };


};

/*
ManagerManager.prototype.set_spritesheet_manager = function() {
    function SpriteSheetManager() {
        this.__init__();
    }

    SpriteSheetManager.prototype = {
        __init__: function() {
        },

        get_icon_material: function(icon) {
            this._shader_material = MANAGER_SHADER.get_shader_material_abstraction(SHADER_MATERIAL_SPRITESHEET);
            let m = this._shader_material.get_material(icon);
            m.transparent = true;
            m.needsUpdate = true;
            return m;
        },

        load_icon_sprite_sheet: function() {
            this.texture = MANAGER_TEXTURE.get_texture(SPRITESHEET_ICONS);

            this.texture.magFilter = THREE.NearestFilter;
            this.texture.minFilter = THREE.NearestFilter;
            this.texture.needsUpdate = true;
        }
    };

    this.spritesheet_manager = new SpriteSheetManager();
};
    */
