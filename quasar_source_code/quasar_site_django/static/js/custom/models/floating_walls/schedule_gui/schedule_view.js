'use strict';

const MONTH_VIEW_RADIUS = 4000;

const MONTH_TYPE_PAST    = 1;
const MONTH_TYPE_PRESENT = 2;
const MONTH_TYPE_FUTURE  = 3;

function ScheduleView(world) {
    this.__init__(world);
}

ScheduleView.prototype = {

    __init__: function(world) {
        this.world = world;

        this.months = {};
        this.months[MONTH_JANUARY]   = new MonthInstance(MONTH_JANUARY);
        this.months[MONTH_FEBRUARY]  = new MonthInstance(MONTH_FEBRUARY);
        this.months[MONTH_MARCH]     = new MonthInstance(MONTH_MARCH);
        this.months[MONTH_APRIL]     = new MonthInstance(MONTH_APRIL);
        this.months[MONTH_MAY]       = new MonthInstance(MONTH_MAY);
        this.months[MONTH_JUNE]      = new MonthInstance(MONTH_JUNE);
        this.months[MONTH_JULY]      = new MonthInstance(MONTH_JULY);
        this.months[MONTH_AUGUST]    = new MonthInstance(MONTH_AUGUST);
        this.months[MONTH_SEPTEMBER] = new MonthInstance(MONTH_SEPTEMBER);
        this.months[MONTH_OCTOBER]   = new MonthInstance(MONTH_OCTOBER);
        this.months[MONTH_NOVEMBER]  = new MonthInstance(MONTH_NOVEMBER);
        this.months[MONTH_DECEMBER]  = new MonthInstance(MONTH_DECEMBER);

        this.today = new DayInstance(THIS_DAY);
        this.current_month = this.today.get_month_number();

        // TODO : Get all the days and add them into an entire list in order.
        this.all_days = [];
    },

    create_specific_month_day_wall: function(color, index, y_position, day, total_number_of_days, present) {
        var w = 500;
        var h = 800;

        var percentage = index / total_number_of_days;
        var x_position = cos(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;
        var z_position = sin(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;

        var p = new THREE.Vector3(x_position, 1000 + y_position, z_position);
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

    create_month_view: function(month, y_index, month_type) {
        // 50 is the y spacing between rows for now. 1000 is the starting height.
        var y_position = y_index * 800 + 150 * y_index;

        // TODO : Eventually refactor this.
        var dates_in_past = month.get_dates_in_past();
        var dates_in_present = month.get_dates_in_present();
        var dates_in_future = month.get_dates_in_future();

        var month_day_walls = [];

        var day_index = 0;
        var d;

        if (month_type === MONTH_TYPE_PRESENT) {
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
        } else {

            var color_to_use;
            if (month_type === MONTH_TYPE_FUTURE) {
                color_to_use = COLOR_YELLOW;
            } else {
                color_to_use = COLOR_RED;
            }

            // Past dates.
            for (d = 0; d < dates_in_past.length; d++) {
                month_day_walls.push(this.create_specific_month_day_wall(color_to_use, day_index, y_position, dates_in_past[d], month.dates.length, false));
                day_index += 1;
            }
            // Present dates.
            for (d = 0; d < dates_in_present.length; d++) {
                month_day_walls.push(this.create_specific_month_day_wall(color_to_use, day_index, y_position, dates_in_present[d], month.dates.length, true));
                day_index += 1;
            }
            // Future dates.
            for (d = 0; d < dates_in_future.length; d++) {
                month_day_walls.push(this.create_specific_month_day_wall(color_to_use, day_index, y_position, dates_in_future[d], month.dates.length, false));
                day_index += 1;
            }
        }

        return month_day_walls;
    },

    add_days_from_month: function(month) {
        var all_dates = month.get_all_day_instances();
        for (var d = 0; d < all_dates.length; d++) {
            //this.all_days.push(all_dates[d]);
            this.all_days.push(new DayView(this, all_dates[d]));
        }
    },

    create_year_schedule_view: function() {
        this.add_days_from_month(this.months[MONTH_JANUARY]);
        this.add_days_from_month(this.months[MONTH_FEBRUARY]);
        this.add_days_from_month(this.months[MONTH_MARCH]);
        this.add_days_from_month(this.months[MONTH_APRIL]);
        this.add_days_from_month(this.months[MONTH_MAY]);
        this.add_days_from_month(this.months[MONTH_JUNE]);
        this.add_days_from_month(this.months[MONTH_JULY]);
        this.add_days_from_month(this.months[MONTH_AUGUST]);
        this.add_days_from_month(this.months[MONTH_SEPTEMBER]);
        this.add_days_from_month(this.months[MONTH_OCTOBER]);
        this.add_days_from_month(this.months[MONTH_NOVEMBER]);
        this.add_days_from_month(this.months[MONTH_DECEMBER]);

        // Create the DayView walls.
        for (var d = 0; d < this.all_days.length; d++) {
            this.all_days[d].create();
        }

        // OLD CODE BELOW
        return;

        for (var key in this.months) {
            if (this.months.hasOwnProperty(key)) {
                var month = this.months[key][0];

                var y_index = (this.current_month - month.get_month_number()) * -1;

                var month_type;
                if (this.current_month === month.get_month_number()) {
                    month_type = MONTH_TYPE_PRESENT;
                } else if (this.current_month > month.get_month_number()) {
                    month_type = MONTH_TYPE_PAST;
                } else {
                    month_type = MONTH_TYPE_FUTURE;
                }

                this.months[key][1] = this.create_month_view(month, y_index, month_type);
            }
        }
    }

};