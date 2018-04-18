'use strict';

function DataDisplay() {
    this.__init__();
}

DataDisplay.prototype = {

    __init__: function() {
        this.enabled = true;

        // DOM elements.
        this.element_container = new DomElement('data_display');
        this.element_x_coordinate = new DomElement('x_coordinate', true);
        this.element_y_coordinate = new DomElement('y_coordinate', true);
        this.element_z_coordinate = new DomElement('z_coordinate', true);
        this.element_x_direction = new DomElement('x_direction', true);
        this.element_y_direction = new DomElement('y_direction', true);
        this.element_z_direction = new DomElement('z_direction', true);
    },

    update: function() {
        let position = CURRENT_PLAYER.fps_controls.get_position();
        let direction = CURRENT_PLAYER.fps_controls.get_direction();
        let velocity  = CURRENT_PLAYER.fps_controls.get_velocity();

        this.element_x_coordinate.set_text('x : ' + int(position.x) + ' | ' + int(velocity.x));
        this.element_y_coordinate.set_text('x : ' + int(position.y) + ' | ' + int(velocity.y));
        this.element_z_coordinate.set_text('x : ' + int(position.z) + ' | ' + int(velocity.z));

        this.element_x_direction.set_text('xd : ' + direction.x);
        this.element_y_direction.set_text('yd : ' + direction.y);
        this.element_z_direction.set_text('zd : ' + direction.z);
    },

    hide: function() {
        this.element_container.hide();
    },

    show: function() {
        this.element_container.show();
    }
};