'use strict';

$_QE.prototype.FeatureInteractive = function() {

    $_QE.prototype.FeatureCursor.call(this);

    this._in_world_elements_interactive = false;

    // Settings.
    this.feature_needs_engage_for_parsing_input = true;
    this.feature_maintain_engage_when_tabbed_to = true;
    this.feature_engable                        = true;
    this.feature_only_used_for_blocking_input   = false;

    // States.
    this.being_looked_at    = false;
    this.being_engaged_with = false;

    // Function events.
    this.engage_function    = null;
    this.disengage_function = null;
    this.look_at_function   = null;
    this.look_away_function = null;

    //this.feature_interactive = true;

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.look_away = function() {
        if (!this.feature_only_used_for_blocking_input) {
            this.being_looked_at = false;
            this.state_change_look_at(false);
            if (is_defined(this.look_away_function)) {
                this.look_away_function();
            }
        }
        if (this.being_engaged_with) {
            this.being_engaged_with = false;
        }
    };

    this.look_at = function() {
        if (!this.feature_only_used_for_blocking_input) {
            this.being_looked_at = true;
            this.state_change_look_at(true);
            if (is_defined(this.look_at_function)) {
                this.look_at_function();
            }
        }
    };

    this.disengage = function() {
        this.being_engaged_with = false;
        if (this.feature_engable) {
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_DISENGAGE);
            this.state_change_engage(false);
        }
        if (is_defined(this.disengage_function)) {
            this.disengage_function();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.engage = function() {
        if (this.feature_engable) {
            this.being_engaged_with = true;
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_ENGAGE);
            this.state_change_engage(true);
        }
        if (is_defined(this.engage_function)) {
            this.engage_function();
        }
    };

    this.set_engage_function = function(engage_function) {
        this.engage_function = engage_function;
    };

    this.set_disengage_function = function(disengage_function) {
        this.disengage_function = disengage_function;
    };

    this.set_look_at_function = function(look_at_function) {
        this.look_at_function = look_at_function;
    };

    this.set_look_away_function = function(look_away_function) {
        this.look_away_function = look_away_function;
    };

    this.set_value_pre_changed_function = function(value_pre_changed_function) {
        this.value_pre_changed_function = value_pre_changed_function;
    };

    this.set_value_post_changed_function = function(value_post_changed_function) {
        this.value_post_changed_function = value_post_changed_function;
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.is_engaged = function() {
        return this.being_engaged_with;
    };

};