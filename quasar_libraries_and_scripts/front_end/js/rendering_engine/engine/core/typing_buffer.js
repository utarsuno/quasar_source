'use strict';

$_QE.prototype.TypingBuffer = function(current_text) {
    this.current_text = current_text;

    // TODO: this.cursor_position = len(current_text);

    this.parse_key_event = function(event) {
        let key_code = event.keyCode;

        if (key_code === KEY_CODE__DELETE) {
            if (this.current_text.length > 0) {
                this.current_text = this.current_text.slice(0, -1);
            }
        } else if (event.key.length === 1) {
            this.current_text += event.key;
        }

        // TODO : play the typing sound? (MANAGER_AUDIO.play_typing_sound()
    };

    this.clear_text = function() {
        this.current_text = '';
    };

    this.get_text = function() {
        //var strings_and_their_colors = []
        return this.current_text;
    };
};
