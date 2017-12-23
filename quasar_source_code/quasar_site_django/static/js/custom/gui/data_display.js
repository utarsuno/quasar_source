'use strict';

function DataDisplay(fps_controls) {
    this.__init__(fps_controls);
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
        this.fps_controls = fps_controls;

        this.enabled = true;

        // DOM elements.
        this.x_coordinate = document.getElementById('x_coordinate');
        this.y_coordinate = document.getElementById('y_coordinate');
        this.z_coordinate = document.getElementById('z_coordinate');

        this.x_direction  = document.getElementById('x_direction');
        this.y_direction  = document.getElementById('y_direction');
        this.z_direction  = document.getElementById('z_direction');
    },

    update: function() {
        if (this.enabled) {
            var position = this.fps_controls.get_position();
            var direction = this.fps_controls.get_direction();
            this.x_coordinate.textContent = 'x : ' + int(position.x) + ' | ' + int(this.fps_controls.get_velocity().x);
            this.y_coordinate.textContent = 'y : ' + int(position.y) + ' | ' + int(this.fps_controls.get_velocity().y);
            this.z_coordinate.textContent = 'z : ' + int(position.z) + ' | ' + int(this.fps_controls.get_velocity().z);
            this.x_direction.textContent  = 'xd : ' + direction.x;
            this.y_direction.textContent  = 'yd : ' + direction.y;
            this.z_direction.textContent  = 'zd : ' + direction.z;
        }
    },

    toggle: function() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.x_coordinate.style.visibility = NOT_VISIBLE;
            this.y_coordinate.style.visibility = NOT_VISIBLE;
            this.z_coordinate.style.visibility = NOT_VISIBLE;
            this.x_direction.style.visibility  = NOT_VISIBLE;
            this.y_direction.style.visibility  = NOT_VISIBLE;
            this.z_direction.style.visibility  = NOT_VISIBLE;
        } else {
            this.x_coordinate.style.visibility = VISIBLE;
            this.y_coordinate.style.visibility = VISIBLE;
            this.z_coordinate.style.visibility = VISIBLE;
            this.x_direction.style.visibility  = VISIBLE;
            this.y_direction.style.visibility  = VISIBLE;
            this.z_direction.style.visibility  = VISIBLE;
        }
    }
};