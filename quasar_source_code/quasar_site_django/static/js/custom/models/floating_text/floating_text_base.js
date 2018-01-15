'use strict';

function FloatingText(text, type, world, is_2D_text) {

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
            //l('A non list color was passed?');
            //(c);
            return c;
        }
    };

    this.set_background_color = function(color, refresh) {
        this.current_background_color = this._parse_color(color);
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    this.set_default_background_color = function(color, refresh) {
        this.default_background_color = this._parse_color(color);
        if (!is_defined(this.current_background_color)) {
            this.current_background_color = this.default_background_color;
        }
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    this.set_color = function(color, refresh) {
        this.current_color = this._parse_color(color);
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    this.set_default_color = function(color, refresh) {
        this.default_color = this._parse_color(color);
        if (!is_defined(this.current_color)) {
            this.current_color = this.default_color;
        }
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    /*__   __        __  ___  __        __  ___  __   __
     /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
     \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.is_2D_text    = is_2D_text;
    this.type          = type;
    this.world         = world;
    this.scene         = this.world.scene;
    this.scene.add(this.object3D);

    this.text_changed = false;
    this.color_changed = false;

    // Color variables.
    this.set_default_background_color(COLOR_TRANSPARENT, false);
    this.set_background_color(COLOR_TRANSPARENT, false);
    this.set_default_color(COLOR_TEXT_DEFAULT, false);
    this.set_color(COLOR_TEXT_DEFAULT, false);

    this.format_type   = null;

    if (this.type === TYPE_PASSWORD) {
        this.hidden_text = text;
        this.text = '';
        for (var c = 0; c < this.hidden_text.length; c++) {
            this.text += '*';
        }
    } else {
        this.text = text;
    }

    // Gets called from child functions.
    // TODO : Reformat this so this function isn't needed anymore
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

        if (type === TYPE_INPUT || type === TYPE_PASSWORD || type === TYPE_BUTTON) {
            this.world.interactive_objects.push(this);
        }

        if(!is_defined(this.current_color)) {
            switch (this.type) {
            case TYPE_BUTTON:
            case TYPE_CHECK_BOX:
                this.set_default_color(COLOR_TEXT_BUTTON);
                this.set_color(COLOR_TEXT_BUTTON);
                break;
            case TYPE_CONSTANT:
                this.set_default_color(COLOR_TEXT_CONSTANT);
                this.set_color(COLOR_TEXT_CONSTANT);
                break;
            case TYPE_TITLE:
                this.set_default_color(COLOR_TEXT_DEFAULT);
                this.set_color(COLOR_TEXT_DEFAULT);
                break;
            default:
                this.set_default_color(COLOR_TEXT_DEFAULT);
                this.set_color(COLOR_TEXT_DEFAULT);
                break;
            }
        }
        this.color_changed = true;
        this.refresh();
    };

    /*___            __  ___    __        __
     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    this.refresh = function() {
        // If there was any text or color changes this will have them appear.
        if (this.color_changed || this.text_changed) {
            if (this.is_2D_text) {
                this.refresh_for_2D_text();
            } else {
                this.refresh_for_3D_text();
            }
            this.color_changed = false;
            this.color_changed = false;
        }
    };

    this.set_format_type = function(format_type) {
        this.format_type = format_type;
    };

    this.clear = function() {
        this.update_text('');
    };

    /*___  ___     ___     __   __   ___  __       ___    __        __
       |  |__  \_/  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
       |  |___ / \  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
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
            if (is_defined(this.value_post_changed_function)) {
                this.value_post_changed_function(text);
            }
            this.text_changed = true;
            this.refresh();
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

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    this.state_change_look_at = function(being_looked_at) {
        if (being_looked_at) {
            this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
        } else {
            this.set_background_color(this.default_background_color, true);
        }
    };

    // TODO : Reformat engage / disengage logic.
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
        this.color_changed = true;
        this.refresh();
    };
}