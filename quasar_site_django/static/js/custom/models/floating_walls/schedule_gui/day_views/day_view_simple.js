'use strict';

function DayViewSimple(day_instance, base_wall) {
    this.__init__(day_instance, base_wall);
}

DayViewSimple.prototype = {

    __init__: function(day_instance, base_wall) {
        this.day_instance = day_instance;
        this.base_wall    = base_wall;

        l(this.base_wall);

        var position_width = this.base_wall.width / 7;
        var position_height = this.base_wall.height / 5;

        var width = (this.base_wall.width - 100) / 7;
        var height = (this.base_wall.height - 100) / 5;

        // Create the day view.
        this.day_view = new FloatingWall(width, height, null, null, this.base_wall.world, false);
        this.day_view.set_attachment_depth_offset(5);
        this.day_view.set_attachment_horizontal_offset(position_width * this.day_instance.day_of_the_week + width / 2, -HALF);
        this.day_view.set_attachment_vertical_offset(-(position_height * this.day_instance.week_number + height / 2), HALF);

        this.day_view.add_row(-1).add_3D_element(this.day_instance.day_number, TYPE_TITLE, null);

        this.day_view.attach_to(this.base_wall);
    }

};