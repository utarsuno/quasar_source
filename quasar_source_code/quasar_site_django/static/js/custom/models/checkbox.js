'use strict'

function CheckBox(side_length, initial_state, scene) {
    this.__init__(side_length, initial_state, scene)
}

CheckBox.prototype = {

    scene           : null,

    floating_2d_text: null,

    checked         : null,
    text            : null,

    __init__: function(side_length, initial_state, scene) {
        this.scene   = scene
        this.checked = scene
        if (this.checked) {
            this.text = 'X'
        } else {
            this.text = ''
        }
        this.floating_text = new Floating2DText(side_length, side_length, this.text, TYPE_CHECK_BOX, this.scene)
    },

    update_position_and_look_at: function(position, look_at) {
        this.floating_text.update_position_and_look_at(position, look_at)
    },

    toggle: function() {
        this.checked = !this.checked
        if (this.checked) {
            this.text = 'X'
        } else {
            this.text = ''
        }
        this.floating_2d_text.update_text(this.text)
    }
}