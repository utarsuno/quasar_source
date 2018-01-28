'use strict';

// Each world (that needs it) will contain a single instance of DateSelector to re-use.
function DateSelector(world, date_selected_callback) {
    this.__init__(world, date_selected_callback);
}

DateSelector.prototype = {

    __init__: function(world, date_selected_callback) {
        this.date_selected = date_selected_callback;

        this.wall_date_selector = new FloatingWall(600, 250, null, null, world, false, COLOR_BLACK);
        this.wall_date_selector.add_row_3D_text(false, -1, 'Date Selector', TYPE_TITLE, COLOR_YELLOW);
        this.wall_date_selector.add_close_button();
        this.wall_date_selector.set_attachment_depth_offset(10);
        this.wall_date_selector.manual_visibility = true;

        // Time Logic.
        this.date = new MyDate(THIS_DAY);
        this.current_month = new MyDates(THIS_MONTH);
        this.all_days = this.current_month.get_all_dates();

        // Year.
        this.button_year_decrease = this.wall_date_selector.add_row_2D_text([0, ONE_FOURTH], 0, ICON_LEFT, TYPE_ICON);
        this.button_year_decrease.engable = false;
        this.button_year_decrease.set_engage_function(this.button_year_decrease_pressed.bind(this));
        world.interactive_objects.push(this.button_year_decrease);

        this.year = this.wall_date_selector.add_row_2D_text([ONE_FOURTH, THREE_FOURTHS], 0, this.date.get_year_as_string(), TYPE_CONSTANT);

        this.button_year_increase = this.wall_date_selector.add_row_2D_text([THREE_FOURTHS, 1], 0, ICON_RIGHT, TYPE_ICON);
        this.button_year_increase.engable = false;
        this.button_year_increase.set_engage_function(this.button_year_increase_pressed.bind(this));
        world.interactive_objects.push(this.button_year_increase);

        // Month.
        this.button_month_decrease = this.wall_date_selector.add_row_2D_text([0, ONE_FOURTH], 1, ICON_LEFT, TYPE_ICON);
        this.button_month_decrease.engable = false;
        this.button_month_decrease.set_engage_function(this.button_month_decrease_pressed.bind(this));
        world.interactive_objects.push(this.button_month_decrease);

        this.month = this.wall_date_selector.add_row_2D_text([ONE_FOURTH, THREE_FOURTHS], 1, this.date.get_month_full_data_string(), TYPE_CONSTANT);

        this.button_month_increase = this.wall_date_selector.add_row_2D_text([THREE_FOURTHS, 1], 1, ICON_RIGHT, TYPE_ICON);
        this.button_month_increase.engable = false;
        this.button_month_increase.set_engage_function(this.button_month_increase_pressed.bind(this));
        world.interactive_objects.push(this.button_month_increase);

        // Day labels.
        this.day_label_monday    = this.wall_date_selector.add_row_2D_text([0, 1 / 7]    , 3, 'Monday'   , TYPE_CONSTANT);
        this.day_label_tuesday   = this.wall_date_selector.add_row_2D_text([1 / 7, 2 / 7], 3, 'Tuesday'  , TYPE_CONSTANT);
        this.day_label_wednesday = this.wall_date_selector.add_row_2D_text([2 / 7, 3 / 7], 3, 'Wednesday', TYPE_CONSTANT);
        this.day_label_thursday  = this.wall_date_selector.add_row_2D_text([3 / 7, 4 / 7], 3, 'Thursday' , TYPE_CONSTANT);
        this.day_label_friday    = this.wall_date_selector.add_row_2D_text([4 / 7, 5 / 7], 3, 'Friday'   , TYPE_CONSTANT);
        this.day_label_saturday  = this.wall_date_selector.add_row_2D_text([5 / 7, 6 / 7], 3, 'Saturday' , TYPE_CONSTANT);
        this.day_label_sunday    = this.wall_date_selector.add_row_2D_text([6 / 7, 1]    , 3, 'Sunday'   , TYPE_CONSTANT);

        // All the day buttons.
        for (var d = 0; d < this.all_days.length; d++) {

            var row = this.all_days[d].get_week_relative_to_current_month();
            var num = this.all_days[d].get_day_number_relative_to_current_week();
            var day_cell = null;

            if (num === 0) {
                day_cell = this.wall_date_selector.add_row_2D_text([6 / 7, 1], 4 + row - 1, this.all_days[d].get_day_number(), TYPE_BUTTON);
            } else {
                day_cell = this.wall_date_selector.add_row_2D_text([(num - 1) / 7, num / 7], 4 + row, this.all_days[d].get_day_number(), TYPE_BUTTON);
            }
            day_cell.set_engage_function(this.date_selected.bind(this, this.all_days[d]));
            day_cell.set_default_color(this.current_month.get_day_color_by_index(d));
            day_cell.set_color(this.current_month.get_day_color_by_index(d), true);
        }

        //
        this.wall_date_selector.hide_self_and_all_child_attachments_recursively();
    },

    // Year.
    button_year_decrease_pressed: function() {
        this.date.apply_delta(DELTA_YEARS, -1);
        this.year.update_text(this.date.get_year_as_string());
    },

    button_year_increase_pressed: function() {
        this.date.apply_delta(DELTA_YEARS, 1);
        this.year.update_text(this.date.get_year_as_string());
    },

    // Month.
    button_month_decrease_pressed: function() {
        this.date.apply_delta(DELTA_MONTHS, -1);
        this.month.update_text(this.date.get_month_full_data_string());
        // If the month overflows below 0 or past december then the year should update as well.
        this.year.update_text(this.date.get_year_as_string());
    },

    button_month_increase_pressed: function() {
        this.date.apply_delta(DELTA_MONTHS, 1);
        this.month.update_text(this.date.get_month_full_data_string());
        // If the month overflows below 0 or past december then the year should update as well.
        this.year.update_text(this.date.get_year_as_string());
    }
};
