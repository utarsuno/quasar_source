'use strict';

/*
const FLOATING_TEXT_BACKGROUND_DEFAULT = 'rgba(20, 20, 20, .25)';
const FLOATING_TEXT_BACKGROUND_ERROR = 'rgba(57, 0, 6, .25)';
const FLOATING_TEXT_BACKGROUND_SUCESS = 'rgba(30, 63, 30, .25)';
 */

function FloatingInput2D(world, width, text_height, text) {
    this.__init__(world, width, text_height, text);
}

FloatingInput2D.prototype = {

    __init__: function(world, width, text_height, text) {
        // Inherit.
        Text2D.call(this, world, width, text_height, text);

        //this.set_default_background_color(COLOR_SEMI_TRANSPARENT, false);
        //this.set_default_foreground_color(COLOR_TEXT_DEFAULT, false);

        //this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;

        this.world.interactive_objects.push(this);

        this.initialize();
        //this.create_base_dynamic_texture();
        //this.create_base_mesh();
    },

    add_label_left: function(text) {
        var label = new FloatingText2D(this.world, this.height, text);
        this.add_floating_element([-label.width, -HALF], null, 0, label);
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