'use strict';

const ICON_PLANET     = 1;  // #pre-process_global_constant
const ICON_ADMIN      = 2;  // #pre-process_global_constant
const ICON_ARROW      = 3;  // #pre-process_global_constant
const ICON_CALENDER   = 4;  // #pre-process_global_constant
const ICON_CHECKMARK  = 5;  // #pre-process_global_constant
const ICON_CLICK      = 6;  // #pre-process_global_constant
const ICON_CROSS      = 7;  // #pre-process_global_constant
const ICON_CURSOR     = 8;  // #pre-process_global_constant
const ICON_DELETE     = 9;  // #pre-process_global_constant
const ICON_DISABLED   = 10; // #pre-process_global_constant
const ICON_DRAG       = 11; // #pre-process_global_constant
const ICON_EXIT       = 12; // #pre-process_global_constant
const ICON_EXPAND     = 13; // #pre-process_global_constant
const ICON_FOLDER     = 14; // #pre-process_global_constant
const ICON_GEARS      = 15; // #pre-process_global_constant
const ICON_HOME       = 16; // #pre-process_global_constant
const ICON_HORIZONTAL = 17; // #pre-process_global_constant
const ICON_LOCKED     = 18; // #pre-process_global_constant
const ICON_PICTURE    = 19; // #pre-process_global_constant
const ICON_TELEPORT   = 20; // #pre-process_global_constant
const ICON_TEXT       = 21; // #pre-process_global_constant
const ICON_UNLOCKED   = 22; // #pre-process_global_constant
const ICON_VERTICAL   = 23; // #pre-process_global_constant
const ICON_VIDEO      = 24; // #pre-process_global_constant
const ICON_WARNING    = 25; // #pre-process_global_constant
const ICON_WRENCH     = 26; // #pre-process_global_constant
const ICON_WRITING    = 27; // #pre-process_global_constant


function SpriteSheetManager() {
    this.__init__();
}

SpriteSheetManager.prototype = {

    __init__: function() {
        this._icons = {};
    },

    /*
       //this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(texture_group, this.icon_type), transparent : true, side: THREE.FrontSide, depthTest: false});
       this.material = MANAGER_SPRITESHEET.get_icon_material(this.icon_type);
     */

    get_icon_material: function(icon) {
        //let material = new THREE.MeshBasicMaterial({map : this.texture, transparent : true, side: THREE.FrontSide, depthTest: false});

        let t = this.texture.clone();

        t.repeat.x = this._icons[icon].w / this.texture.image.width;
        t.repeat.y = this._icons[icon].h / this.texture.image.height;
        t.offset.x = this._icons[icon].x / this.texture.image.width;
        t.offset.y = this._icons[icon].y / this.texture.image.height;

        //let material = new THREE.MeshBasicMaterial({map : t, transparent : true, side: THREE.FrontSide, depthTest: false});
        let material = new THREE.MeshBasicMaterial({map : t, transparent : false, side: THREE.DoubleSide, color: COLOR_RED});
        l(material);
        return material;
    },

    load_icon_sprite_sheet: function(callback) {
        //this.texture = MANAGER_TEXTURE.get_texture(null, SPRITESHEET_ICONS);
        //this.texture = THREE.ImageUtils.loadTexture('/home/git_repos/quasar_source/quasar_site_django/static/assets/texture/spritesheet/icons.png');

        l(this.texture);

        let i;
        let frames = JSON_SPRITESHEET['frames'];
        for (i = 0; i < frames.length; i++) {

            this._icons[this._get_icon_number_from_filename(frames[i].filename)] = frames[i].frame;

        }
        //l(JSON_SPRITESHEET);
        //l(this._icons);

        callback();
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
    }

};