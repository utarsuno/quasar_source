'use strict';

const SPRITESHEET_ICONS = 'spritesheet/i.png'; // #pre-process_global_constant
const TRANSITION_GRID   = 'third_party/t.png'; // #pre-process_global_constant
const SKYBOX_FRONT      = 'skybox/f.jpg';      // #pre-process_global_constant
const SKYBOX_BACK       = 'skybox/ba.jpg';     // #pre-process_global_constant
const SKYBOX_LEFT       = 'skybox/l.jpg';      // #pre-process_global_constant
const SKYBOX_RIGHT      = 'skybox/r.jpg';      // #pre-process_global_constant
const SKYBOX_TOP        = 'skybox/t.jpg';      // #pre-process_global_constant
const SKYBOX_BOTTOM     = 'skybox/bo.jpg';     // #pre-process_global_constant

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
