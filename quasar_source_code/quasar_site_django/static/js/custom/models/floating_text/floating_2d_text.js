'use strict';

function Floating2DText(w, text, type, world, syntax_checks) {
    this.__init__(w, text, type, world, syntax_checks);
}

const TEMP_SMUDGE_FACTOR = 0.75;

Floating2DText.prototype = {

    material: null,
    dynamic_texture: null,

    current_background_color: null,

    tool_tip_text: null,

    // TODO : Refactoring
    _update_text: function() {
        if (this.text !== ICON_LEFT && this.text !== ICON_RIGHT && this.text !== ICON_CROSS) {
            if (this.type === TYPE_BUTTON || this.type === TYPE_CHECK_BOX || this.type === TYPE_TITLE || this.type === TYPE_SUPER_TITLE) {
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

    refresh_for_2D_text: function() {
        if (this.type === TYPE_ICON) {
            // TODO :
            l('REFRESH THIS ICON!!');
        } else {
            var x_offset = 0;
            if (this.type === TYPE_BUTTON || this.type === TYPE_CHECK_BOX || this.type === TYPE_TITLE || this.type === TYPE_SUPER_TITLE) {
                x_offset = this.texture_width / 2 - this.get_text_length() / 2;
            }
            if (this.current_background_color !== COLOR_TRANSPARENT) {
                this.dynamic_texture.clear(this.current_background_color).drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
            } else {
                this.dynamic_texture.clear().drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
            }
            this.dynamic_texture.needsUpdate = true;
        }
    },

    _update_width: function(width) {
        this.width = width;
        this.resource_cleanup();
        // TODO : Probably need a better design than this.
        this.initialize(false);
    },

    resource_cleanup: function() {
        this.material.dispose();
        this.geometry.dispose();
        this.mesh.dispose();
        this.object3D.remove(this.mesh);
        /*
        if (!keep_icons) {
            if (is_defined(this._icon_to_the_right)) {
                this.world.remove_from_interactive_then_scene(this._icon_to_the_right);
            }
            if (is_defined(this._icon_over_center)) {
                this.world.remove_from_interactive_then_scene(this._icon_over_center);
            }
        }
        */
    },

    set_background_color: function(color) {
        if (is_list(color)) {
            this.default_background_color = color[COLOR_STRING_INDEX];
        } else {
            this.default_background_color = color;
        }
        this.current_background_color = this.default_background_color;
        this._update_text(this.get_text());
    },

    set_tool_tip: function() {
        l('TODO : IMPLEMENT THE SET TOOL TIP FUNCTION!!');
    },

    initialize: function(add_to_scene) {
        if (this.type === TYPE_TITLE) {
            this.height = 26;
        } else {
            this.height = 16;
        }

        this.geometry = new THREE.PlaneGeometry(this.width, this.height);

        if (this.type === TYPE_ICON) {
            this.material = new THREE.MeshBasicMaterial({
                map : MANAGER_LOADING.get_texture(TEXTURE_GROUP_ICONS, this.text)
            });
            this.material.transparent = true;
        } else {

            this.texture_width = get_nearest_power_of_two_for_number(this.width * 2);
            var texture_height = get_nearest_power_of_two_for_number(this.height * 2);
            //var font_size = Math.round(texture_height * .8);
            //l('Font size is : ' + font_size);
            this.font_size = texture_height;

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

            //this._update_color();
            this._update_text();
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);

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

    display_icon_to_the_right: function(icon_type) {
        l('TODO !!!! DISPLAY AN ICON TO THE RIGHT!!');
        if (!is_defined(this._icon_to_the_right)) {

        }
    },

    display_icon_over_center: function(icon_type) {
        l('TODO !!!! DISPLAY AN ICON HOVERING OVER THE CENTER!!');

    },

    __init__: function(w, text, type, world, syntax_checks) {
        if (is_defined(syntax_checks)) {
            // Inherit from TextSyntax.
            TextSyntax.call(this, syntax_checks);
        }

        // Inherit from FloatingText.
        FloatingText.call(this, w, text, type, world, true);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();
    }

};
