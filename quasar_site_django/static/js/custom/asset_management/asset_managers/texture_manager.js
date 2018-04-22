'use strict';

const TEXTURE_GROUP_SKYBOX     = 'skybox';              // #pre-process_global_constant
const TEXTURE_GROUP_CURSOR     = 'cursors';             // #pre-process_global_constant
const TEXTURE_GROUP_ICONS      = 'icons';               // #pre-process_global_constant
const TEXTURE_GROUP_TRANSITION = 'third_party';         // #pre-process_global_constant

const TRANSITION_GRID    = 'grid_transition.png';       // #pre-process_global_constant

const ICON_STAR          = 'star.png';                  // #pre-process_global_constant
const ICON_EXIT          = 'exit.png';                  // #pre-process_global_constant
const ICON_SETTINGS      = 'gear.png';                  // #pre-process_global_constant
const ICON_MULTI_PLAYER  = 'multiplayer.png';           // #pre-process_global_constant
const ICON_HOME          = 'home.png';                  // #pre-process_global_constant
const ICON_SAVE          = 'save.png';                  // #pre-process_global_constant
const ICON_ENTITY_GROUP  = 'share.png';                 // #pre-process_global_constant
const ICON_FULLSCREEN    = 'larger.png';                // #pre-process_global_constant
const ICON_LEFT          = 'arrow_left.png';            // #pre-process_global_constant
const ICON_RIGHT         = 'arrow_right.png';           // #pre-process_global_constant
const ICON_CROSS         = 'cross.png';                 // #pre-process_global_constant
const ICON_WORLDS        = 'bars_horizontal.png';       // #pre-process_global_constant
const ICON_LOCKED        = 'locked.png';                // #pre-process_global_constant
const ICON_UNLOCKED      = 'unlocked.png';              // #pre-process_global_constant
const ICON_WARNING       = 'warning.png';               // #pre-process_global_constant
const ICON_TELEPORT      = 'open.png';                  // #pre-process_global_constant
const ICON_CHECKMARK     = 'checkmark.png';             // #pre-process_global_constant
const ICON_SINGLE_PLAYER = 'singleplayer.png';          // #pre-process_global_constant
const ICON_WRENCH        = 'wrench.png';                // #pre-process_global_constant
const ICON_IMPORT        = 'import.png';                // #pre-process_global_constant
const ICON_INFORMATION   = 'information.png';           // #pre-process_global_constant
const ICON_MOVIE         = 'movie.png';                 // #pre-process_global_constant
const ICON_MENU_LIST     = 'menu_list.png';             // #pre-process_global_constant

const SKYBOX_FRONT  = 'skybox_front.jpg';               // #pre-process_global_constant
const SKYBOX_BACK   = 'skybox_back.jpg';                // #pre-process_global_constant
const SKYBOX_LEFT   = 'skybox_left.jpg';                // #pre-process_global_constant
const SKYBOX_RIGHT  = 'skybox_right.jpg';               // #pre-process_global_constant
const SKYBOX_TOP    = 'skybox_top.jpg';                 // #pre-process_global_constant
const SKYBOX_BOTTOM = 'skybox_bottom.jpg';              // #pre-process_global_constant

const CURSOR_TYPE_HORIZONTAL = 'scroll_horizontal.png'; // #pre-process_global_constant
const CURSOR_TYPE_VERTICAL   = 'scroll_vertical.png';   // #pre-process_global_constant
const CURSOR_TYPE_LARGER     = 'larger.png';            // #pre-process_global_constant
const CURSOR_TYPE_HAND       = 'cursor_hand.png';       // #pre-process_global_constant
const CURSOR_TYPE_POINTER    = 'cursor_pointer.png';    // #pre-process_global_constant
const CURSOR_TYPE_MOUSE      = 'mouse.png';             // #pre-process_global_constant

function TextureManager() {
    this.__init__();
}

TextureManager.prototype = {

    __init__: function() {
        this.texture_groups = {};

        this.texture_groups[TEXTURE_GROUP_CURSOR]     = {};
        this.texture_groups[TEXTURE_GROUP_SKYBOX]     = {};
        this.texture_groups[TEXTURE_GROUP_ICONS]      = {};
        this.texture_groups[TEXTURE_GROUP_TRANSITION] = {};
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

        let t;
        for (t = 0; t < this.sky_box_material.length; t++) {
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
