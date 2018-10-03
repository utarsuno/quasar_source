'use strict';

$_QE.prototype.FeatureButton = function(engage_function) {
    $_QE.prototype.FeatureInteractive.call(this, null, null, engage_function);
    this.set_flag(EFLAG_ENGABLE, false);
    this.trigger_event(ELEMENT_EVENT_ON_SET_TO_BUTTON);
};
