'use strict'

function TypingInterface() {
    this.__init__()
}

TypingInterface.prototype = {

    __init__: function() {
        this.gui_typing       = new DomElement('gui_typing')
        this.gui_typing_input = new DomElement('gui_typing_input_field')
        this.gui_logs         = new DomElement('gui_console_logs')

        this.visible = false
    },

    is_visible: function() {
        return this.visible
    },

    toggle_visibility: function() {
        this.visible = !this.visible
        if (this.visible) {
            this.show()
        } else {
            this.hide()
        }
    },

    show: function() {
        this.gui_typing.show()
        this.gui_logs.show()

        // TODO : engage the player
        //this.player.engage()
    },

    hide: function() {
        this.gui_typing.hide()
        this.gui_logs.hide()
    },

    key_down_event: function(event) {
        // event.keyCode

        this.gui_typing_input.parse_key_event(event)

        // TODO : Eventually utilize the InputTextProcessor class



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
    }
}