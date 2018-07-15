'use strict';

$_QE.prototype.FloatingInput3D = function(world, size, text) {

};

function FloatingInput3D(world, size, text) {
    this.__init__(world, size, text);
}

FloatingInput3D.prototype = {

    __init__: function(world, size, text) {
        // Inherit.
        Text3D.call(this, world, size, text);
        this.set_to_typeable();

        this.set_default_foreground_color(COLOR_TEXT_DEFAULT, false);

        // Create the Text3D.
        this.create_base_material();
        this.create_base_mesh();
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