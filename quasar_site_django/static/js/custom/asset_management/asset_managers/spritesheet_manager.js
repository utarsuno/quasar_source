'use strict';

const ICON_PLANET     = 1; // #pre-process_global_constant
const ICON_ADMIN      = 2; // #pre-process_global_constant
const ICON_ARROW      = 3;
const ICON_CALENDER   = 4;
const ICON_CHECKMARK  = 5;
const ICON_CLICK      = 6;
const ICON_CROSS      = 7;
const ICON_CURSOR     = 8;
const ICON_DELETE     = 9;
const ICON_DISABLED   = 10;
const ICON_DRAG       = 11;
const ICON_EXIT       = 12;
const ICON_EXPAND     = 13;
const ICON_FOLDER     = 14;
const ICON_GEARS      = 15;
const ICON_HOME       = 16;
const ICON_HORIZONTAL = 17;
const ICON_LOCKED     = 18;
const ICON_PICTURE    = 19;
const ICON_TELEPORT   = 20;
const ICON_TEXT       = 21;
const ICON_UNLOCKED   = 22;
const ICON_VERTICAL   = 23;
const ICON_VIDEO      = 24;
const ICON_WARNING    = 25;
const ICON_WRENCH     = 26;
const ICON_WRITING    = 27;


function SpriteSheetManager() {
    this.__init__();
}

SpriteSheetManager.prototype = {

    __init__: function() {
        this._icons = {};
    },

    load_icon_sprite_sheet: function(callback) {
        this.texture = MANAGER_TEXTURE.get_texture(null, SPRITESHEET_ICONS);

        let i;
        let frames = JSON_SPRITESHEET['frames'];
        for (i = 0; i < frames.length; i++) {
            l(frames[i]);
        }
        l(JSON_SPRITESHEET);

        //callback();
    },

    _get_icon_number_from_filename: function(filename) {
        switch(filename) {
        case 'planet.png':
            return ICON_PLANET;
        case 'admin.png':
            return ICON_ADMIN;
        case 'calendar.png':
            return ICON_CALENDER;
        case 'arrow.png':
            return ICON_ARROW;
        case 'checkmark.png':
            return ICON_CHECKMARK;
        case 'click.png':
            return ICON_CLICK;
        case 'cross.png':
            return ICON_CROSS;
        case 'cursor.png':
            return ICON_CURSOR;
        case 'delete.png':
            return ICON_DELETE;
        case 'disabled.png':
            return ICON_DISABLED;
        case 'drag.png':
            return ICON_DRAG;
        case 'exit.png':
            return ICON_EXIT;
        case 'expand.png':
            return ICON_EXPAND;
        case 'folder.png':
            return ICON_FOLDER;
        case 'gears.png':
            return ICON_GEARS;
        case 'home.png':
            return ICON_HOME;
        case 'horizontal.png':
            return ICON_HORIZONTAL;
        case 'locked.png':
            return ICON_LOCKED;
        case 'picture.png':
            return ICON_PICTURE;
        case 'teleport.png':
            return ICON_TELEPORT;
        case 'text.png':
            return ICON_TEXT;
        case 'unlocked.png':
            return ICON_UNLOCKED;
        case 'vertical.png':
            return ICON_VERTICAL;
        case 'video.png':
            return ICON_VIDEO;
        case 'warning.png':
            return ICON_WARNING;
        case 'wrench.png':
            return ICON_WRENCH;
        case 'writting.png':
            return ICON_WRITING;
        }
    },

    get_icon_material: function(icon) {

    }

};

/*
        //this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(texture_group, this.icon_type), transparent : true, side: THREE.FrontSide, depthTest: false});
        this.material = MANAGER_SPRITESHEET.get_icon_material(this.icon_type);
 */