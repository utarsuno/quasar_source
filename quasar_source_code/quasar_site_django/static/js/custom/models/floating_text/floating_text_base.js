'use strict';

function FloatingText(width, text, type, scene, current_color) {
    /*   __   __        __  ___  __        __  ___  __   __
        /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
        \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.width         = width;
    this.type          = type;
    this.scene         = scene;
    this.object3D      = new THREE.Object3D();
    this.current_color = COLOR_DAY_PRESENT;
    this.default_color = COLOR_DAY_PRESENT;
    if (is_defined(current_color)) {
        this.current_color = current_color;
        this.default_color = current_color;
    }
    // Convert to the correct color type.
    if (is_list(this.current_color)) {
        var temp = this.current_color;
        if (this.is_2d_text) {
            this.current_color = temp[COLOR_STRING_INDEX];
            this.default_color = temp[COLOR_STRING_INDEX];
        } else {
            this.current_color = temp[COLOR_HEX_INDEX];
            this.default_color = temp[COLOR_HEX_INDEX];
        }
    }

    //l('Current color ' + this.current_color);
    //l('Default color ' + this.current_color);

    if (this.type == TYPE_INPUT_PASSWORD) {
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
        switch (this.type) {
        case TYPE_BUTTON:
        case TYPE_CHECK_BOX:
            this.maintain_engage_when_tabbed_to = false;
            this.engable = false;
            break;
        case TYPE_CONSTANT_TEXT:
            this.engable = false;
        }
    };

    /*   ___            __  ___    __        __
        |__  |  | |\ | /  `  |  | /  \ |\ | /__`
        |    \__/ | \| \__,  |  | \__/ | \| .__/ */

    // This is just an alternative name to the function update_color.
    this.set_color = function(color) {
        this.update_color(color);
    };

    // Gets called in constructor so defining this function first.
    this.update_color = function(color) {
        if (is_list(color)) {
            var color_to_set = null;
            if (this.is_2d_text) {
                color_to_set = color[COLOR_STRING_INDEX];
            } else {
                color_to_set = color[COLOR_HEX_INDEX];
            }
            this.current_color = color_to_set;
            this._update_color();
        } else {
            this.current_color = color;
            this._update_color();
        }
    };

    this.update_text = function(text) {
        // TODO : This is currently assuming this function never gets called on a Password field.
        if (this.text !== text) {
            this.text = text;
            this._update_text();
        }
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
            }
            MANAGER_AUDIO.play_typing_sound();
        }
    };

    this.get_position = function() {
        return this.object3D.position;
    };

    this.update_position_and_look_at_origin = function(position_vector) {
        this.object3D.position.x = position_vector.x;
        this.object3D.position.y = position_vector.y;
        this.object3D.position.z = position_vector.z;
        this.normal = new THREE.Vector3(0 - position_vector.x, 0, 0 - position_vector.z);
        this.normal.normalize();
    };

    this.update_position = function(position_vector) {
        if (is_defined(this.normal_depth)) {
            this.object3D.position.x = position_vector.x + this.normal.x * this.normal_depth;
            this.object3D.position.y = position_vector.y + this.normal.y * this.normal_depth;
            this.object3D.position.z = position_vector.z + this.normal.z * this.normal_depth;
        } else {
            this.object3D.position.x = position_vector.x;
            this.object3D.position.y = position_vector.y;
            this.object3D.position.z = position_vector.z;
        }
    };

    this.update_position_with_offset_xyz = function(x, y, z) {
        this.object3D.position.x += x;
        this.object3D.position.y += y;
        this.object3D.position.z += z;
    };

    this.set_normal_depth = function(depth) {
        if (depth <= 0) {
            this.normal_depth  = 1;
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
        this.update_position(position_vector);
        this.update_normal(normal);
    };

    this.delete_self = function() {
        // TODO : Implement this function!!!
    };

    this.clear = function() {
        this._update_text('');
    };

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    this.state_change_look_at = function(being_looked_at) {
        if (being_looked_at) {
            this.update_color(COLOR_HIGHLIGHT);
        } else {
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