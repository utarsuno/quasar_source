'use strict';

function FloatingText(width, text, type, scene, current_color) {

    // This is just an alternative name to the function update_color.
    this.set_color = function(color) {
        this.update_color(color);
    };

    // Gets called in constructor so defining this function first.
    this.update_color = function(color) {
        var color_to_set = null;
        if (this.is_2d_text) {
            color_to_set = color[COLOR_STRING_INDEX];
        } else {
            color_to_set = color[COLOR_HEX_INDEX];
        }
        if (this.current_color !== color_to_set) {
            this.current_color = color_to_set;
            this._update_color();
        }
    };

    /*   __   __        __  ___  __        __  ___  __   __
        /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
        \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.width         = width;
    this.type          = type;
    // FOR_DEV_START
    if (!is_defined(scene)) {
        l(text);
        l('THE SCENE PASSED IN TO FLOATINGTEXT IS NOT DEFINED!');
    }
    // FOR_DEV_END
    this.scene         = scene;
    this.object3D      = new THREE.Object3D();
    this.current_color = COLOR_DAY_PRESENT;
    this.default_color = COLOR_DAY_PRESENT;
    if (is_defined(current_color)) {
        this.current_color = current_color;
        this.default_color = current_color;
    }
    // Convert to the correct color type.
    this.set_color(this.current_color);

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

    /*   ___            __  ___    __        __
        |__  |  | |\ | /  `  |  | /  \ |\ | /__`
        |    \__/ | \| \__,  |  | \__/ | \| .__/ */

    this.get_height = function() {
        return this.height;
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
        this.force_update_text(this.text + character);
    };

    this._pop_character = function() {
        this.force_update_text(this.text.slice(0, -1));
    };

    this.parse_keycode = function(event) {
        var keycode = event.keyCode;

        if (keycode === KEY_CODE_DELETE) {
            if (this.text.length > 0) {
                this._pop_character();
                if (this.type === TYPE_INPUT_PASSWORD) {
                    this._hidden_text = this._hidden_text.slice(0, -1);
                }
                MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            if (this.type === TYPE_INPUT_PASSWORD) {
                this._hidden_text += event.key;
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

    this.update_position = function(position_vector) {
        this.object3D.position.x = position_vector.x;
        this.object3D.position.y = position_vector.y;
        this.object3D.position.z = position_vector.z;
    };

    this.update_look_at = function(look_at_position_vector) {
        this.object3D.lookAt(look_at_position_vector);
    };

    this.update_position_and_look_at = function(position_vector, look_at_position) {
        this.object3D.position.x = position_vector.x;
        this.object3D.position.y = position_vector.y;
        this.object3D.position.z = position_vector.z;
        this.object3D.lookAt(look_at_position);
    };

    this.delete_self = function() {
        // TODO : Implement this function!!!
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