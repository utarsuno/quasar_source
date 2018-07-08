'use strict';

$_QE.prototype.Interactive = function() {

    // Settings.
    this.needs_engage_for_parsing_input = true;
    this.maintain_engage_when_tabbed_to = true;
    this.engable                        = true;
    this.uses_cursor                    = true;

    this.only_used_for_blocking_input   = false;

    // Function events.
    this.engage_function    = null;
    this.disengage_function = null;
    this.look_at_function   = null;
    this.look_away_function = null;

    // States.
    this.being_looked_at    = false;
    this.being_engaged_with = false;

    // Next tab target.
    this.next_tab_target    = null;
    this.tab_parent         = null;

    this.is_interactive = false;

    this.set_to_interactive = function() {
        this.world.interactive_objects.push(this);
        this.is_interactive = true;
    };

    this.set_to_singleton = function() {
        Singleton.call(this);
    };

    this.look_away = function() {
        if (!this.only_used_for_blocking_input) {
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
        if (!this.only_used_for_blocking_input) {
            this.being_looked_at = true;
            this.state_change_look_at(true);
            if (is_defined(this.look_at_function)) {
                this.look_at_function();
            }
        }
    };

    this.disengage = function() {
        this.being_engaged_with = false;
        if (this.engable) {
            MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_DISENGAGE);
            this.state_change_engage(false);
        }
        if (is_defined(this.disengage_function)) {
            this.disengage_function();
        }
    };

    this.is_engaged = function() {
        return this.being_engaged_with;
    };

    this.engage = function() {
        if (this.engable) {
            this.being_engaged_with = true;
            MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_ENGAGE);
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

    this.set_next_tab_target = function(tab_target) {
        this.next_tab_target = tab_target;
    };

    this.set_value_pre_changed_function = function(value_pre_changed_function) {
        this.value_pre_changed_function = value_pre_changed_function;
    };

    this.set_value_post_changed_function = function(value_post_changed_function) {
        this.value_post_changed_function = value_post_changed_function;
    };

}
