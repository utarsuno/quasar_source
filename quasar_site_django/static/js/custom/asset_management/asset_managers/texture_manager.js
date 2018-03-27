'use strict';

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
            this.sky_box_material[t] = new THREE.MeshBasicMaterial({map: this.sky_box_material[t], side: THREE.FrontSide, transparent: false});
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
