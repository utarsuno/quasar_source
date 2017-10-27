'use strict'

function DataDisplay(fps_controls) {
    this.__init__(fps_controls)
}

DataDisplay.prototype = {
    x_coordinate: null,
    y_coordinate: null,
    z_coordinate: null,

    x_direction: null,
    y_direction: null,
    z_direction: null,

    fps_controls: null,

    enabled: null,

    __init__: function(fps_controls) {
        this.fps_controls = fps_controls

        this.enabled = true

        // DOM elements.
        this.x_coordinate = document.getElementById('x_coordinate')
        this.y_coordinate = document.getElementById('y_coordinate')
        this.z_coordinate = document.getElementById('z_coordinate')

        this.x_direction  = document.getElementById('x_direction')
        this.y_direction  = document.getElementById('y_direction')
        this.z_direction  = document.getElementById('z_direction')
    },

    rounded: function(n) {
        return Number(n).toFixed(3)
    },

    update: function() {
        if (this.enabled) {
            var position = this.fps_controls.get_position()
            var direction = this.fps_controls.get_direction()
            this.x_coordinate.textContent = 'x : ' + this.rounded(position.x) + ' | ' + this.rounded(this.fps_controls.get_velocity().x)
            this.y_coordinate.textContent = 'y : ' + this.rounded(position.y) + ' | ' + this.rounded(this.fps_controls.get_velocity().y)
            this.z_coordinate.textContent = 'z : ' + this.rounded(position.z) + ' | ' + this.rounded(this.fps_controls.get_velocity().z)

            this.x_direction.textContent = 'xd : ' + this.rounded(direction.x)
            this.y_direction.textContent = 'yd : ' + this.rounded(direction.y)
            this.z_direction.textContent = 'zd : ' + this.rounded(direction.z)
        }
    },

    toggle: function() {
        this.enabled = !this.enabled
        if (!this.enabled) {
            this.x_coordinate.style.visibility = 'hidden'
            this.y_coordinate.style.visibility = 'hidden'
            this.z_coordinate.style.visibility = 'hidden'
            this.x_direction.style.visibility = 'hidden'
            this.y_direction.style.visibility = 'hidden'
            this.z_direction.style.visibility = 'hidden'
        } else {
            this.x_coordinate.style.visibility = 'visible'
            this.y_coordinate.style.visibility = 'visible'
            this.z_coordinate.style.visibility = 'visible'
            this.x_direction.style.visibility = 'visible'
            this.y_direction.style.visibility = 'visible'
            this.z_direction.style.visibility = 'visible'
        }
    }
}