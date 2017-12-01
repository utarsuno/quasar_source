'use strict';

function Floating2DText(w, text, type, scene, current_color) {
    this.__init__(w, text, type, scene, current_color);
}

Floating2DText.prototype = {

    material: null,
    dynamic_texture: null,

    __init__: function(w, text, type, scene, current_color) {
        this.is_2d_text = true;

        // Inherit from FloatingText.
        FloatingText.call(this, w, text, type, scene, current_color);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);
    },

    get_text_length: function() {
        return this.dynamic_texture.getTextLength(this.text);
    },

    clear_text: function() {
        this.dynamic_texture.clear();
        this.dynamic_texture.needsUpdate = true;
    },

    _update_text: function() {
        this.dynamic_texture.clear('black').drawText(this.text, 0, this.height, this.current_color, 'black');
        this.dynamic_texture.needsUpdate = true;
    },

    _update_color: function() {
        this.dynamic_texture.clear('black').drawText(this.text, 0, this.height, this.current_color, 'black');
        this.dynamic_texture.needsUpdate = true;
    },

    initialize: function() {
        if (this.type == TYPE_TITLE) {
            this.height = 32;
        } else {
            this.height = 16;
        }

        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);

        var texture_width  = get_nearest_power_of_two_for_number(this.width * 2);
        var texture_height = get_nearest_power_of_two_for_number(this.height * 2);
        var font_size = Math.round(texture_height * .4);

        l('Font size is : ' + font_size);

        this.dynamic_texture = new THREEx.DynamicTexture(texture_width, texture_height);
        if (this.type == TYPE_TITLE) {
            this.dynamic_texture.context.font = 'Bold ' + str(font_size) + 'px Arial';
        } else {
            this.dynamic_texture.context.font = str(font_size) + 'px Arial';
        }
        // TODO : Investigate this
        //this.dynamic_texture.texture.anisotropy = renderer_api.renderer.capabilities.getMaxAnisotropy()
        
        this.material = new THREE.MeshBasicMaterial({
            map : this.dynamic_texture.texture
        });

        this.material.transparent = false;
        this.material.side = THREE.FrontSide;

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.object3D.add(this.mesh);
        this.scene.add(this.object3D);
    }

};
