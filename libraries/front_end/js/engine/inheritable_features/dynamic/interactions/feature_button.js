'use strict';


$_QE.prototype.FeatureButton = function(args) {
    if (this.flag_is_off(EFLAG_IS_INTERACTIVE)) {
        $_QE.prototype.FeatureInteractive.call(this);
    }
    this._button_on_event_action = args[ARG_EVENT_ACTION];
    this.flag_set_on(EFLAG_IS_BUTTON);
    this.flag_set_on(EFLAG_IS_BORDER_RENDERED);
    this.flag_set_off(EFLAG_IS_ENGABLE);

    let self = this;

    if (this._arg_is_on(args, ARG_USE_CONFIRMATION_PROMPT)) {
        this.flag_set_on(EFLAG_IS_CONFIRMATION_REQUIRED_FOR_BUTTON);
        this._confirmation = new $_QE.prototype.ConfirmationPrompt(this,
            function() {
                // No response.
            },
            function() {
                // Yes response.
                self._button_on_event_action();
            }
        );
    }

    this._button_action = function() {
        if (this.flag_is_off(EFLAG_IS_CONFIRMATION_REQUIRED_FOR_BUTTON)) {
            this._button_on_event_action();
        } else {
            this._confirmation.open();
        }
    };

    this.trigger_event(ELEMENT_EVENT_ON_SET_TO_BUTTON);
    this.set_event(ELEMENT_EVENT_ON_ENGAGE, this._button_action.bind(this));

    //this.set_event(ELEMENT_EVENT_ON_LOCKED   , function() {this._icon.switch_icon(ASSET_ICON_LOCKED);this._icon.set_to_visible();});
    //this.set_event(ELEMENT_EVENT_ON_UN_LOCKED, function() {this._icon.set_to_invisible();});
    //this.set_event(ELEMENT_EVENT_ON_ENABLE, function() {this._icon.set_to_invisible()});
    //this.set_event(ELEMENT_EVENT_ON_DISABLE, function() {this._icon.switch_icon(ASSET_ICON_DISABLED);this._icon.set_to_visible();});
};

/*
$_QE.prototype.FeatureButtonState = function() {
    this._icon = new $_QE.prototype.FloatingIcon(this.world, ASSET_ICON_CROSS, 32, QE.COLOR_RED, true);
    this._icon.offset_depth_distance = 1;
    this._icon.manual_visibility = true;
    this.add_attachment(this._icon);
    this._icon.set_to_invisible();
};
 */
