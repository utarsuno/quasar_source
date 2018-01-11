'use strict';

// Each world (that needs it) will contain a single instance of DateSelector to re-use.
function DateSelector(world) {
    this.__init__(world);
}

DateSelector.prototype = {

    __init__: function(world) {
        this.world = world;

        var w = 600;
        var h = 250;
        var p = new THREE.Vector3(-5000, -5000, -5000);
        var n = new THREE.Vector3(0, 0, 0);

        this.wall = new FloatingWall(w, h, p, n, this.world, false);
        // TODO : Fix the title movement!
        this.wall.add_3D_title('Select Date');
        this.wall.add_close_button();

        this.wall.add_floating_2d_text(.1, .9, 'Select Date', TYPE_TITLE, 0);

        this.date = new MyDate(THIS_DAY);
        this.current_month = new MyDates(THIS_MONTH);

        // Year.
        this.decrease_year_button = this.wall.add_floating_2d_text(0, .25, ICON_LEFT, TYPE_BUTTON, 3);
        this.decrease_year_button.set_engage_function(this.decrease_year.bind(this));
        this.year = this.wall.add_floating_2d_text(.25, .75, this.date.get_year_as_string(), TYPE_CONSTANT, 3);
        this.increase_year_button = this.wall.add_floating_2d_text(.75, 1, ICON_RIGHT, TYPE_BUTTON, 3);
        this.increase_year_button.set_engage_function(this.increase_year.bind(this));

        // Month.
        this.decrease_month_button = this.wall.add_floating_2d_text(0, .25, ICON_LEFT, TYPE_BUTTON, 4);
        this.decrease_month_button.set_engage_function(this.decrease_month.bind(this));
        this.month = this.wall.add_floating_2d_text(.25, .75, this.date.get_month_full_data_string(), TYPE_CONSTANT, 4);
        this.increase_month_button = this.wall.add_floating_2d_text(.75, 1, ICON_RIGHT, TYPE_BUTTON, 4);
        this.increase_month_button.set_engage_function(this.increase_month.bind(this));

        // Days.
        var days = this.current_month.get_all_dates();

        // Adjustment amount.
        var gap = (1 / 8) * (1 / 6) * (1 / 2);

        this.label_day_monday    = this.wall.add_floating_2d_text(0, 1 / 8 + gap, 'Monday', TYPE_CONSTANT, 6);
        this.label_day_tuesday   = this.wall.add_floating_2d_text(1 / 8 + 2 * gap, 2 / 8 + 3 * gap, 'Tuesday', TYPE_CONSTANT, 6);
        this.label_day_wednesday = this.wall.add_floating_2d_text(2 / 8 + 4 * gap, 3 / 8 + 5 * gap, 'Wednesday', TYPE_CONSTANT, 6);
        this.label_day_thursday  = this.wall.add_floating_2d_text(3 / 8 + 6 * gap, 4 / 8 + 7 * gap, 'Thursday', TYPE_CONSTANT, 6);
        this.label_day_friday    = this.wall.add_floating_2d_text(4 / 8 + 8 * gap, 5 / 8 + 9 * gap, 'Friday', TYPE_CONSTANT, 6);
        this.label_day_saturday  = this.wall.add_floating_2d_text(5 / 8 + 10 * gap, 6 / 8 + 11 * gap, 'Saturday', TYPE_CONSTANT, 6);
        this.label_day_sunday    = this.wall.add_floating_2d_text(6 / 8 + 12 * gap, 1, 'Sunday', TYPE_CONSTANT, 6);

        for (var d = 0; d < days.length; d++) {

            l(days[d].to_string() + ' is in the :');
            if (days[d].in_past()) {
                l('past!');
            } else if (days[d].in_future()) {
                l('future!');
            } else {
                l('present!');
            }

            var row = days[d].get_week_relative_to_current_month();
            var num = days[d].get_day_number_relative_to_current_week();
            var day_cell = null;
            if (num === 0) {
                day_cell = this.wall.add_floating_2d_text(6 / 7, 1, days[d].get_day_number(), TYPE_BUTTON, 7 + row);
                day_cell.set_engage_function(this.date_selected.bind(this, days[d]));
            } else {
                day_cell = this.wall.add_floating_2d_text((num - 1) / 7, num / 7, days[d].get_day_number(), TYPE_BUTTON, 8 + row);
                day_cell.set_engage_function(this.date_selected.bind(this, days[d]));
            }
            day_cell.set_default_color(this.current_month.get_day_color_by_index(d));
        }
    },

    date_selected: function(date) {
        var year = this.year.get_text();
        var month = this.month.get_text();
        var day = date.get_day_number();

        this.wall.pfw_button.update_text(day.toString() + '.' + month.toString() + '.' + year.toString());

        this.wall.hide();
    },

    show_at: function(floating_2D_text) {
        this.wall.show();

        var bp = floating_2D_text.get_position();
        var bnd = floating_2D_text.parent_floating_wall.normal_depth;
        var bn = floating_2D_text.parent_floating_wall.normal;

        this.wall.normal = bn;
        this.wall.normal_depth = bnd;

        //this.wall.object3D.position.set(bp.x + bn.x * bnd, bp.y + bn.y * bnd, bp.z + bn.z * bnd);
        //this.wall.object3D.lookAt(new THREE.Vector3(bp.x + bn.x * bnd * 2, bp.y + bn.y * bnd * 2, bp.z + bn.z * bnd * 2));

        this.wall.pfw_button = floating_2D_text;
        this.wall.update_position_with_offset_xyz(0, 0, 0);
        this.wall.update_normal(bn);
        this.wall.update_position_and_normal_for_all_floating_text();
    },

    // TODO:
    hide: function() {

    },

    // Year.
    decrease_year: function() {
        this.date.apply_delta(DELTA_YEARS, -1);
        this.year.update_text(this.date.get_year_as_string());
    },

    increase_year: function() {
        this.date.apply_delta(DELTA_YEARS, 1);
        this.year.update_text(this.date.get_year_as_string());
    },

    // Month.
    decrease_month: function() {
        this.date.apply_delta(DELTA_MONTHS, -1);
        this.month.update_text(this.date.get_month_full_data_string());
        // If the month overflows below 0 or past december then the year should update as well.
        this.year.update_text(this.date.get_year_as_string());
    },

    increase_month: function() {
        this.date.apply_delta(DELTA_MONTHS, 1);
        this.month.update_text(this.date.get_month_full_data_string());
        // If the month overflows below 0 or past december then the year should update as well.
        this.year.update_text(this.date.get_year_as_string());
    }

    // Days.


};
