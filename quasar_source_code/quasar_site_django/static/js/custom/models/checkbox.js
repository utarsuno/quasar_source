'use strict'

function CheckBox(initial_state, scene) {
    this.__init__(initial_state, scene)
}

CheckBox.prototype = {

    width: null,
    height: null,

    scene           : null,

    floating_2d_text: null,

    checked         : null,

    __init__: function(initial_state, scene) {
        this.scene   = scene
        this.checked = initial_state
        if (this.checked) {
            this.text = 'X'
        } else {
            this.text = ''
        }
        this.width = 16
        this.height = 16
        this.floating_2d_text = new Floating2DText(16, this.text, TYPE_CHECK_BOX, this.scene)
    },

    update_position_and_look_at: function(position, look_at) {
        this.floating_2d_text.update_position_and_look_at(position, look_at)
    },

    toggle: function() {
        this.checked = !this.checked
        if (this.checked) {
            this.floating_2d_text.update_text('X')
        } else {
            this.floating_2d_text.update_text(' ')
        }
    },

    status: function() {
        this.checked = this.floating_2d_text.get_text() === 'X'
        return this.checked
    },

    set_to_invisible: function() {
        this.floating_2d_text.set_to_invisible()
    },

    set_to_visible: function() {
        this.floating_2d_text.set_to_visible()
    },

    toggle_visibility: function() {
        this.floating_2d_text.toggle_visibility()
    }

}