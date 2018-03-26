'use strict';

function FloatingText(text, type, is_2D_text) {

    /*__   __        __   __      __   __   ___  __       ___    __        __
     /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.temporary_color = null;

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

    this.text_changed = false;
    this.color_changed = false;

    this.set_default_background_color(COLOR_TRANSPARENT, false);
    this.set_background_color(COLOR_TRANSPARENT, false);

    this.format_type = null;

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
            this.set_default_background_color(COLOR_SEMI_TRANSPARENT, false);
            this.set_background_color(COLOR_SEMI_TRANSPARENT, false);
            this.world.interactive_objects.push(this);
        }

        if(!is_defined(this.current_color)) {
            switch (this.type) {
            case TYPE_BUTTON:
            case TYPE_CHECK_BOX:
                this.set_default_color(COLOR_TEXT_BUTTON);
                this.set_color(COLOR_TEXT_BUTTON, true);
                break;
            case TYPE_CONSTANT:
                this.set_default_color(COLOR_TEXT_CONSTANT);
                this.set_color(COLOR_TEXT_CONSTANT, true);
                break;
            case TYPE_TITLE:
                this.set_default_color(COLOR_TEXT_DEFAULT);
                this.set_color(COLOR_TEXT_DEFAULT, true);
                break;
            default:
                this.set_default_color(COLOR_TEXT_DEFAULT);
                this.set_color(COLOR_TEXT_DEFAULT, true);
                break;
            }
        }
        // TODO : Remove or refactor this.
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
            this.text_changed = false;
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
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_type = function(type) {
        // If the previous type was input and the new type password then transfer any needed text.
        if (this.type === TYPE_INPUT && type === TYPE_PASSWORD) {
            if (is_defined(this.text)) {
                this.hidden_text = this.text;
            } else {
                this.hidden_text = '';
            }
        }
        this.type = type;
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_type = function() {
        return this.type;
    };

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
            MANAGER_RENDERER.outline_glow.set_hover_object(this.object3D);
        } else {
            this.set_background_color(this.default_background_color, true);
            MANAGER_RENDERER.outline_glow.remove_hover_object(this.object3D);
        }
    };

    // TODO : Reformat engage / disengage logic.
    this.state_change_engage = function(being_engaged_with) {
        if (being_engaged_with) {
            if (this.type !== TYPE_BUTTON && this.type !== TYPE_CHECK_BOX) {
                CURRENT_PLAYER.set_state(PLAYER_STATE_ENGAGED);
                MANAGER_RENDERER.outline_glow.set_to_engage_color();
            }
        } else {
            MANAGER_RENDERER.outline_glow.set_to_hover_color();
        }
        this.color_changed = true;
        this.refresh();
    };
}