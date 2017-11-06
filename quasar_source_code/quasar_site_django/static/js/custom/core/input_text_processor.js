'use strict'

// TODO : This entire file

function InputTextProcessor(current_text) {
    this.__init__(current_text)
}

const CURSOR_COLOR = '#a92200'
// TODO : Implement cursor at a later time.

InputTextProcessor.prototype = {

    current_text: null,

    __init__: function(current_text) {
        this.current_text = current_text
        //this.cursor_position = this.current_text.length + 1
    },

    parse_key_event: function(event) {
        var key_code = event.keyCode

        if (key_code === KEY_CODE_DELETE) {
            if (this.current_text.length > 0) {
                this.current_text = this.current_text.slice(0, -1)
            }
        } else if (event.key.length === 1) {
            this.current_text += event.key
        }

        // TODO : play the typing sound? (MANAGER_AUDIO.play_typing_sound()
    },

    clear_text: function() {
        this.current_text = ''
    },

    get_text: function() {
        //var strings_and_their_colors = []
        return this.current_text
    }
}

