'use strict';

$_QE.prototype.FeatureInteractive = function(on_look_at, on_look_away, on_engage, on_disengage, engable_only_from_double_click=false) {

    // TODO: set cursor icon needed

    this.set_flag(EFLAG_OUTLINE_GLOW, true);
    this.set_flag(EFLAG_INTERACTIVE, true);
    this.set_flag(EFLAG_ENGABLE, true);
    this.set_flag(EFLAG_CLICKABLE, true);
    this.set_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK, engable_only_from_double_click);

    // Function events.
    if (on_look_at != null) {
        this.set_event(ELEMENT_EVENT_ON_LOOK_AT, on_look_at);
    }
    if (on_look_away != null) {
        this.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, on_look_away);
    }
    if (on_engage != null) {
        this.set_event(ELEMENT_EVENT_ON_ENGAGE, on_engage);
    }
    if (on_disengage != null) {
        this.set_event(ELEMENT_EVENT_ON_DISENGAGE, on_disengage);
    }

    this.check_if_in_interactive = function() {
        // Add to interactive list if not done so already.
        if (this.get_flag(EFLAG_INTERACTIVE) && !this.has_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            if (this.is_root_attachment()) {
                this.world.add_element_interactive(this);
            } else {
                this.parent.world.add_element_interactive(this);
            }
            this.set_user_data();
        }
    };

    let self = this;

    this.set_event(ELEMENT_EVENT_ON_SET_TO_BUTTON, function() {
        // TODO: Refactor without '.bind(self)'
        self.check_if_in_interactive.bind(self)();
    });

    this.set_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE, function() {
        // TODO: Refactor without '.bind(self)'
        self.check_if_in_interactive.bind(self)();
    });

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

};
