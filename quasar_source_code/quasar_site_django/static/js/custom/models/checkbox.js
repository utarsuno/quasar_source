'use strict'

function CheckBox(initial_state, scene) {
    this.__init__(initial_state, scene)
}

CheckBox.prototype = {

    scene           : null,

    floating_2d_text: null,

    checked         : null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,

    __init__: function(initial_state, scene) {
        this.scene   = scene
        this.checked = initial_state
        if (this.checked) {
            this.text = 'X'
        } else {
            this.text = ''
        }
        this.floating_2d_text = new Floating2DText(16, this.text, TYPE_CHECK_BOX, this.scene)

        this.being_looked_at = false
        this.being_engaged_with = false
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
        return !!this.checked
    },

    look_away: function() {
        if (this.being_looked_at) {
            this.wireframe.material.color.setHex(this.original_border_color)
            this.update_text_color(this.text, COLOR_TEXT_DEFAULT)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_just_color(COLOR_TEXT_DEFAULT)
            }
        }
        this.being_looked_at = false
    },

    disengage: function(player) {
    },

    is_engaged: function() {
        return this.being_engaged_with
    },

    engage: function(player) {
        player.disengage()
    }
}