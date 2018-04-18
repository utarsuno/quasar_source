'use strict';

// Each world (that needs it) will contain a single instance of DateSelector to re-use.
function DateSelector(world, date_selected_callback) {
    this.__init__(world, date_selected_callback);
}

DateSelector.prototype = {

    hide: function() {
        this.wall_date_selector.detach_from_parent();
        this.wall_date_selector.force_hide_self_and_all_child_attachments_recursively();
    },

    __init__: function(world, date_selected_callback) {
        this.date_selected = date_selected_callback;

        this.wall_date_selector = new FloatingWall(600, 250, null, null, world, false, COLOR_BLACK);
        this.wall_date_selector.add_row(-1).add_text_3D([0, null, false], 32, 'Date Selector', COLOR_YELLOW);
        this.wall_date_selector.add_close_button();
        this.wall_date_selector.set_attachment_depth_offset(10);
        this.wall_date_selector.manual_visibility = true;
        this.wall_date_selector.auto_adjust_height_if_needed();

        // Time Logic.
        this.month_instance = new MonthInstance(get_current_month_number(), get_current_year_number());
        //this.all_days = this.current_month.get_all_day_instances();

        // Year.
        let row_year = this.wall_date_selector.add_row(null);
        this.year = row_year.add_text_2D([ONE_FOURTH, THREE_FOURTHS, CENTER_ABSOLUTE], 16, this.month_instance.get_year());
        this.button_year_decrease = this.year.add_icon_button_left(ICON_LEFT, this.button_year_decrease_pressed.bind(this));
        this.button_year_increase = this.year.add_icon_button_right(ICON_RIGHT, this.button_year_increase_pressed.bind(this));

        // Month.
        let row_month = this.wall_date_selector.add_row(null);
        this.month = row_month.add_text_2D([ONE_FOURTH, THREE_FOURTHS, CENTER_ABSOLUTE], 16, this.month_instance.get_month_string());
        this.button_month_decrease = this.month.add_icon_button_left(ICON_LEFT, this.button_month_decrease_pressed.bind(this));
        this.button_month_increase = this.month.add_icon_button_right(ICON_RIGHT, this.button_month_increase_pressed.bind(this));

        // Day labels.
        let row_labels = this.wall_date_selector.add_row(null);
        this.day_label_monday    = row_labels.add_text_2D([0, 1 / 7, CENTER_ABSOLUTE]    , 16, 'Monday'   );
        this.day_label_tuesday   = row_labels.add_text_2D([1 / 7, 2 / 7, CENTER_ABSOLUTE], 16, 'Tuesday'  );
        this.day_label_wednesday = row_labels.add_text_2D([2 / 7, 3 / 7, CENTER_ABSOLUTE], 16, 'Wednesday');
        this.day_label_thursday  = row_labels.add_text_2D([3 / 7, 4 / 7, CENTER_ABSOLUTE], 16, 'Thursday' );
        this.day_label_friday    = row_labels.add_text_2D([4 / 7, 5 / 7, CENTER_ABSOLUTE], 16, 'Friday'   );
        this.day_label_saturday  = row_labels.add_text_2D([5 / 7, 6 / 7, CENTER_ABSOLUTE], 16, 'Saturday' );
        this.day_label_sunday    = row_labels.add_text_2D([6 / 7, 1, CENTER_ABSOLUTE]    , 16, 'Sunday'   );

        // Add a row for spacing.
        this.spacing_row = this.wall_date_selector.add_row(null);

        // The rows that the date buttons will go into.
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);

        this.wall_date_selector.add_row(null).add_button([0, 1, false], 16, 'set to no value', this.date_selected.bind(this, NO_DATE_SELECTED), COLOR_RED);

        this.wall_date_selector.hide_self_and_all_child_attachments_recursively();
    },

    refresh_dates: function() {
        if (is_defined(this.all_day_buttons)) {
            if (this.all_day_buttons.length > 0) {
                this._delete_all_day_buttons();
            }
        }
        this._create_all_day_buttons();
    },

    _delete_all_day_buttons: function() {
        for (let d = 0; d < this.all_day_buttons.length; d++) {
            this.all_day_buttons[d].detach_from_parent();
            this.all_day_buttons[d].remove_from_root_attachmentables_if_needed();
            this.all_day_buttons[d].full_remove();
        }
        this.all_day_buttons.length = 0;
    },

    _create_all_day_buttons: function() {
        this.all_days = this.month_instance.get_all_day_instances();

        this.all_day_buttons = [];

        let width_position = (this.wall_date_selector.width) / 7;
        let height_position = (this.wall_date_selector.height) / 8;

        let width = (this.wall_date_selector.width - 100) / 7;
        let height = (this.wall_date_selector.height - 100) / 5;

        for (let d = 0; d < this.all_days.length; d++) {
            let day_button = new FloatingButton(this.wall_date_selector.world, width, 16, this.all_days[d].day_number, this.date_selected.bind(this, this.all_days[d]));
            //var day_button = new FloatingText2D(this.wall_date_selector.world, 16, this.all_days[d].day_number);
            //var day_button = new Floating2DText(width, this.all_days[d].day_number, TYPE_BUTTON, this.wall_date_selector.world);
            height = day_button.height;
            day_button.set_attachment_depth_offset(5);
            day_button.set_attachment_horizontal_offset(width_position * this.all_days[d].day_of_the_week + width / 2, -HALF);
            day_button.set_attachment_vertical_offset(-(height_position * this.all_days[d].week_number - height + 64), HALF);

            //day_button.set_engage_function(this.date_selected.bind(this, this.all_days[d]));
            day_button.attach_to(this.wall_date_selector);
            this.all_day_buttons.push(day_button);
        }

        this.wall_date_selector.refresh_position_and_look_at();
    },

    // Year.
    button_year_decrease_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_YEARS, -1);
        this.year.update_text(this.month_instance.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    },

    button_year_increase_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_YEARS, 1);
        this.year.update_text(this.month_instance.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    },

    // Month.
    button_month_decrease_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_MONTHS, -1);
        this.month.update_text(this.month_instance.get_month_string());
        this.year.update_text(this.month_instance.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    },

    button_month_increase_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_MONTHS, 1);
        this.month.update_text(this.month_instance.get_month_string());
        this.year.update_text(this.month_instance.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    }
};
