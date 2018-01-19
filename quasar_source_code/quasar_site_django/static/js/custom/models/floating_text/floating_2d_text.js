'use strict';

function Floating2DText(w, text, type, world, syntax_checks) {
    this.__init__(w, text, type, world, syntax_checks);
}

const TEMP_SMUDGE_FACTOR = 0.75;

Floating2DText.prototype = {

    material: null,
    dynamic_texture: null,

    tool_tip_text: null,

    _get_text_length: function() {
        return this.dynamic_texture.getTextLength(this.text);
    },

    refresh_for_2D_text: function() {
        if (this.type === TYPE_ICON) {
            // TODO :
            l('REFRESH THIS ICON!!');
        } else {
            if (this.text_changed || this.color_changed) {
                var x_offset = 0;
                if (this.type === TYPE_BUTTON || this.type === TYPE_CHECK_BOX || this.type === TYPE_TITLE || this.type === TYPE_SUPER_TITLE) {
                    x_offset = this.texture_width / 2 - this._get_text_length() / 2;
                }
                if (this.current_background_color !== COLOR_TRANSPARENT) {
                    this.dynamic_texture.clear(this.current_background_color).drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                } else {
                    this.dynamic_texture.clear().drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color, this.current_background_color);
                }
                this.dynamic_texture.needsUpdate = true;

                this.text_changed = false;
                this.color_changed = false;
            }
        }
    },

    // TODO : Refactor!!!
    _update_width: function(new_width_percentage) {
        this.width *= new_width_percentage;
        this.resource_cleanup();
    },

    set_tool_tip: function() {
        l('TODO : IMPLEMENT THE SET TOOL TIP FUNCTION!!');
    },

    __init__: function(w, text, type, world, syntax_checks) {
        // Inherit from Atachmentable.
        Attachmentable.call(this, world);

        if (is_defined(syntax_checks)) {
            // Inherit from TextSyntax.
            TextSyntax.call(this, syntax_checks);
        }

        // Inherit from FloatingText.
        FloatingText.call(this, text, type, true);

        // Inherit from Animatable.
        Animatable.call(this);

        this.width = w;
        if (type === TYPE_SUPER_TITLE) {
            this.height = 36;
        } else if (type === TYPE_TITLE) {
            this.height = 26;
        } else {
            this.height = 16;
        }
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        if (type === TYPE_ICON) {

            // TODO : Create a cleaner design in the future.
            if (this.text === CURSOR_TYPE_HORIZONTAL || this.text === CURSOR_TYPE_VERTICAL || this.text === CURSOR_TYPE_HAND || this.text === CURSOR_TYPE_POINTER || this.text === CURSOR_TYPE_LARGER || this.text === CURSOR_TYPE_MOUSE) {
                this.material = new THREE.MeshBasicMaterial({map : MANAGER_LOADING.get_texture(TEXTURE_GROUP_CURSOR, this.text), transparent : true});
            } else {
                this.material = new THREE.MeshBasicMaterial({map : MANAGER_LOADING.get_texture(TEXTURE_GROUP_ICONS, this.text)});
            }
        } else {
            this.texture_width = get_nearest_power_of_two_for_number(this.width * 2);
            var texture_height = get_nearest_power_of_two_for_number(this.height * 2);
            this.font_size = texture_height;

            this.dynamic_texture = new THREEx.DynamicTexture(this.texture_width, texture_height);
            if (this.type === TYPE_TITLE || this.type === TYPE_CONSTANT || this.type === TYPE_BUTTON) {
                this.dynamic_texture.context.font = 'Bold ' + str(this.font_size) + 'px Arial';
            } else {
                this.dynamic_texture.context.font = str(this.font_size) + 'px Arial';
            }
            this.dynamic_texture.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();

            this.material = new THREE.MeshBasicMaterial({
                map : this.dynamic_texture.texture
            });
        }
        this.material.transparent = true;
        // TODO : DoubleSide is temporary
        this.material.side = THREE.DoubleSide;
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.object3D.add(this.mesh);

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    full_remove: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
            // TODO : UPDATE THREE JS VERSION!
            //this.mesh.dispose();
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
        if (is_defined(this.material)) {
            this.material.dispose();
        }
    },

};


/* ___  __   __      __   __             ___         ___       __   ___
  |__  /  \ |__)    /  ` /  \ |\ | \  / |__  |\ | | |__  |\ | /  ` |__
  |    \__/ |  \    \__, \__/ | \|  \/  |___ | \| | |___ | \| \__, |___ */
function get_new_floating_icon(icon_type, world) {
    return new Floating2DText(16, icon_type, TYPE_ICON, world);
}
