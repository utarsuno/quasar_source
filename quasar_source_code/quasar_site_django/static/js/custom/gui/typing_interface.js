'use strict'

function TypingInterface() {
    this.__init__()
}

TypingInterface.prototype = {


    __init__: function() {
        this.gui_typing = new DomElement('gui_typing_input_field')
        this.gui_logs   = new DomElement('gui_console_logs')
    }
}