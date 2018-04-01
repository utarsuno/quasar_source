'use strict';

function FloatingInput2D(world, width, height, text) {
    this.__init__(world, width, height, text);
}

FloatingInput2D.prototype = {

    __init__: function(world, width, height, text) {
        // Inherit.
        Text2D.call(this, world, width, height, text);
        this.set_to_interactive();

        this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;

        this.initialize();

        this.needs_mobile_keyboard = true;
        this.has_input_state = false;
    },

    add_input_state: function() {
        if (!this.has_input_state) {
            InputState.call(this);
            this.has_input_state = true;
        }
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            //this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
            MANAGER_RENDERER.outline_glow.set_hover_object(this.object3D);
        } else {
            //this.set_background_color(this.default_background_color, true);
            MANAGER_RENDERER.outline_glow.remove_hover_object(this.object3D);
        }
    },

    // TODO : Reformat engage / disengage logic.
    state_change_engage: function(being_engaged_with) {
        if (being_engaged_with) {
            CURRENT_PLAYER.set_state(PLAYER_STATE_ENGAGED);
            MANAGER_RENDERER.outline_glow.set_to_engage_color();
        } else {
            MANAGER_RENDERER.outline_glow.set_to_hover_color();
        }
        //this.color_changed = true;
        //this.refresh();
    }

};