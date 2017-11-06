'use strict'

function TypingInterface() {
    this.__init__()
}

function Message(text, created_time) {
    this.__init__(text, created_time)
}

Message.prototype = {
    __init__: function(text, created_time) {
        this.text = text
        this.created_time = created_time
    }
}

TypingInterface.prototype = {

    __init__: function() {
        this.gui_typing       = new DomElement('gui_typing')
        this.gui_typing_input = new DomElement('gui_typing_input_field')
        this.gui_logs         = new DomElement('gui_console_logs')

        this.input_text = new InputTextProcessor('')

        this.visible = false

        this.all_rows = []
        var i = 0
        while (i < 70) {
            this.all_rows.push(new DomElement('row_' + i.toString()))
            i += 1
        }

        this.messages = []

        // Calculate the initial sizing.
        this.window_was_resized()
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
        this.visible = true
    },

    hide: function() {
        this.gui_typing.hide()
        this.gui_logs.hide()
        this.visible = false
        this.input_text.clear_text()
    },

    key_down_event: function(event) {
        this.input_text.parse_key_event(event)
        this.gui_typing_input.set_text(this.input_text.get_text())
    },

    window_was_resized: function() {
        this.current_height = this.gui_logs.element.clientHeight

        var row_size = 12 + 3 // There is a margin of 3 and pixel size of 12.
        var number_of_rows_that_fit = this.current_height / row_size
        this.last_row = Math.floor(number_of_rows_that_fit)

        l('The last row is : ' + this.last_row)

        this.update()
    },

    update: function() {
        // TODO : This might be kinda slow..lol...

        var i = this.last_row
        var m = 0
        while (i > -1) {
            if (this.messages.length > m) {
                //l('Currently looking at the message {' + this.message[m] + '}')
                if (this.messages[m].length > 0) {
                    this.all_rows[i].set_text(this.messages[m])
                } else {
                    this.all_rows[i].set_text('')
                }
            } else {
                this.all_rows[i].set_text('')
            }
            i -= 1
            m += 1
        }
    },

    add_message: function(message_text) {
        l('Adding this message : ' + message_text)
        this.messages.push(message_text)
        this.update()
    },

    add_user_text: function() {
        this.add_message(this.input_text.get_text())
    }
}