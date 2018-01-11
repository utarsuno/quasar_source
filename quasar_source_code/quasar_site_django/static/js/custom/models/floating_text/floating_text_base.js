'use strict';

function FloatingText(width, text, type, world, is_2D_text) {

    // Needs to be defined here for now.
    this.get_text_length = function() {
        if (this.is_2D_text) {
            return this.dynamic_texture.getTextLength(this.text);
        } else {
            return this.width;
        }
    };

    /*   __   __        __  ___  __        __  ___  __   __
        /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
        \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.is_2D_text    = is_2D_text;
    this.width         = width;
    this.type          = type;
    this.world         = world;
    this.scene         = this.world.scene;
    this.object3D      = new THREE.Object3D();

    // Color variables.
    this.default_background_color = COLOR_TRANSPARENT;
    this.current_background_color = COLOR_TRANSPARENT;
    this.default_color = null;
    this.current_color = null;


    this.format_type   = null;

    // Default value.
    this.normal_depth  = 1;

    if (this.type === TYPE_PASSWORD) {
        this.hidden_text = text;
        this.text = '';
        for (var c = 0; c < this.hidden_text.length; c++) {
            this.text += '*';
        }
    } else {
        this.text = text;
    }

    // Call the child initialize functions.
    this.initialize();


    // Gets called from child functions.
    this.final_initialize = function() {
        switch (this.type) {
        case TYPE_BUTTON:
        case TYPE_CHECK_BOX:
            this.maintain_engage_when_tabbed_to = false;
            this.engable = false;
            // Inherit from InheritableButton (to gain properties of a button).
            InheritableButton.call(this);
            break;
        case TYPE_CONSTANT:
            this.maintain_engage_when_tabbed_to = false;
            this.engable = false;
            break;
        }

        if(!is_defined(this.current_color)) {

            l('The current color is not defined!!!');

            switch (this.type) {
            case TYPE_BUTTON:
            case TYPE_CHECK_BOX:
                this.set_default_color(COLOR_TEXT_BUTTON);
                this.maintain_engage_when_tabbed_to = false;
                this.engable = false;
                break;
            case TYPE_CONSTANT:
                this.set_default_color(COLOR_TEXT_CONSTANT);
                this.engable = false;
                break;
            case TYPE_TITLE:
                this.set_default_color(COLOR_TEXT_DEFAULT);
                break;
            default:
                this.set_default_color(COLOR_TEXT_DEFAULT);
                break;
            }
        }
    };

    /*   ___            __  ___    __        __
        |__  |  | |\ | /  `  |  | /  \ |\ | /__`
        |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    this.set_format_type = function(format_type) {
        this.format_type = format_type;
    };

    this.update_color = function(color) {
        if (is_list(color)) {
            var color_to_set = null;
            if (this.is_2D_text) {
                color_to_set = color[COLOR_STRING_INDEX];
            } else {
                color_to_set = color[COLOR_HEX_INDEX];
            }
            this.current_color = color_to_set;
            //this._update_color();
        } else {
            if (this.is_2D_text) {
                this.current_color = color;
                //this._update_color();
            } else {
                if (color.toString().includes('#')) {
                    color = parseInt(color.replace('#', '0x'));
                    this.current_color = color;
                    //this._update_color();
                }
            }
        }
    };

    this.update_text = function(text) {
        if (this.get_text() !== text) {
            if (is_defined(this.value_pre_changed_function)) {
                this.value_pre_changed_function(text);
            }
            if (this.type === TYPE_PASSWORD) {
                this.hidden_text = '';
                this.text = '';
                for (var c = 0; c < text.length; c++) {
                    this.hidden_text += text.charAt(c);
                    this.text += '*';
                }
            } else {
                this.text = text;
            }
            this._update_text();
            if (is_defined(this.value_post_changed_function)) {
                this.value_post_changed_function(text);
            }
        }
    };

    this._add_character = function(character) {
        this.update_text(this.get_text() + character);
    };

    this._pop_character = function() {
        var t = this.get_text();
        this.update_text(t.slice(0, -1));
    };

    this.parse_text = function(text) {
        for (var i = 0; i < text.length; i++) {
            this._add_character(text.charAt(i));
        }
    };

    this.parse_keycode = function(event) {
        var keycode = event.keyCode;

        if (keycode === KEY_CODE_DELETE) {
            if (this.get_text().length > 0) {
                this._pop_character();
                MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            this._add_character(event.key);
            MANAGER_AUDIO.play_typing_sound();
        }
    };

    this.update_position_and_look_at_origin = function(position_vector) {
        this.update_position_and_normal(position_vector, new THREE.Vector3(0 - position_vector.x, 0, 0 - position_vector.z));
    };

    this.update_position = function(position_vector) {
        // TODO : optimize

        this.object3D.position.x = position_vector.x + this.normal.x * this.normal_depth;
        this.object3D.position.y = position_vector.y + this.normal.y * this.normal_depth;
        this.object3D.position.z = position_vector.z + this.normal.z * this.normal_depth;

        this.x_without_normal = this.object3D.position.x - this.normal.x * this.normal_depth;
        this.y_without_normal = this.object3D.position.y - this.normal.y * this.normal_depth;
        this.z_without_normal = this.object3D.position.z - this.normal.z * this.normal_depth;
    };

    this.update_position_with_offset_xyz = function(x, y, z) {
        // TODO : optimize

        this.object3D.position.x = this.x_without_normal + x + this.normal.x * this.normal_depth;
        this.object3D.position.y = this.y_without_normal + y + this.normal.y * this.normal_depth;
        this.object3D.position.z = this.z_without_normal + z + this.normal.z * this.normal_depth;

        this.x_without_normal = this.object3D.position.x - this.normal.x * this.normal_depth;
        this.y_without_normal = this.object3D.position.y - this.normal.y * this.normal_depth;
        this.z_without_normal = this.object3D.position.z - this.normal.z * this.normal_depth;
    };

    this.set_normal_depth = function(depth) {
        if (depth <= 0) {
            this.normal_depth = 1;
        } else {
            this.normal_depth = depth;
        }
    };

    this.update_normal = function(normal) {
        this.normal = new THREE.Vector3(normal.x, normal.y, normal.z);
        this.normal.normalize();
        this.object3D.lookAt(new THREE.Vector3(this.object3D.position.x + this.normal.x * 100, this.object3D.position.y + this.normal.y * 100, this.object3D.position.z + this.normal.z * 100));
    };

    this.update_position_and_normal = function(position_vector, normal) {
        this.update_normal(normal);
        this.update_position(position_vector);
    };

    this.clear = function() {
        this._update_text('');
    };

    /*__   __        __   __      __   __   ___  __       ___    __        __
     /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this._parse_color = function(c) {
        if (is_list(c)) {
            if (this.is_2D_text) {
                return c[COLOR_STRING_INDEX];
            }
            return c[COLOR_HEX_INDEX];
        } else {
            l('A non list color was passed?');
            l(c);
            return c;
        }
    };

    /*
    this.set_default_color = function(default_color) {
        if (is_list(default_color)) {
            if (this.is_2D_text) {
                this.default_color = default_color[COLOR_STRING_INDEX];
            } else {
                this.default_color = default_color[COLOR_HEX_INDEX];
            }
        } else {
            if (!this.is_2D_text) {
                if (default_color.toString().includes('#')) {
                    default_color = parseInt(default_color.replace('#', '0x'));
                }
            }
            this.default_color = default_color;
        }
        this.current_color = this.default_color;
        if (!is_defined(this.previous_default_color)) {
            this.previous_default_color = this.default_color;
        }
        //this._update_color();
    };
    */

    this.set_default_color = function(color) {
        this.default_color = this._parse_color(color);
        // TODO : Consider moving the location of this call.
        this.refresh();
    };


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_as_value = function() {
        return parseInt(this.get_text());
    };

    this.get_text = function() {
        if (this.type === TYPE_PASSWORD) {
            return this.hidden_text;
        }
        return this.text;
    };

    this.get_position = function() {
        return this.object3D.position;
    };

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    this.state_change_look_at = function(being_looked_at) {
        if (being_looked_at) {
            this.current_background_color = BACKGROUND_COLOR_FOCUS;
            this.update_color(COLOR_HIGHLIGHT);
        } else {
            this.current_background_color = this.default_background_color;
            this.update_color(this.default_color);
        }
    };

    this.state_change_engage = function(being_engaged_with) {
        if (being_engaged_with) {
            if (this.type !== TYPE_BUTTON && this.type !== TYPE_CHECK_BOX) {
                CURRENT_PLAYER.engage();
            } else {
                this.being_engaged_with = false;
                CURRENT_PLAYER.disengage();

                if (MANAGER_WORLD.current_floating_cursor.engaged) {
                    l('disengage the cursor please!');
                    MANAGER_WORLD.current_floating_cursor.disengage();
                }
            }
        } else {
            CURRENT_PLAYER.disengage();

            if (MANAGER_WORLD.current_floating_cursor.engaged) {
                l('disengage the cursor please 2!');
                MANAGER_WORLD.current_floating_cursor.disengage();
            }
        }
    };
}