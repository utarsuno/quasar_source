'use strict';

function DayView() {

}

DayView.prototype = {

};





/*

    create_month_day_wall: function(day, index, total_number_of_days, present) {
        var w = 500;
        var h = 1000;

        var percentage = index / total_number_of_days;
        var x_position = cos(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;
        var z_position = sin(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;

        var p = new THREE.Vector3(x_position, 1000, z_position);
        var n = new THREE.Vector3(-x_position, 0, -z_position);

        var month_day_wall = new FloatingWall(w, h, p, n, this, false);
        month_day_wall.add_full_row_3D(-1, day.get_day_number(), TYPE_SUPER_TITLE, this.month_days.get_day_color_by_index(index));

        if (present) {
            month_day_wall.add_full_row_3D(-2, 'Today', TYPE_SUPER_TITLE, this.month_days.get_day_color_by_index(index));
        }

        month_day_wall.refresh_position_and_look_at();

        return month_day_wall;
    },

    load_schedule: function() {
        // The 360 schedule view.
        this.month_day_walls = [];
        this.month_days = new MonthInstance(THIS_MONTH);

        var dates_in_past = this.month_days.get_dates_in_past();
        var dates_in_present = this.month_days.get_dates_in_present();
        var dates_in_future = this.month_days.get_dates_in_future();

        var day_index = 0;
        var d;
        for (d = 0; d < dates_in_past.length; d++) {
            this.month_day_walls.push(this.create_month_day_wall(dates_in_past[d], day_index, this.month_days.dates.length, false));
            day_index += 1;
        }
        this.month_day_walls.push(this.create_month_day_wall(dates_in_present[0], day_index, this.month_days.dates.length, true));
        day_index += 1;
        for (d = 0; d < dates_in_future.length; d++) {
            this.month_day_walls.push(this.create_month_day_wall(dates_in_future[d], day_index, this.month_days.dates.length, false));
            day_index += 1;
        }

        // Load the initial data.
        this.add_content_to_schedules();
    }

 */