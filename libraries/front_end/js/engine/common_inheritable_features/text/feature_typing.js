'use strict';

$_QE.prototype.FeatureTyping = function(text, on_value_pre_changed, on_value_post_changed) {

    this.feature_typing = true;

    $_QE.prototype.FeatureText.call(this, text, on_value_pre_changed, on_value_post_changed);

    this.parse_key_event = function(event) {
        let key_code = event.keyCode;

        let old_text = this.text;

        if (key_code === KEY_CODE__DELETE) {
            this.pop_character();
            //if (this.text.length > 0) {
            //    this.text = this.text.slice(0, -1);
            //MANAGER_AUDIO.play_typing_sound();
            //}
        } else if (event.key.length === 1) {
            //this.text += event.key;
            this.add_character(event.key);
            //MANAGER_AUDIO.play_typing_sound();
        }

        // TODO: REFACTOR
        if (key_code === KEY_CODE__ENTER) {
            if (is_defined(this.on_enter_key_event)) {
                this.on_enter_key_event();
            }
        }

        // TODO : play the typing sound? (MANAGER_AUDIO.play_typing_sound()
    };
};