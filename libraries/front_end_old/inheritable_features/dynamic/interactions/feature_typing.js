$_QE.prototype.FeatureTyping = function(on_enter=null) {

    this.callback_on_enter = on_enter;

    // For elements.
    if (this.flag_is_off != null) {
        if (this.flag_is_off(EFLAG_IS_INTERACTIVE)) {
            $_QE.prototype.FeatureInteractive.call(this);
        }
        this.flag_set_on(EFLAG_IS_TYPEABLE, true);
    }

    // TODO: HANDLE REMOVING THIS!
    //$_QE.prototype.FeatureText.call(this, text, on_value_pre_changed, on_value_post_changed);

    this.parse_key_event = function(event) {
        let key_code = event.keyCode;

        if (key_code === KEY_CODE__DELETE) {
            this.pop_character();
            //MANAGER_AUDIO.play_typing_sound();
        } else if (key_code === KEY_CODE__ENTER) {
            if (this.callback_on_enter != null) {
                this.callback_on_enter();
            }
        } else if (event.key.length === 1) {
            this.add_character(event.key);
            //MANAGER_AUDIO.play_typing_sound();
        } else {
            //l('FAILED TO PARSE KEY EVENT: INVESTIGATE');
            //l(event);
        }
    };
};

