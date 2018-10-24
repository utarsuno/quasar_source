'use strict';

$_QE.prototype.FeatureButton = function(engage_function) {

    this._original_engage_function = engage_function;

    if (!this.has_flag(EFLAG_INTERACTIVE)) {
        $_QE.prototype.FeatureInteractive.call(this);
    }

    this.set_event(ELEMENT_EVENT_ON_ENGAGE, engage_function);

    this.set_flag(EFLAG_ENGABLE, false);
    this.trigger_event(ELEMENT_EVENT_ON_SET_TO_BUTTON);

    this.use_confirmation_prompt = function() {
        this.confirmation = new $_QE.prototype.ConfirmationPrompt(this);
        this.clear_event(ELEMENT_EVENT_ON_ENGAGE);
        let self = this;
        this.set_event(ELEMENT_EVENT_ON_ENGAGE, function() {
            return self.confirmation._event_function();
        });
    };
};
