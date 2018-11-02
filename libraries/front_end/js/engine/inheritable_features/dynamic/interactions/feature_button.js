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
            self.confirmation._event_function();
        });
    };

    this._no_response = function() {
        l('no response!');
    };

    this._yes_response = function() {
        l('yes response!');
    };
};


/*
$_QE.prototype.FeatureButtonState = function() {

    this._enabled = true;
    this._locked  = false;

    this._icon = new $_QE.prototype.FloatingIcon(this.world, ASSET_ICON_CROSS, 32, QE.COLOR_RED, true);
    this._icon.offset_depth_distance = 1;
    this._icon.manual_visibility = true;
    this.add_attachment(this._icon);
    this._icon.set_to_invisible();

    this.disable = function() {
        this._enabled = false;
        this._icon.switch_icon(ASSET_ICON_DISABLED);
        this._icon.set_to_visible();
    };

    this.lock = function() {
        this._locked = true;
        this._icon.switch_icon(ASSET_ICON_LOCKED);
        this._icon.set_to_visible();
    };

    this.enable = function() {
        this._enabled = true;
        this._icon.set_to_invisible();
    };

    this.unlock = function() {
        this._locked = false;
        this._icon.set_to_invisible();
    };

    this.enabled = function() {
        return this._enabled && !this._locked;
    };

};

 */