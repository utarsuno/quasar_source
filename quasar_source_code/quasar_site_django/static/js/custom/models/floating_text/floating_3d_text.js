'use strict';

function Floating3DText(text, type, scene, current_color) {
    this.__init__(text, type, scene, current_color);
}

Floating3DText.prototype = {

    size: null,
    height: null,
    text_height: null,

    material: null,
    text_geometry: null,

    current_text_object: null,

    initialize: function() {
        if (this.type === TYPE_SUPER_TITLE || this.type === TYPE_SUPER_TITLE_CONSTANT) {
            this.height = 32 * 4;
            this.size = 40 * 4;
            this.text_height = 2 * 4;
        } else if (this.type === TYPE_TITLE || this.type === TYPE_TITLE_CONSTANT) {
            this.height = 32;
            this.size = 40;
            this.text_height = 2;
        } else {
            this.height = 16;
            this.text_height = 1;
        }

        this._update_text();
    },

    _update_color: function() {
        this._update_text();
    },

    _update_text: function() {
        // FOR_DEV_START
        l('Creating 3D Text!');
        // FOR_DEV_END

        if (this.text_geometry !== null) {
            this.text_geometry.dispose();
        }
        if (this.current_text_object !== null) {
            this.object3D.remove(this.current_text_object);
            this.current_text_object.geometry.dispose();
            this.current_text_object.material.dispose();
        }

        if (this.text.length === 0) {
            this.text = '___REMOVE_ME___';
        }

        this.text_geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.text_height,
            curveSegments: 2,
            font: GLOBAL_FONT
        });

        this.material = new THREE.MeshLambertMaterial({color: this.current_color});
        
        this.current_text_object = new THREE.Mesh(this.text_geometry, this.material);

        var box = new THREE.Box3().setFromObject(this.current_text_object);
        this.width = box.max.x;
        this.height = box.max.y;

        this.object3D.add(this.current_text_object);

        this.material.side = THREE.FrontSide;
        this.material.color.setHex(this.current_color);
        this.material.needsUpdate = true;

        if (this.text === '___REMOVE_ME___') {
            this.object3D.visible = false;
            this.mesh.visible = false;
        }

        if (is_defined(this.scene)) {
            this.scene.add(this.object3D);
        }
    },

    __init__: function(text, type, scene, current_color) {
        this.is_2D_text = false;

        // Inherit from FloatingText.
        FloatingText.call(this, 0, text, type, scene, current_color);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();
    }
};

