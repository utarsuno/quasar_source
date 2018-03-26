'use strict';

function FloatingText(text, type, is_2D_text) {

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