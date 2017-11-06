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
    },

    hide: function() {
        this.gui_typing.hide()
        this.gui_logs.hide()
    }
}