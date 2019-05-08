'use strict';

Object.assign($_QE.prototype.World.prototype, {

    // ------------------------------------------------------------------------------
    create_element: function(element) {
        element.world = this;
        element.create();
        element.flag_set_on(EFLAG_IS_CREATED);
    },

    // ------------------------------------------------------------------------------

    is_current_object_set_and_engaged: function() {
        if (this.currently_looked_at_object == null) {
            return false;
        } else {
            return this.currently_looked_at_object.flag_is_on(EFLAG_IS_ENGAGED);
        }
    },

    disengage_from_currently_looked_at_object: function() {
        //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_DISENGAGE);
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_DISENGAGE);
        this.currently_looked_at_object.set_to_disengaged();
        if (this.player.is_engaged()) {
            this.player.set_state(PLAYER_STATE_FULL_CONTROL);
        }
    },

    engage_currently_looked_at_object: function() {
        if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_ENGABLE)) {
            QE.player.set_state(PLAYER_STATE_ENGAGED);
            this.currently_looked_at_object.set_to_engaged();
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_ENGAGE);
        }
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_ENGAGE);
    },

    look_at_different_element: function(element) {
        if (this.currently_looked_at_object != null) {
            if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_ENGAGED)) {
                this.disengage_from_currently_looked_at_object();
            }
            this.look_away_from_currently_looked_at_object();
        }
        this.player.look_at(element.get_world_position());
        this.set_new_currently_looked_at_object(element);
    },

    set_new_currently_looked_at_object: function(element, position) {
        this.currently_looked_at_object = element;
        if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_INTERACTIVE)) {
            this.previous_tab_target = element;
        }
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_LOOK_AT);
        this.engine.manager_world.event_trigger_element_looked_at(this.currently_looked_at_object, position);
    },

    look_away_from_currently_looked_at_object: function() {
        this.currently_looked_at_object.trigger_event(ELEMENT_EVENT_ON_LOOK_AWAY);
        if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_ENGAGED)) {
            this.disengage_from_currently_looked_at_object();
        }
        this.engine.manager_world.event_trigger_element_looked_away_from(this.currently_looked_at_object);
        this.currently_looked_at_object = null;
    },
});
