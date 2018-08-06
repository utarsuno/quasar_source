'use strict';

$_QE.prototype.FeatureTyping = function(text) {

    this.feature_needs_mobile_keyboard = true;

    $_QE.prototype.FeatureText.call(this, text);

    this.on_paste_event = function(text) {
        this.text += text;
        this.update_needed_for_text = true;
    };

    this.parse_key_event = function(event) {
        let key_code = event.keyCode;

        let old_text = this.text;

        if (key_code === KEY_CODE__DELETE) {
            if (this.text.length > 0) {
                this.text = this.text.slice(0, -1);
                //MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            this.text += event.key;
            //MANAGER_AUDIO.play_typing_sound();
        }

        if (key_code === KEY_CODE__ENTER) {
            if (is_defined(this.on_enter_key_event)) {
                this.on_enter_key_event();
            }
        }

        if (old_text !== this.text) {
            this.update_needed_for_text = true;
            if (is_defined(this.refresh)) {
                this.refresh();
            }
        }

        // TODO : play the typing sound? (MANAGER_AUDIO.play_typing_sound()
    };

    this.get_text_and_clear = function() {
        let t = this.text;
        this.clear();
        return t;
    };
};