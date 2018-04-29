'use strict';

function FakeFloatingWall(width, height, position, normal, world) {
    this.__init__(width, height, position, normal, world);
}

FakeFloatingWall.prototype = {

    __init__: function (width, height, position, normal, world) {
        // Inherit from Attachmentable.
        Attachmentable.call(this, world);
        // Inherit from Animatable.
        Animatable.call(this);

        this.width = width;
        this.height = height;

        if (is_defined(normal)) {
            this.set_normal(normal.x, normal.y, normal.z, false);
        }
        if (is_defined(position)) {
            this.set_position(position.x, position.y, position.z, false);
        }

        // Inherit from Visibility.
        Visibility.call(this);

        this.rows = [];
    },

    /* ___       __       ___         __                          __                __     ___  ___     ___
      |__  |    /  \  /\   |  | |\ | / _`    |  |  /\  |    |    /__`     /\  |\ | |  \     |  |__  \_/  |
      |    |___ \__/ /~~\  |  | | \| \__>    |/\| /~~\ |___ |___ .__/    /~~\ | \| |__/     |  |___ / \  |  */
    add_close_button: function() {
        var one_pixel_width = 1 / this.width;
        var x_start = 1 - (one_pixel_width * 16);
        var x_stop = 1;
        var total_percentage_of_parent_width = (x_stop - x_start);
        var close_button = new FloatingIconButton(this.world, ICON_CROSS, 16, this.force_hide_self_and_all_child_attachments_recursively.bind(this));
        close_button.set_attachment_vertical_offset(-8, HALF);
        close_button.set_attachment_horizontal_offset(0, -HALF + x_start + total_percentage_of_parent_width / 2);
        close_button.set_attachment_depth_offset(2);
        close_button.attach_to(this);
    },

    add_attachment_to_bottom: function(floating_element) {
        var height = floating_element.height;
        floating_element.set_attachment_vertical_offset(height / 2, -HALF);
        floating_element.set_attachment_depth_offset(1);
        floating_element.attach_to(this);
    },

    /*__   __           __   __   ___  __       ___    __        __  
     |__) /  \ |  |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__` 
     |  \ \__/ |/\|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */
    display_rows: function() {
        for (var r = 0; r < this.rows.length; r++) {
            var row = this.rows[r];
            if (!row.row_hidden) {
                row.display();
            }
        }
    },

    recalculate_row_offsets: function() {
        var previous_row = null;
        var total_vertical_height = 0;
        for (var r = 0; r < this.rows.length; r++) {
            var row = this.rows[r];
            if (!row.row_hidden) {
                row.set_row_vertical_position(total_vertical_height);
                total_vertical_height += row.get_height();
            }
        }
    },

    _get_all_rows_with_index_equal_to_or_greater: function(row_index) {
        var local_rows = [];
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number >= row_index) {
                local_rows.push(this.rows[r]);
            }
        }
        return local_rows;
    },

    _get_max_row_number: function() {
        var max_row = -1;
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number > max_row) {
                max_row = this.rows[r].row_number;
            }
        }
        return max_row;
    },

    get_row_with_index: function(index) {
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number === index) {
                return this.rows[r];
            }
        }
        return null;
    },

    get_row_with_name: function(name) {
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_name === name) {
                return this.rows[r];
            }
        }
        return null;
    },

    has_row_with_name: function(name) {
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_name === name) {
                return true;
            }
        }
        return false;
    },

    add_row: function(row_index, row_name) {
        if (!is_defined(row_index)) {
            row_index = this._get_max_row_number() + 1;
        } else {
            // Check if any existing rows need to be shifted down.
            var all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(row_index);
            for (var r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_down();
            }
        }

        // Now create the new row.
        var floating_row = new FloatingRow(this, row_index, row_name);
        this.rows.push(floating_row);

        return floating_row;
    },

    delete_row_by_index: function(row_index) {
        var row_to_delete = -1;
        var deleted_rows_index = null;
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number === row_index) {
                row_to_delete = r;
                deleted_rows_index = this.rows[r].row_number;
                break;
            }
        }
        if (row_to_delete !== NOT_FOUND) {
            this.rows[r].delete_all_elements();
            this.rows.splice(row_to_delete, 1);
            // Check if any existing rows need to be shifted up.
            var all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(deleted_rows_index);
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_up();
            }
        }
    },

    delete_row_by_name: function(row_name) {
        var row_to_delete = -1;
        var deleted_rows_index = null;
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_name === row_name) {
                row_to_delete = r;
                deleted_rows_index = this.rows[r].row_number;
                break;
            }
        }
        if (row_to_delete !== NOT_FOUND) {
            this.rows[r].delete_all_elements();
            this.rows.splice(row_to_delete, 1);
            // Check if any existing rows need to be shifted up.
            var all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(deleted_rows_index);
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_up();
            }
        }
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    has_3D_rows: function() {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].get_all_elements_with_tag(SAVE_TAG_3D_ROW).length > 0) {
                return true;
            }
        }
        return false;
    }
};