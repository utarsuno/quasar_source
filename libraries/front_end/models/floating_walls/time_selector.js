'use strict';

function TimeSelector(world, time_selected_callback) {
    this.__init__(world, time_selected_callback);
}

TimeSelector.prototype = {

    hide: function() {
        this.wall_time_selector.detach_from_parent();
        this.wall_time_selector.force_hide_self_and_all_child_attachments_recursively();
    },

    __init__: function(world, time_selected_callback) {
        this.time_selected = time_selected_callback;

        this.wall_time_selector = new FloatingWall(300, 200, null, null, world, false, QE.COLOR_BLACK);
        this.wall_time_selector.add_row(-1).add_text_3D([0, null, false], 32, 'Time Selector', QE.COLOR_YELLOW);
        this.wall_time_selector.add_close_button();
        this.wall_time_selector.set_attachment_depth_offset(10);
        this.wall_time_selector.manual_visibility = true;

        // Hour.
        this.wall_time_selector.add_row(null).add_text_2D([0, 1], 16, 'hour');
        let hour_row = this.wall_time_selector.add_row(null);

        this.hour = hour_row.add_text_2D([1 / 3, 2 / 3, CENTER_ABSOLUTE], 16, get_current_hour());

        hour_row.add_button([0, 1 / 6, false], 16, '5', this.decrease_hour.bind(this, 5), QE.COLOR_RED);
        hour_row.add_button([1 / 6, 2 / 6, false], 16, '1', this.decrease_hour.bind(this, 1), QE.COLOR_RED);
        hour_row.add_button([4 / 6, 5 / 6, false], 16, '1', this.increase_hour.bind(this, 1), QE.COLOR_GREEN);
        hour_row.add_button([5 / 6, 1, false], 16, '5', this.increase_hour.bind(this, 5), QE.COLOR_GREEN);

        // Minute.
        this.wall_time_selector.add_row(null).add_text_2D([0, 1], 16, 'minute');
        let minute_row = this.wall_time_selector.add_row(null);

        this.minute = minute_row.add_text_2D([1 / 3, 2 / 3, CENTER_ABSOLUTE], 16, get_current_minute());

        minute_row.add_button([0, 1 / 9, false], 16, '10', this.decrease_minute.bind(this, 10), QE.COLOR_RED);
        minute_row.add_button([1 / 9, 2 / 9, false], 16, '5', this.decrease_minute.bind(this, 5), QE.COLOR_RED);
        minute_row.add_button([2 / 9, 3 / 9, false], 16, '1', this.decrease_minute.bind(this, 1), QE.COLOR_RED);
        minute_row.add_button([6 / 9, 7 / 9, false], 16, '1', this.increase_minute.bind(this, 1), QE.COLOR_GREEN);
        minute_row.add_button([7 / 9, 8 / 9, false], 16, '5', this.increase_minute.bind(this, 5), QE.COLOR_GREEN);
        minute_row.add_button([8 / 9, 1, false], 16, '10', this.increase_minute.bind(this, 10), QE.COLOR_GREEN);

        this.refresh_time_selector();

        this.wall_time_selector.add_row(null).add_button([0, 1, false], 16, 'set to no value', this.time_selected.bind(this, null, null), QE.COLOR_RED);
        this.wall_time_selector.add_row(null).add_button([0, 1, false], 16, 'set time', this.time_selected.bind(this, this.hour, this.minute), QE.COLOR_GREEN);

        return this;
    },

    refresh_time_selector: function() {
        // Get the current time for placeholder values.
        let current_time = new Date();
        let current_hour = current_time.getHours();
        let current_minute = current_time.getMinutes();
        this.hour.update_text(current_hour);
        this.minute.update_text(current_minute);
    },

    decrease_hour: function(delta) {
        let current_hour = parseInt(this.hour.get_text());
        if (current_hour - delta > -1) {
            current_hour -= delta;
        }
        this.hour.update_text(current_hour);
    },

    increase_hour: function(delta) {
        let current_hour = parseInt(this.hour.get_text());
        if (current_hour + delta < 24) {
            current_hour += delta;
        }
        this.hour.update_text(current_hour);
    },

    decrease_minute: function(delta) {
        let current_minute = parseInt(this.minute.get_text());
        if (current_minute - delta > -1) {
            current_minute -= delta;
        }
        this.minute.update_text(current_minute);
    },

    increase_minute: function(delta) {
        let current_minute = parseInt(this.minute.get_text());
        if (current_minute + delta < 60) {
            current_minute += delta;
        }
        this.minute.update_text(current_minute);
    }
};