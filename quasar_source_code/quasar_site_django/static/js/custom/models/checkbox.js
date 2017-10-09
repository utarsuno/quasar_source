'use strict'

function CheckBox(side_length, initial_state, scene) {
    this.__init__(side_length, initial_state, scene)
}

CheckBox.prototype = {

    scene           : null,

    floating_2d_text: null,

    checked         : null,
    text            : null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,

    __init__: function(side_length, initial_state, scene) {
        this.scene   = scene
        this.checked = scene
        if (this.checked) {
            this.text = 'X'
        } else {
            this.text = ''
        }
        this.floating_2d_text = new Floating2DText(side_length, side_length, this.text, TYPE_CHECK_BOX, this.scene)

        this.being_looked_at = false
        this.being_engaged_with = false
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
        this.toggle()
    }
}