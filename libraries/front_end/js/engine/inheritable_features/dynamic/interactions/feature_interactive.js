'use strict';

$_QE.prototype.FeatureInteractive = function() {
    // TODO: set cursor icon needed

    //this.trigger_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE);

    this.flag_set_on(EFLAG_IS_OUTLINE_GLOWABLE);
    this.flag_set_on(EFLAG_IS_ENGABLE);
    this.flag_set_on(EFLAG_IS_CLICKABLE);
    this.flag_set_off(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING);
    this.flag_set_on(EFLAG_IS_INTERACTIVE);
    /*
    if (this.flag_is_off(EFLAG_IS_INTERACTIVE)) {
        this.flag_set_on(EFLAG_IS_INTERACTIVE);
        this.trigger_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE);
    } else {
        this.flag_set_on(EFLAG_IS_INTERACTIVE);
    }
    */

    this.check_if_in_interactive = function() {
        if (this.flags_are_on_and_off(EFLAG_IS_INTERACTIVE, EFLAG_IS_IN_ELEMENTS_INTERACTIVE)) {
            if (this.world == null && (this.attachment_parent == null || this.attachment_parent.world == null)) {
                return;
            } else {
                this.attachment_parent.world.add_element_interactive(this);
            }
        }
    };

    let self = this;

    this.set_event(ELEMENT_EVENT_ON_SET_TO_BUTTON, function() {
        self.check_if_in_interactive.bind(self)();
    });

    this.set_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE, function() {
        self.check_if_in_interactive.bind(self)();
    });

    this.set_event(ELEMENT_EVENT_ON_SET_TO_ATTACHMENT, function() {
        self.check_if_in_interactive.bind(self)();
    });

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

};
