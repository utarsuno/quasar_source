'use strict';

Object.assign($_QE.prototype.World.prototype, {

    currently_looked_at_object: null,

    is_current_object_set_and_engaged: function() {
        if (this.currently_looked_at_object == null) {
            return false;
        } else {
            return this.currently_looked_at_object.get_flag(EFLAG_ENGAGED);
        }
    },

    disengage_from_currently_looked_at_object: function() {
        //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_DISENGAGE);
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_DISENGAGE);

        if (this.currently_looked_at_object.get_flag(EFLAG_OUTLINE_GLOW)) {
            QE.manager_renderer.outline_glow.set_to_hover_color();
        }
        this.currently_looked_at_object.set_flag(EFLAG_ENGAGED, false);
        if (this.player.is_engaged()) {
            this.player.set_state(PLAYER_STATE_FULL_CONTROL);
        }
    },

    engage_currently_looked_at_object: function() {
        if (this.currently_looked_at_object.get_flag(EFLAG_ENGABLE)) {
            QE.player.set_state(PLAYER_STATE_ENGAGED);
            if (this.currently_looked_at_object.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.manager_renderer.outline_glow.set_to_engage_color();
            }
            this.currently_looked_at_object.set_flag(EFLAG_ENGAGED, true);
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_ENGAGE);
        }
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_ENGAGE);
    },

    look_at_different_element: function(element) {
        if (this.currently_looked_at_object != null) {
            if (this.currently_looked_at_object.get_flag(EFLAG_ENGAGED)) {
                this.disengage_from_currently_looked_at_object();
            }
            this.look_away_from_currently_looked_at_object();
        }
        this.player.look_at(element.get_world_position());
        this.set_new_currently_looked_at_object(element);
    },

    set_new_currently_looked_at_object: function(element, position) {
        if (element == null) {
            QE.fatal_error('ELEMENT IS NULL!');
        }

        /*
        if (this.feature_interactive) {
            this.mesh.userData[USER_DATA_KEY_PARENT_OBJECT] = this;
        }
         */

        this.currently_looked_at_object = element;
        this.currently_looked_at_object.mesh.userData[IS_CURRENTLY_LOOKED_AT] = true;
        //this.currently_looked_at_object = element.userData[USER_DATA_KEY_PARENT_OBJECT];

        if (this.currently_looked_at_object.get_flag(EFLAG_OUTLINE_GLOW)) {
            if (this.currently_looked_at_object.group != null) {
                QE.manager_renderer.outline_glow.set_hover_object(this.currently_looked_at_object.group);
            } else {
                QE.manager_renderer.outline_glow.set_hover_object(this.currently_looked_at_object.mesh);
            }
        }
        if (this.currently_looked_at_object.has_flag(EFLAG_INTERACTIVE)) {
            this.previous_tab_target = element;
        }
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_LOOK_AT);
        QE.manager_world.player_cursor.attach(this.currently_looked_at_object, position);
    },

    look_away_from_currently_looked_at_object: function() {
        this.currently_looked_at_object.mesh.userData[IS_CURRENTLY_LOOKED_AT] = false;

        if (this.currently_looked_at_object.get_flag(EFLAG_OUTLINE_GLOW)) {
            if (this.currently_looked_at_object.group != null) {
                QE.manager_renderer.outline_glow.remove_hover_object(this.currently_looked_at_object.group);
            } else {
                QE.manager_renderer.outline_glow.remove_hover_object(this.currently_looked_at_object.mesh);
            }
        }
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_LOOK_AWAY);
        if (this.currently_looked_at_object.get_flag(EFLAG_ENGAGED)) {
            this.disengage_from_currently_looked_at_object();
        }
        if (QE.manager_world.player_cursor.currently_attached_to != null) {
            QE.manager_world.player_cursor.detach();
        }
        if (QE.manager_input.disable_mouse_y) {
            QE.manager_input.disable_mouse_y = false;
        }
        this.currently_looked_at_object = null;
    },
});

