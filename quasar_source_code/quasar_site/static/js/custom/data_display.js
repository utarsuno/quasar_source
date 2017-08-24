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
    },

    update: function() {
        this.x_coordinate.textContent = 'x : ' + Number(this.fps_controls.get_position().x).toFixed(4)
        this.y_coordinate.textContent = 'y : ' + Number(this.fps_controls.get_position().y).toFixed(4)
        this.z_coordinate.textContent = 'z : ' + Number(this.fps_controls.get_position().z).toFixed(4)
    }
}