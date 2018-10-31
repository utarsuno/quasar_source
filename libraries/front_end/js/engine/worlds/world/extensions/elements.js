'use strict';

Object.assign($_QE.prototype.World.prototype, {

    // ------------------------------------------------------------------------------
    create_element: function(element) {
        element.world = this;
        element.create();
        element.set_flag(EFLAG_CREATED, true);
    },

    // ------------------------------------------------------------------------------

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
        this.currently_looked_at_object.set_to_disengaged();
        if (this.player.is_engaged()) {
            this.player.set_state(PLAYER_STATE_FULL_CONTROL);
        }
        // TODO: play disengage sound
    },

    engage_currently_looked_at_object: function() {
        if (this.currently_looked_at_object.get_flag(EFLAG_ENGABLE)) {
            QE.player.set_state(PLAYER_STATE_ENGAGED);
            this.currently_looked_at_object.set_to_engaged();
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
        this.currently_looked_at_object = element;
        element.set_to_looked_at();
        if (this.currently_looked_at_object.has_flag(EFLAG_INTERACTIVE)) {
            this.previous_tab_target = element;
        }
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_LOOK_AT);
        QE.manager_world.player_cursor.attach(this.currently_looked_at_object, position);
    },

    look_away_from_currently_looked_at_object: function() {
        this.currently_looked_at_object.set_to_looked_away();
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_LOOK_AWAY);
        if (this.currently_looked_at_object.get_flag(EFLAG_ENGAGED)) {
            this.disengage_from_currently_looked_at_object();
        }
        if (QE.manager_world.player_cursor.attached_to != null) {
            QE.manager_world.player_cursor.detach();
        }
        if (QE.get_flag(ENGINE_STATE_MOUSE_Y_DISABLED)) {
            QE.set_flag_off(ENGINE_STATE_MOUSE_Y_DISABLED);
        }
        this.currently_looked_at_object = null;
    },
});

