'use strict'

function TypingInterface() {
    this.__init__()
}

TypingInterface.prototype = {

    __init__: function() {
        this.gui_typing       = new DomElement('gui_typing')
        this.gui_typing_input = new DomElement('gui_typing_input_field')
        this.gui_logs         = new DomElement('gui_console_logs')

        this.input_text = new InputTextProcessor('')

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
        l('THE HEIGHT OF THE CONSOLE LOGS IS : ')
        l(this.gui_logs.element.height())
    }
}