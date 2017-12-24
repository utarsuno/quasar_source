'use strict';

function Floating3DText(w, text, type, scene, current_color) {
    this.__init__(w, text, type, scene, current_color);
}

Floating3DText.prototype = {

    size: null,
    height: null,
    text_height: null,

    material: null,
    text_geometry: null,

    current_text_object: null,

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

        this.text_geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.text_height,
            curveSegments: 2,
            font: GLOBAL_FONT
        });

        this.material = new THREE.MeshLambertMaterial({color: this.current_color});
        
        this.current_text_object = new THREE.Mesh(this.text_geometry, this.material);
        this.object3D.add(this.current_text_object);

        // Shader testing
        this.shader_material = new THREE.ShaderMaterial({
            uniforms: {
                'c': {type: 'f', value: 1.0},
                'p': {type: 'f', value: 6},
                glowColor: {type: 'c', value: new THREE.Color(0xffff00)},
                viewVector: {type: 'v3', value: this.object3D.position}
            },
            vertexShader: MANAGER_SHADER.VERTEX_GLOW,
            fragmentShader: MANAGER_SHADER.FRAGMENT_GLOW,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        // TODO : Investigate if shader_material needs to be cloned or not.
        this.glow = new THREE.Mesh(this.text_geometry.clone(), this.shader_material.clone());
        //this.glow.position = this.mesh.position;
        this.glow.scale.multiplyScalar(1.4);

        this.object3D.add(this.glow);
        //

        this.material.side = THREE.FrontSide;
        this.material.color.setHex(this.current_color);
        this.material.needsUpdate = true;

        if (is_defined(this.scene)) {
            this.scene.add(this.object3D);
        }
    },

    __init__: function(w, text, type, scene, current_color) {
        this.is_2d_text = false;

        // Inherit from FloatingText.
        FloatingText.call(this, w, text, type, scene, current_color);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();
    }
};