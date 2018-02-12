'use strict';

const WIDTH = 500;
const HEIGHT = 800;
const POSITION_RADIUS = 4000;

function DayView(schedule_view, day_instance, index) {
    this.__init__(schedule_view, day_instance, index);
}

DayView.prototype = {

    __init__: function(schedule_view, day_instance, index) {
        this.schedule_view = schedule_view;
        this.day_instance = day_instance;
        this.index = index;
        this.row = Math.floor(this.index / 28);
        this.row_index = this.index - (this.row * 28);
    },

    create: function() {
        var x_position = cos(this.row_index * TWO_PIE) * POSITION_RADIUS;
        var z_position = sin(this.row_index * TWO_PIE) * POSITION_RADIUS;
        var y_position = this.row * HEIGHT + 180 * this.row;
        var position = new THREE.Vector3(x_position, y_position, z_position);
        var normal = new THREE.Vector3(-x_position, 0, -z_position);

        this.wall = new FloatingWall(WIDTH, HEIGHT, position, normal, this.schedule_view.world, false);

        var month = this.day_instance.get_month_number_as_string();
        var date  = this.day_instance.get_day_number();
        
        this.wall.add_full_row_3D(-1, month + '.' + date, TYPE_TITLE);
        this.wall.add_row(null).add_2D_element([ONE_FOURTH, THREE_FOURTHS], this.day_instance.get_day_as_word(), TYPE_CONSTANT, COLOR_BLUE);

        this.wall.refresh_position_and_look_at();
    }

};


