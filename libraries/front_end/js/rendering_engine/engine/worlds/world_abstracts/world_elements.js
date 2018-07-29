'use strict';

$_QE.prototype.WorldElements = function() {

    this.currently_looked_at_object = null;

    this.is_current_object_set_and_engaged = function() {
        if (this.currently_looked_at_object === null) {
            return false;
        } else {
            return this.currently_looked_at_object.being_engaged_with;
        }
    };

    this.disengage_from_currently_looked_at_object = function() {
        //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_DISENGAGE);
        if (is_defined(this.currently_looked_at_object.on_disengage)) {
            this.currently_looked_at_object.on_disengage();
        }
        if (this.currently_looked_at_object.feature_outline_glow) {
            QE.manager_renderer.outline_glow.set_to_hover_color();
        }
        this.currently_looked_at_object.being_engaged_with = false;
        if (this.player.is_engaged()) {
            this.player.set_state(PLAYER_STATE_FULL_CONTROL);
        }
    };

    this.engage_currently_looked_at_object = function() {
        if (this.currently_looked_at_object.feature_engable) {
            QE.player.set_state(PLAYER_STATE_ENGAGED);
            if (this.currently_looked_at_object.feature_outline_glow) {
                QE.manager_renderer.outline_glow.set_to_engage_color();
            }
            this.currently_looked_at_object.being_engaged_with = true;
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_ENGAGE);
        }
        if (is_defined(this.currently_looked_at_object.on_engage)) {
            this.currently_looked_at_object.on_engage();
        }
    };

    this.set_new_currently_looked_at_object = function(element, position) {
        if (!is_defined(element)) {
            raise_exception('ELEMENT IS NULL');
        }
        this.currently_looked_at_object = element;
        if (this.currently_looked_at_object.feature_outline_glow) {
            QE.manager_renderer.outline_glow.set_hover_object(this.currently_looked_at_object.object3D);
        }
        if (is_defined(this.currently_looked_at_object.on_look_at)) {
            this.currently_looked_at_object.on_look_at();
        }
        if (is_defined(this.currently_looked_at_object.tab_parent)) {
            this.manager_world.current_world.set_default_tab_target(this.currently_looked_at_object.tab_parent);
        }
        //this.player.look_at(this.currently_looked_at_object.object3D.position);
        QE.manager_world.player_cursor.attach(this.currently_looked_at_object, position);
    };

    this.look_away_from_currently_looked_at_object = function() {
        if (this.currently_looked_at_object.feature_outline_glow) {
            QE.manager_renderer.outline_glow.remove_hover_object(this.currently_looked_at_object.object3D);
        }
        if (is_defined(this.currently_looked_at_object.on_look_away)) {
            this.currently_looked_at_object.on_look_away();
        }
        if (this.currently_looked_at_object.being_engaged_with) {
            this.disengage_from_currently_looked_at_object();
        }
        if (QE.manager_world.player_cursor.currently_attached_to !== null) {
            QE.manager_world.player_cursor.detach();
        }
        if (QE.manager_input.disable_mouse_y) {
            QE.manager_input.disable_mouse_y = false;
        }
        this.currently_looked_at_object = null;
    };
};