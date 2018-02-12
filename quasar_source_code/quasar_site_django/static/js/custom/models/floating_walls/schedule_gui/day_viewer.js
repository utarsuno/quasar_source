'use strict';

const WIDTH = 500;
const HEIGHT = 800;
const POSITION_RADIUS = 3500;

function DayView(schedule_view, day_instance, index) {
    this.__init__(schedule_view, day_instance, index);
}

DayView.prototype = {

    __init__: function(schedule_view, day_instance, index) {
        this.schedule_view = schedule_view;
        this.day_instance = day_instance;
        this.index = index;
        this.row = Math.floor(this.index / 28);
        this.row_index = (this.index - (this.row * 28)) / 28;
    },

    create: function() {
        var x_position = cos(this.row_index * TWO_PIE) * POSITION_RADIUS;
        var z_position = sin(this.row_index * TWO_PIE) * POSITION_RADIUS;
        var y_position = this.row * HEIGHT + 180 * this.row - 750;
        var position = new THREE.Vector3(x_position, y_position, z_position);
        var normal = new THREE.Vector3(-x_position, 0, -z_position);

        if (this.day_instance.in_current_week()) {
            this.wall = new FloatingWall(WIDTH, HEIGHT, position, normal, this.schedule_view.world, false, COLOR_FLOATING_WALL_SUCCESS);
        } else if (this.day_instance.in_current_month()) {
            this.wall = new FloatingWall(WIDTH, HEIGHT, position, normal, this.schedule_view.world, false, COLOR_FLOATING_WALL_HIGHLIGHT);
        } else {
            this.wall = new FloatingWall(WIDTH, HEIGHT, position, normal, this.schedule_view.world, false);
        }

        var month = this.day_instance.get_month_number_as_string();
        var date  = this.day_instance.get_day_number();

        var title_color;
        switch(this.day_instance.get_day_number_relative_to_current_week()) {
        case 0:
            title_color = COLOR_SUNDAY;
            break;
        case 1:
            title_color = COLOR_MONDAY;
            break;
        case 2:
            title_color = COLOR_TUESDAY;
            break;
        case 3:
            title_color = COLOR_WEDNESDAY;
            break;
        case 4:
            title_color = COLOR_THURSDAY;
            break;
        case 5:
            title_color = COLOR_FRIDAY;
            break;
        case 6:
            title_color = COLOR_SATURDAY;
            break;
        }
        this.wall.add_full_row_3D(-1, month + '.' + date + ' - ' + this.day_instance.get_day_as_word(), TYPE_TITLE, title_color);

        this.wall.refresh_position_and_look_at();
    }

};


