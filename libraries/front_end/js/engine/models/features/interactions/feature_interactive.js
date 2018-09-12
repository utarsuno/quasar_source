'use strict';

$_QE.prototype.FeatureInteractive = function(outline_glow, on_look_at, on_look_away, on_engage, on_disengage) {

    $_QE.prototype.FeatureCursor.call(this);

    this._in_world_elements_interactive = false;

    // Settings.
    this.feature_needs_engage_for_parsing_input = true;
    this.feature_maintain_engage_when_tabbed_to = true;
    this.feature_engable                        = true;
    this.feature_engable_only_from_double_click = false;

    this.feature_outline_glow                   = outline_glow;

    // States.
    this.being_engaged_with = false;

    // Function events.
    this.on_look_at   = on_look_at;
    this.on_look_away = on_look_away;
    this.on_engage    = on_engage;
    this.on_disengage = on_disengage;

    //this.feature_interactive = true;

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
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