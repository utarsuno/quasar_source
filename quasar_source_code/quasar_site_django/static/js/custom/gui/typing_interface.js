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

const MESSAGE_TYPE_SERVER = 2
const MESSAGE_TYPE_USER   = 1

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

        this.needs_another_update = false
        this.gui_logs.make_invisible()
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
        //this.gui_logs.show()
        //this.gui_logs.make_visible()
        this.visible = true
    },

    hide: function() {
        this.gui_typing.hide()
        //this.gui_logs.hide()
        //this.gui_logs.make_invisible()
        this.visible = false
        this.input_text.clear_text()
    },

    key_down_event: function(event) {
        this.input_text.parse_key_event(event)
        this.gui_typing_input.set_text(this.input_text.get_text())
    },

    window_was_resized: function() {
        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.current_height = window_height * 0.8

        var row_size = 12 + 2 // There is a margin of 3 and pixel size of 12.
        var number_of_rows_that_fit = this.current_height / row_size
        // - 1 is temporary
        this.last_row = Math.floor(number_of_rows_that_fit) - 1

        l('The last row is : ' + this.last_row)

        this.update()
    },

    get_normal_text_color: function(alpha) {
        return 'rgba(118, 255, 137, ' + alpha.toString() + ')'
    },

    get_server_text_color: function(alpha) {
        return 'rgba(255, 53, 36,' + alpha.toString() + ')'
    },

    needs_an_update: function() {
        return this.needs_another_update
    },

    update: function() {
        // TODO : This might be kinda slow..lol...
        var current_milliseconds = new Date().getTime()

        var needs_one_more_update = false

        var i = this.last_row
        var m = 0
        while (i > -1) {
            if (this.messages.length > m) {
                this.all_rows[i].set_text(this.messages[m][0])

                if (this.messages[m][1] === MESSAGE_TYPE_SERVER) {
                    this.all_rows[i].set_color(this.get_server_text_color(0.85))
                } else if (this.messages[m][1] === MESSAGE_TYPE_USER) {
                    this.all_rows[i].set_color(this.get_normal_text_color(0.85))
                }

            } else {
                this.all_rows[i].set_text('')
            }
            i -= 1
            m += 1
        }

        // Make sure to clear out all the other ones.
        var j = this.last_row + 1
        while (j < 70) {
            this.all_rows[j].set_text('')
            j += 1
        }

        this.needs_another_update = needs_one_more_update
    },

    add_message: function(text_message, text_color) {
        this.messages.unshift([text_message, text_color])
        this.update()
    },

    add_user_text: function() {
        var current_input = this.input_text.get_text()
        if (current_input.length > 0) {
            this.add_message(this.input_text.get_text(), MESSAGE_TYPE_USER)
        }
    },

    add_server_message: function(server_message) {
        this.add_message(server_message, MESSAGE_TYPE_SERVER)
    }
}

/*
        var current_milliseconds = new Date().getTime()

        for (var i = this.key_down_buffer.length; i--;) {
            if (current_milliseconds - this.key_down_buffer[i] >= 300) {
                this.key_down_buffer.splice(i, 1)
            }
        }

        this.key_down_buffer.push(current_milliseconds)
 */