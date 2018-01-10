'use strict';

function Floating2DText(w, text, type, scene, current_color) {
    this.__init__(w, text, type, scene, current_color);
}

const TEMP_SMUDGE_FACTOR = 0.75;

Floating2DText.prototype = {

    material: null,
    dynamic_texture: null,

    current_background_color: null,

    _update_text: function() {
        if (this.text !== ICON_LEFT && this.text !== ICON_RIGHT && this.text !== ICON_CROSS) {
            if (this.type === TYPE_BUTTON || this.type === TYPE_CHECK_BOX || this.type === TYPE_TITLE || this.type === TYPE_TITLE_CONSTANT || this.type === TYPE_SUPER_TITLE_CONSTANT || this.type === TYPE_SUPER_TITLE) {
                if (this.current_background_color !== COLOR_TRANSPARENT) {
                    this.dynamic_texture.clear(this.current_background_color).drawText(this.text, this.texture_width / 2 - this.get_text_length() / 2, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                } else {
                    this.dynamic_texture.clear().drawText(this.text, this.texture_width / 2 - this.get_text_length() / 2, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                }
            } else {
                if (this.background_color !== COLOR_TRANSPARENT) {
                    this.dynamic_texture.clear(this.current_background_color).drawText(this.text, 0, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                } else {
                    this.dynamic_texture.clear().drawText(this.text, 0, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                }
            }
            this.dynamic_texture.needsUpdate = true;
        }
    },

    // NOTE : Values are different for testing purposes.

    _update_color: function() {
        if (this.text !== ICON_LEFT && this.text !== ICON_RIGHT && this.text !== ICON_CROSS) {
            if (this.type === TYPE_BUTTON || this.type === TYPE_CHECK_BOX || this.type === TYPE_TITLE || this.type === TYPE_TITLE_CONSTANT || this.type === TYPE_SUPER_TITLE_CONSTANT || this.type === TYPE_SUPER_TITLE) {
                if (this.current_background_color !== COLOR_TRANSPARENT) {
                    this.dynamic_texture.clear(this.current_background_color).drawText(this.text, this.texture_width / 2 - this.get_text_length() / 2, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                } else {
                    this.dynamic_texture.clear().drawText(this.text, this.texture_width / 2 - this.get_text_length() / 2, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                }
            } else {
                if (this.current_background_color !== COLOR_TRANSPARENT) {
                    this.dynamic_texture.clear(this.current_background_color).drawText(this.text, 0, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                } else {
                    this.dynamic_texture.clear().drawText(this.text, 0, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                }
            }
            this.dynamic_texture.needsUpdate = true;
        }
    },

    _update_width: function(width) {
        this.width = width;
        this.material.dispose();
        this.geometry.dispose();
        this.mesh.dispose();
        this.object3D.remove(this.mesh);
        this.initialize(false);
    },

    set_background_color: function(color) {
        if (is_list(color)) {
            this.default_background_color = color[COLOR_STRING_INDEX];
        } else {
            this.default_background_color = color;
        }
    },

    initialize: function(add_to_scene) {
        this.default_background_color = COLOR_TRANSPARENT;
        this.current_background_color = COLOR_TRANSPARENT;

        if (this.type === TYPE_TITLE || this.type === TYPE_TITLE_CONSTANT) {
            this.height = 26;
        } else {
            this.height = 16;
        }

        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);

        if (this.text === ICON_LEFT || this.text === ICON_RIGHT || this.text === ICON_CROSS) {
            this.material = new THREE.MeshBasicMaterial({
                map : MANAGER_WORLD.get_icon_texture(this.text)
            });
            this.material.transparent = true;
        } else {
            this.texture_width = get_nearest_power_of_two_for_number(this.width * 2);
            var texture_height = get_nearest_power_of_two_for_number(this.height * 2);
            //var font_size = Math.round(texture_height * .8);
            this.font_size = texture_height;

            //l('Font size is : ' + font_size);

            this.dynamic_texture = new THREEx.DynamicTexture(this.texture_width, texture_height);
            if (this.type === TYPE_TITLE) {
                this.dynamic_texture.context.font = 'Bold ' + str(this.font_size) + 'px Arial';
            } else {
                this.dynamic_texture.context.font = str(this.font_size) + 'px Arial';
            }

            this.dynamic_texture.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();

            this.material = new THREE.MeshBasicMaterial({
                map : this.dynamic_texture.texture
            });

            this.material.transparent = true;
            this.material.side = THREE.FrontSide;

            this._update_color();
            this._update_text();
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        /*
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
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        // TODO : Investigate if shader_material needs to be cloned or not.
        this.glow = new THREE.Mesh(this.geometry.clone(), this.shader_material.clone());
        //this.glow.position = this.mesh.position;
        this.glow.scale.multiplyScalar(1.4);
        //

        this.object3D.add(this.glow);
        */

        //
        //

        this.object3D.add(this.mesh);


        if (!is_defined(add_to_scene)) {
            if (is_defined(this.scene)) {
                this.scene.add(this.object3D);
            }
        } else {
            if (add_to_scene) {
                this.scene.add(this.object3D);
            }
        }
    },

    __init__: function(w, text, type, scene, current_color) {
        this.is_2D_text = true;

        // Inherit from FloatingText.
        FloatingText.call(this, w, text, type, scene, current_color);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();
    }

};
