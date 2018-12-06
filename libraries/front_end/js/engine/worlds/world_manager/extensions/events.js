'use strict';

Object.assign($_QE.prototype.WorldManager.prototype, {

    event_trigger_on_pause: function() {
        if (this.player_cursor.is_in_action()) {
            this.player_cursor.finish_action();
        }
        if (this.manager_world != null && this.manager_world.current_world != null) {
            this.manager_world.current_world.css_on_pause_state();
        }
    },

    event_trigger_element_looked_at: function(element, position) {
        this.player_cursor.attach(element, position);
    },

    event_trigger_element_looked_away_from: function(element) {
        if (this.player_cursor.attached_to === element) {
            this.player_cursor.set_state(CURSOR_STATE_DEFAULT);
        }
    },

});
