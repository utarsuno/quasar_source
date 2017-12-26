'use strict';

function FloatingText(width, text, type, scene, current_color) {

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
    this.width         = width;
    this.type          = type;
    this.scene         = scene;
    this.object3D      = new THREE.Object3D();
    this.current_color = null;
    this.default_color = null;

    // Default value.
    this.normal_depth  = 1;

    if (is_defined(current_color)) {
        this.current_color = current_color;
        this.default_color = current_color;
    }
    // Convert to the correct color type.
    if (is_list(this.current_color)) {
        var temp = this.current_color;
        if (this.is_2D_text) {
            this.current_color = temp[COLOR_STRING_INDEX];
            this.default_color = temp[COLOR_STRING_INDEX];
        } else {
            this.current_color = temp[COLOR_HEX_INDEX];
            this.default_color = temp[COLOR_HEX_INDEX];
        }
    }

    if (this.type === TYPE_INPUT_PASSWORD) {
        this.text = '';
        for (var c = 0; c < text.length; c++) {
            this.text += '*';
        }
        this.hidden_text = text;
    } else {
        this.text = text;
    }

    // Call the child initialize functions.
    this.initialize();

    // Gets called from child functions.
    this.final_initialize = function() {
        this.is_in_interactive_list = false;
        if(!is_defined(this.current_color)) {
            switch (this.type) {
            case TYPE_BUTTON:
            case TYPE_CHECK_BOX:
                this.set_default_color(COLOR_TEXT_BUTTON);
                this.maintain_engage_when_tabbed_to = false;
                this.engable = false;
                break;
            case TYPE_CONSTANT_TEXT:
            case TYPE_TITLE_CONSTANT:
            case TYPE_SUPER_TITLE_CONSTANT:
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

    // This is just an alternative name to the function update_color.
    this.set_color = function(color) {
        this.update_color(color);
    };

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
        this._update_color();
    };

    // Gets called in constructor so defining this function first.
    this.update_color = function(color) {
        if (is_list(color)) {
            var color_to_set = null;
            if (this.is_2D_text) {
                color_to_set = color[COLOR_STRING_INDEX];
            } else {
                color_to_set = color[COLOR_HEX_INDEX];
            }
            this.current_color = color_to_set;
            this._update_color();
        } else {
            if (this.is_2D_text) {
                this.current_color = color;
                this._update_color();
            } else {
                if (color.toString().includes('#')) {
                    color = parseInt(color.replace('#', '0x'));
                    this.current_color = color;
                    this._update_color();
                }
            }
        }
    };

    this.update_text = function(text) {
        // TODO : This is currently assuming this function never gets called on a Password field.
        if (this.text !== text) {
            this.text = text;
            this._update_text();
            if (is_defined(this.value_changed_function)) {
                this.value_changed_function(text);
            }
        }
    };

    this.get_text_as_value = function() {
        return parseInt(this.get_text());
    };

    this.get_text = function() {
        if (this.type === TYPE_INPUT_PASSWORD) {
            return this.hidden_text;
        }
        return this.text;
    };

    this._add_character = function(character) {
        this.update_text(this.text + character);
    };

    this._pop_character = function() {
        this.update_text(this.text.slice(0, -1));
    };

    this.parse_text = function(text) {
        for (var i = 0; i < text.length; i++) {
            if (this.type === TYPE_INPUT_PASSWORD) {
                this.hidden_text += text.charAt(i);
                this._add_character('*');
            } else {
                this._add_character(text.charAt(i));
            }
        }
    };

    this.parse_keycode = function(event) {
        var keycode = event.keyCode;

        if (keycode === KEY_CODE_DELETE) {
            if (this.text.length > 0) {
                this._pop_character();
                if (this.type === TYPE_INPUT_PASSWORD) {
                    this.hidden_text = this.hidden_text.slice(0, -1);
                }
                MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            if (this.type === TYPE_INPUT_PASSWORD) {
                this.hidden_text += event.key;
                this._add_character('*');
            } else if (this.type === TYPE_INPUT_REGULAR) {
                this._add_character(event.key);
            } else if (this.type === TYPE_TITLE) {
                this._add_character(event.key);
            }
            MANAGER_AUDIO.play_typing_sound();
        }
    };

    this.get_position = function() {
        return this.object3D.position;
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

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    this.state_change_look_at = function(being_looked_at) {
        if (being_looked_at) {
            if (this.hasOwnProperty('background_color')) {
                this.background_color = BACKGROUND_COLOR_FOCUS;
            }
            this.update_color(COLOR_HIGHLIGHT);
        } else {
            if (this.hasOwnProperty('background_color')) {
                this.background_color = BACKGROUND_COLOR_DEFAULT;
            }
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
            }
        } else {
            CURRENT_PLAYER.disengage();
        }
    };
}