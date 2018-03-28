'use strict';

function FloatingInput2D(world, width, text_height, text) {
    this.__init__(world, width, text_height, text);
}

FloatingInput2D.prototype = {

    __init__: function(world, width, text_height, text) {
        // Inherit.
        Text2D.call(this, world, width, text_height, text);

        this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;

        this.world.interactive_objects.push(this);

        this.initialize();
    },

    add_label_left: function(text) {
        var label = new FloatingText2D(this.world, this.height, text);
        this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
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