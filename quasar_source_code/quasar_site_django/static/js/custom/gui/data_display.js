'use strict'

function DataDisplay(fps_controls) {
    this.__init__(fps_controls)
}

DataDisplay.prototype = {
    x_coordinate: null,
    y_coordinate: null,
    z_coordinate: null,
    fps_controls: null,

    __init__: function(fps_controls) {
        this.fps_controls = fps_controls

        // DOM elements.
        this.x_coordinate = document.getElementById('x_coordinate')
        this.y_coordinate = document.getElementById('y_coordinate')
        this.z_coordinate = document.getElementById('z_coordinate')

        this.pitch        = document.getElementById('pitch')
        this.yaw          = document.getElementById('yaw')
    },

    rounded: function(n) {
        return Number(n).toFixed(3)
    },

    update: function() {
        this.x_coordinate.textContent = 'x : ' + this.rounded(this.fps_controls.get_position().x) + ' | ' + this.rounded(this.fps_controls.get_velocity().x)
        this.y_coordinate.textContent = 'y : ' + this.rounded(this.fps_controls.get_position().y) + ' | ' + this.rounded(this.fps_controls.get_velocity().y)
        this.z_coordinate.textContent = 'z : ' + this.rounded(this.fps_controls.get_position().z) + ' | ' + this.rounded(this.fps_controls.get_velocity().z)
        this.pitch.textContent = 'pitch : ' + this.rounded(this.fps_controls.get_pitch())
        this.yaw.textContent = 'yaw : ' + this.rounded(this.fps_controls.get_yaw())
    }
}