'use strict';

const TEXTURE_GROUP_SKYBOX = 'skybox';
const TEXTURE_GROUP_CURSOR = 'cursors';
const TEXTURE_GROUP_ICONS  = 'icons';

const ICON_STAR          = 'star.png';
const ICON_EXIT          = 'exit.png';
const ICON_SETTINGS      = 'gear.png';
const ICON_MULTI_PLAYER  = 'multiplayer.png';
const ICON_HOME          = 'home.png';
const ICON_SAVE          = 'save.png';
const ICON_ENTITY_GROUP  = 'share.png';
const ICON_FULLSCREEN    = 'larger.png';
const ICON_LEFT          = 'arrow_left.png';
const ICON_RIGHT         = 'arrow_right.png';
const ICON_CROSS         = 'cross.png';
const ICON_WORLDS        = 'bars_horizontal.png';
const ICON_LOCKED        = 'locked.png';
const ICON_UNLOCKED      = 'unlocked.png';
const ICON_WARNING       = 'warning.png';
const ICON_TELEPORT      = 'open.png';
const ICON_CHECKMARK     = 'checkmark.png';
const ICON_SINGLE_PLAYER = 'singleplayer.png';
const ICON_WRENCH        = 'wrench.png';
const ICON_IMPORT        = 'import.png';
const ICON_INFORMATION   = 'information.png';
const ICON_MOVIE         = 'movie.png';
const ICON_MENU_LIST     = 'menu_list.png';

const SKYBOX_FRONT  = 'skybox_front.jpg';
const SKYBOX_BACK   = 'skybox_back.jpg';
const SKYBOX_LEFT   = 'skybox_left.jpg';
const SKYBOX_RIGHT  = 'skybox_right.jpg';
const SKYBOX_TOP    = 'skybox_top.jpg';
const SKYBOX_BOTTOM = 'skybox_bottom.jpg';

const CURSOR_TYPE_HORIZONTAL = 'scroll_horizontal.png';
const CURSOR_TYPE_VERTICAL   = 'scroll_vertical.png';
const CURSOR_TYPE_LARGER     = 'larger.png';
const CURSOR_TYPE_HAND       = 'cursor_hand.png';
const CURSOR_TYPE_POINTER    = 'cursor_pointer.png';
const CURSOR_TYPE_MOUSE      = 'mouse.png';

function TextureManager() {
    this.__init__();
}

TextureManager.prototype = {

    __init__: function() {
        this.texture_groups = {};

        this.texture_groups[TEXTURE_GROUP_CURSOR] = {};
        this.texture_groups[TEXTURE_GROUP_SKYBOX] = {};
        this.texture_groups[TEXTURE_GROUP_ICONS]  = {};
    },

    create_skybox_material: function() {
        this.sky_box_material = [];
        // The order of these matter.
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_FRONT));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_BACK));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_TOP));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_BOTTOM));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_RIGHT));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_LEFT));

        for (var t = 0; t < this.sky_box_material.length; t++) {
            // depthWrite: false, depthTest: false

            //depthTest : false, depthWrite: false

            //this.sky_box_material[t] = new THREE.MeshBasicMaterial({map: this.sky_box_material[t], side: THREE.DoubleSide, transparent: true, opacity: 0.75, depthTest : false, depthWrite: false});
            // this.sky_box_material[t] = new THREE.MeshBasicMaterial({map: this.sky_box_material[t], side: THREE.DoubleSide, transparent: true, opacity: 0.75});
            this.sky_box_material[t] = new THREE.MeshBasicMaterial({map: this.sky_box_material[t], side: THREE.BackSide, transparent: false});
        }
    },

    get_skybox_material: function() {
        return this.sky_box_material;
    },

    set_texture: function(texture_group, texture_name, texture) {
        this.texture_groups[texture_group][texture_name] = texture;
    },

    get_texture: function(texture_group, texture_name) {
        return this.texture_groups[texture_group][texture_name];
    }
};
