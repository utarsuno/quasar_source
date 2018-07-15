'use strict';

$_QE.prototype.FeatureTyping = function() {

    this.feature_needs_mobile_keyboard = true;

    $_QE.prototype.FeatureText.call(this);

    this.on_paste_event = function(text) {
        this.text += text;
        this.update_needed_for_text = true;
    };

    this.parse_keycode = function(event) {
        let keycode = event.keyCode;

        if (keycode === KEY_CODE__DELETE) {
            if (this.get_text().length > 0) {
                this._pop_character();
                //MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            this._add_character(event.key);
            //MANAGER_AUDIO.play_typing_sound();
        }
    };

    this.parse_key_event = function(event) {
        let key_code = event.keyCode;

        let old_text = this.text;

        if (key_code === KEY_CODE__DELETE) {
            if (this.text.length > 0) {
                this.text = this.text.slice(0, -1);
            }
        } else if (event.key.length === 1) {
            this.text += event.key;
        }

        if (old_text !== this.text) {
            this.update_needed_for_text = true;
        }

        // TODO : play the typing sound? (MANAGER_AUDIO.play_typing_sound()
    };
};