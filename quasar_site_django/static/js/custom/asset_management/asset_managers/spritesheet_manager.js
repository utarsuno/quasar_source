'use strict';

function SpriteSheetManager() {
    this.__init__();
}

SpriteSheetManager.prototype = {

    __init__: function() {
    },

    load_icon_sprite_sheet: function(callback) {
        this.texture = MANAGER_TEXTURE.get_texture(null, SPRITESHEET_ICONS);

        l(JSON_SPRITESHEET);

        callback();
    },

    get_icon_material: function(icon) {
        
    }

};

/*
        //this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(texture_group, this.icon_type), transparent : true, side: THREE.FrontSide, depthTest: false});
        this.material = MANAGER_SPRITESHEET.get_icon_material(this.icon_type);
 */
