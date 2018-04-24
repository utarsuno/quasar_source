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

        //callback();
    }
};
