'use strict';

$_QE.prototype.FeatureInteractive = function() {

    // TODO: set cursor icon needed

    this.set_flag(EFLAG_OUTLINE_GLOW, true);
    this.set_flag(EFLAG_INTERACTIVE , true);
    this.set_flag(EFLAG_ENGABLE     , true);
    this.set_flag(EFLAG_CLICKABLE   , true);
    this.set_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK, false);

    this.on_set_to_interactive = function() {
        if (this.get_flag(EFLAG_INTERACTIVE)) {
            if (this.mesh != null) {
                this.mesh.userData[USER_DATA_KEY_PARENT_OBJECT] = this;
            }
        }
    };

    this.needs_to_be_added_to_interactive_list = function() {
        return this.are_flags_on_and_off_respectively(EFLAG_INTERACTIVE, EFLAG_IN_ELEMENTS_INTERACTIVE);
    };

    this.check_if_in_interactive = function() {
        if (this.needs_to_be_added_to_interactive_list()) {
            if (this.world == null && (this.attachment_parent == null || this.attachment_parent.world == null)) {
                return;
            } else {
                if (this.world != null) {
                    this.world.add_element_interactive(this);
                } else {
                    this.attachment_parent.world.add_element_interactive(this);
                }
            }
            this.on_set_to_interactive();
        }

        /*
        // Add to interactive list if not done so already.
        if (this.get_flag(EFLAG_INTERACTIVE) && !this.has_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            if (this.is_root_attachment()) {
                this.world.add_element_interactive(this);
            } else {
                l(this.world);
                l('???');
                l(this.parent);
                l(this.attachment_parent);
                l(this);
                this.parent.world.add_element_interactive(this);
            }
            this.set_user_data();
        }
        */
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

    //this.trigger_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE);

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

};
