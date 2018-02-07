'use strict';

function TimeSelector(world, time_selected_callback) {
    this.__init__(world, time_selected_callback);
}

TimeSelector.prototype = {
    __init__: function(world, time_selected_callback) {
        this.time_selected = time_selected_callback;

        this.wall_time_selector = new FloatingWall(400, 200, null, null, world, false, COLOR_BLACK);
        this.wall_time_selector.add_full_row_3D(-1, 'Time Selector', TYPE_TITLE, COLOR_YELLOW);
        this.wall_time_selector.add_close_button();
        this.wall_time_selector.set_attachment_depth_offset(10);
        this.wall_time_selector.manual_visibility = true;

        // Hour.
        this.wall_time_selector.add_row(null).add_2D_element([0, 1], 'hour', TYPE_CONSTANT);
        var hour_row = this.wall_time_selector.add_row(null);

        this.hour = hour_row.add_2D_element([1 / 3, 2 / 3], '', TYPE_CONSTANT);

        hour_row.add_2D_button([0, 1 / 6], '5', COLOR_RED, this.decrease_hour.bind(this, 5));
        hour_row.add_2D_button([1 / 6, 2 / 6], '1', COLOR_RED, this.decrease_hour.bind(this, 1));
        hour_row.add_2D_button([4 / 6, 5 / 6], '1', COLOR_GREEN, this.increase_hour.bind(this, 1));
        hour_row.add_2D_button([5 / 6, 1], '5', COLOR_GREEN, this.increase_hour.bind(this, 5));

        // Minute.
        this.wall_time_selector.add_row(null).add_2D_element([0, 1], 'minute', TYPE_CONSTANT);
        var minute_row = this.wall_time_selector.add_row(null);

        this.minute = minute_row.add_2D_element([1 / 3, 2 / 3], '', TYPE_CONSTANT);

        minute_row.add_2D_button([0, 1 / 9], '10', COLOR_RED, this.decrease_minute(10));
        minute_row.add_2D_button([1 / 9, 2 / 9], '5', COLOR_RED, this.decrease_minute(5));
        minute_row.add_2D_button([2 / 9, 3 / 9], '1', COLOR_RED, this.decrease_minute(1));
        minute_row.add_2D_button([6 / 9, 7 / 9], '1', COLOR_GREEN, this.increase_minute(1));
        minute_row.add_2D_button([7 / 9, 8 / 9], '5', COLOR_GREEN, this.increase_minute(5));
        minute_row.add_2D_button([8 / 9, 1], '10', COLOR_GREEN, this.increase_minute(10));

        this.refresh_time_selector();

        this.wall_time_selector.add_row(null).add_2D_button([0, 1], 'set to no value', COLOR_RED, this.time_selected.bind(this, null, null));
        this.wall_time_selector.add_row(null).add_2D_button([0, 1], 'set time', COLOR_GREEN, this.time_selected.bind(this, this.hour.get_text(), this.minute.get_text()));
    },

    refresh_time_selector: function() {
        // Get the current time for placeholder values.
        var current_time = new Date();
        var current_hour = current_time.getHours();
        var current_minute = current_time.getMinutes();
        this.hour.update_text(current_hour);
        this.minute.update_text(current_minute);
    },

    decrease_hour: function(delta) {
        var current_hour = parseInt(this.hour.get_text());
        if (current_hour - delta > -1) {
            current_hour -= delta;
        }
        this.hour.update_text(current_hour);
    },

    increase_hour: function(delta) {
        var current_hour = parseInt(this.hour.get_text());
        if (current_hour + delta < 25) {
            current_hour += delta;
        }
        this.hour.update_text(current_hour);
    },

    decrease_minute: function(delta) {
        var current_minute = parseInt(this.minute.get_text());
        if (current_minute - delta > -1) {
            current_minute -= delta;
        }
        this.minute.update_text(current_minute);
    },

    increase_minute: function(delta) {
        var current_minute = parseInt(this.minute.get_text());
        if (current_minute + delta < 25) {
            current_minute += delta;
        }
        this.minute.update_text(current_minute);
    }
};