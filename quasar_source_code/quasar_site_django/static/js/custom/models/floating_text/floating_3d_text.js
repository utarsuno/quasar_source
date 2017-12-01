'use strict';

function Floating3DText(w, text, type, scene, current_color) {
    this.__init__(w, text, type, scene, current_color);
}

//const GLOBAL_FONT = new THREE.Font(JSON.parse(document.getElementById('font_3d').innerHTML))

Floating3DText.prototype = {

    size: null,
    height: null,
    text_height: null,

    material: null,
    text_geometry: null,

    current_text_object: null,

    __init__: function(w, text, type, scene, current_color) {
        this.is_2d_text = false;

        // Inherit from FloatingText.
        FloatingText.call(this, w, text, type, scene, current_color);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);
    },

    update_just_color: function(color_arg) {
        this.default_color = color_arg;
        this.material.color.setHex(color_arg);
        this.material.needsUpdate = true;
    },

    initialize: function() {
        if (this.type === TYPE_SUPER_TITLE) {
            this.height = 32 * 4;
            this.size = 40 * 4;
            this.text_height = 2 * 4;
        } else if (this.type === TYPE_TITLE) {
            this.height = 32;
            this.size = 40;
            this.text_height = 2;
        } else {
            this.height = 16;
            this.text_height = 1;
        }

        this.material = new THREE.MeshLambertMaterial({color: this.current_color});
        this.material.needsUpdate = true;
    },

    _update_text: function() {
        this._update_text_color();
    },

    _update_text_color: function() {
        if (this.text_geometry !== null) {
            this.text_geometry.dispose();
        }

        this.text_geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.text_height,
            curveSegments: 2,
            font: GLOBAL_FONT
        });
        
        this.current_text_object = new THREE.Mesh(this.text_geometry, this.material);
        this.object3D.add(this.current_text_object);
        this.scene.add(this.object3D);

        this.material.side = THREE.FrontSide;
        this.material.color.setHex(this.current_color);
        this.material.needsUpdate = true;

        if (this.current_text_object !== null) {
            this.object3D.remove(this.current_text_object);
            this.current_text_object.geometry.dispose();
            this.current_text_object.material.dispose();
        }
    }

};