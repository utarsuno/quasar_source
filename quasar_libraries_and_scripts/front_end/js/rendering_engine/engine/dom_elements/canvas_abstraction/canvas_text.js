'use strict';

$_QE.prototype.CanvasText = function(font) {
    $_QE.prototype.CanvasFont.call(this, font);

    this.canvas_text = null;
    this.update_needed_for_text = false;

    this.set_text = function(t) {
        if (this.canvas_text !== t) {
            this.update_needed_for_text = true;
            this.canvas_text = t;
        }
    };

    this.clear = function() {
        l('CanvasText clear called!');
        this.set_text('');
    };

    this.parse_key_event = function(event) {
        let key_code = event.keyCode;

        let old_text = this.canvas_text;

        if (key_code === KEY_CODE__DELETE) {
            if (this.canvas_text.length > 0) {
                this.canvas_text = this.canvas_text.slice(0, -1);
            }
        } else if (event.key.length === 1) {
            this.canvas_text += event.key;
        }

        if (old_text !== this.canvas_text) {
            this.update_needed_for_text = true;
        }

        // TODO : play the typing sound? (MANAGER_AUDIO.play_typing_sound()
    };
};