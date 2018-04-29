'use strict';

const SPRITESHEET_ICONS = 1; // #pre-process_global_constant
const TRANSITION_GRID   = 2; // #pre-process_global_constant
const SKYBOX_FRONT      = 3; // #pre-process_global_constant
const SKYBOX_BACK       = 4; // #pre-process_global_constant
const SKYBOX_LEFT       = 5; // #pre-process_global_constant
const SKYBOX_RIGHT      = 6; // #pre-process_global_constant
const SKYBOX_TOP        = 7; // #pre-process_global_constant
const SKYBOX_BOTTOM     = 8; // #pre-process_global_constant

function TextureManager() {
    this.__init__();
}

TextureManager.prototype = {

    __init__: function() {
        this.textures = {};
    },

    create_skybox_material: function() {
        this.sky_box_material = [];
        // The order of these matter.
        this.sky_box_material.push(this.get_texture(SKYBOX_FRONT));
        this.sky_box_material.push(this.get_texture(SKYBOX_BACK));
        this.sky_box_material.push(this.get_texture(SKYBOX_TOP));
        this.sky_box_material.push(this.get_texture(SKYBOX_BOTTOM));
        this.sky_box_material.push(this.get_texture(SKYBOX_RIGHT));
        this.sky_box_material.push(this.get_texture(SKYBOX_LEFT));

        let t;
        for (t = 0; t < this.sky_box_material.length; t++) {
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

    get_texture: function(texture_name) {
        return this.textures[texture_name];
    }
};
