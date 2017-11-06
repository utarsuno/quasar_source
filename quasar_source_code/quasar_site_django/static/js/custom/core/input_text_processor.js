'use strict'

// TODO : This entire file

function InputTextProcessor() {
    this.__init__()
}

InputTextProcessor.prototype = {

    current_text: null,

    __init__: function() {
        this.current_text = ''
        this.cursor_position = '0'
    },

    parse_key_event: function(event) {
        var key_code = event.keyCode

        if (key_code === KEY_CODE_DELETE) {
            if (this.current_text.length > 0) {

            }
        }
    }
}

        /*
        var keycode = event.keyCode

        if (keycode == KEY_CODE_DELETE) {
            if (this.text.length > 0) {
                this.pop_character()
                if (this.type == TYPE_INPUT_PASSWORD) {
                    this._hidden_text = this._hidden_text.slice(0, -1)
                }
            }

            MANAGER_AUDIO.play_typing_sound()

        } else if (event.key.length == 1) {
            if (this.type == TYPE_INPUT_PASSWORD) {
                this._hidden_text += event.key
                this.add_character('*')
            } else if (this.type == TYPE_INPUT_REGULAR) {
                this.add_character(event.key)
            }

            MANAGER_AUDIO.play_typing_sound()
        }

         */