'use strict';

const TEXTURE_GROUP_SKYBOX      = 'skybox/';            // #pre-process_global_constant
const TEXTURE_GROUP_CURSOR      = 'cursors/';           // #pre-process_global_constant
const TEXTURE_GROUP_ICONS       = 'icons/';             // #pre-process_global_constant
const TEXTURE_GROUP_TRANSITION  = 'third_party/';       // #pre-process_global_constant
const TEXTURE_GROUP_SPRITESHEET = 'spritesheet/';       // #pre-process_global_constant

const SPRITESHEET_ICONS  = 'icon_sheet.png';            // #pre-process_global_constant

const TRANSITION_GRID    = 'grid_transition.png';       // #pre-process_global_constant

const SKYBOX_FRONT  = 'skybox_front.jpg';               // #pre-process_global_constant
const SKYBOX_BACK   = 'skybox_back.jpg';                // #pre-process_global_constant
const SKYBOX_LEFT   = 'skybox_left.jpg';                // #pre-process_global_constant
const SKYBOX_RIGHT  = 'skybox_right.jpg';               // #pre-process_global_constant
const SKYBOX_TOP    = 'skybox_top.jpg';                 // #pre-process_global_constant
const SKYBOX_BOTTOM = 'skybox_bottom.jpg';              // #pre-process_global_constant

function TextureManager() {
    this.__init__();
}

TextureManager.prototype = {

    __init__: function() {
        //this.texture_groups = {};

        this.textures = {};

        //this.texture_groups[TEXTURE_GROUP_CURSOR]     = {};
        //this.texture_groups[TEXTURE_GROUP_SKYBOX]     = {};
        //this.texture_groups[TEXTURE_GROUP_ICONS]      = {};
        //this.texture_groups[TEXTURE_GROUP_TRANSITION] = {};
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

    _set_texture: function(texture_name, texture) {
        this.textures[texture_name] = texture;
    },

    set_texture: function(texture_name, texture) {
        MANAGER_TEXTURE._set_texture(texture_name, texture);
    },

    get_texture: function(texture_group, texture_name) {
        //return this.texture_groups[texture_group][texture_name];
        return this.textures[texture_name];
    }
};
