'use strict';

const MONTH_VIEW_RADIUS = 3000;

function ScheduleView(world) {
    this.__init__(world);
}

ScheduleView.prototype = {

    __init__: function(world) {
        this.world = world;

        this.months = {};
        this.months[MONTH_JANUARY]   = [new MonthInstance(MONTH_JANUARY), null];
        this.months[MONTH_FEBRUARY]  = [new MonthInstance(MONTH_FEBRUARY), null];
        this.months[MONTH_MARCH]     = [new MonthInstance(MONTH_MARCH), null];
        this.months[MONTH_APRIL]     = [new MonthInstance(MONTH_APRIL), null];
        this.months[MONTH_MAY]       = [new MonthInstance(MONTH_MAY), null];
        this.months[MONTH_JUNE]      = [new MonthInstance(MONTH_JUNE), null];
        this.months[MONTH_JULY]      = [new MonthInstance(MONTH_JULY), null];
        this.months[MONTH_AUGUST]    = [new MonthInstance(MONTH_AUGUST), null];
        this.months[MONTH_SEPTEMBER] = [new MonthInstance(MONTH_SEPTEMBER), null];
        this.months[MONTH_OCTOBER]   = [new MonthInstance(MONTH_OCTOBER), null];
        this.months[MONTH_NOVEMBER]  = [new MonthInstance(MONTH_NOVEMBER), null];
        this.months[MONTH_DECEMBER]  = [new MonthInstance(MONTH_DECEMBER), null];

        this.today = new DayInstance(THIS_DAY);
        this.current_month = this.today.get_month_number();
    },

    create_specific_month_day_wall: function(color, index, y_position, day, total_number_of_days, present) {
        var w = 500;
        var h = 800;

        var percentage = index / total_number_of_days;
        var x_position = cos(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;
        var z_position = sin(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;

        var p = new THREE.Vector3(x_position, 1000, z_position);
        var n = new THREE.Vector3(-x_position, 0, -z_position);

        var month_day_wall;
        if (present) {
            month_day_wall = new FloatingWall(w, h, p, n, this.world, false, COLOR_FLOATING_WALL_HIGHLIGHT);
        } else {
            month_day_wall = new FloatingWall(w, h, p, n, this.world, false);
        }
        month_day_wall.add_full_row_3D(-1, day.get_day_number(), TYPE_SUPER_TITLE, color);
        month_day_wall.refresh_position_and_look_at();
        return month_day_wall;
    },

    create_month_view: function(month, y_index) {
        // 50 is the y spacing between rows for now. 1000 is the starting height.
        var y_position = y_index * 800 + 50 * y_index;

        // TODO : Eventually refactor this.
        var dates_in_past = month.get_dates_in_past();
        var dates_in_present = month.get_dates_in_present();
        var dates_in_future = month.get_dates_in_future();

        var month_day_walls = [];

        var day_index = 0;
        var d;

        // Past dates.
        for (d = 0; d < dates_in_past.length; d++) {
            month_day_walls.push(this.create_specific_month_day_wall(month.get_day_color_by_index(day_index), day_index, y_position, dates_in_past[d], month.dates.length, false));
            day_index += 1;
        }
        // Present dates.
        for (d = 0; d < dates_in_present.length; d++) {
            month_day_walls.push(this.create_specific_month_day_wall(month.get_day_color_by_index(day_index), day_index, y_position, dates_in_present[d], month.dates.length, true));
            day_index += 1;
        }
        // Future dates.
        for (d = 0; d < dates_in_future.length; d++) {
            month_day_walls.push(this.create_specific_month_day_wall(month.get_day_color_by_index(day_index), day_index, y_position, dates_in_future[d], month.dates.length, false));
            day_index += 1;
        }

        return month_day_walls;
    },

    create_year_schedule_view: function() {
        for (var key in this.months) {
            if (this.months.hasOwnProperty(key)) {
                var month = this.months[key][0];

                // A negative y-index indicates that the month is in the future.
                var y_index = this.current_month - month.get_month_number();

                this.months[key][1] = this.create_month_view(month, y_index);
            }
        }
    }

};