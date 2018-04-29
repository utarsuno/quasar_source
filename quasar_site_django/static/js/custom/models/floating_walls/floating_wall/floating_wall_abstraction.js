'use strict';

function FloatingWallAbstract(width, height, position, normal, world) {

    // Inherit from Attachmentable.
    Attachmentable.call(this, world);
    // Inherit from Animatable.
    Animatable.call(this);

    this.width                = width;
    this.height               = height;
    this.rows                 = [];
    this._first_tab_target    = null;
    this._previous_tab_target = null;

    if (is_defined(normal)) {
        this.set_normal(normal.x, normal.y, normal.z, false);
    }
    if (is_defined(position)) {
        this.set_position(position.x, position.y, position.z, false);
    }

    this.set_to_singleton = function() {
        Singleton.call(this);
    };

    /* ___       __       ___         __                          __                __     ___  ___     ___
      |__  |    /  \  /\   |  | |\ | / _`    |  |  /\  |    |    /__`     /\  |\ | |  \     |  |__  \_/  |
      |    |___ \__/ /~~\  |  | | \| \__>    |/\| /~~\ |___ |___ .__/    /~~\ | \| |__/     |  |___ / \  |  */
    this.add_close_button = function() {
        let one_pixel_width = 1 / this.width;
        let x_start = 1 - (one_pixel_width * 16);
        let x_stop = 1;
        let total_percentage_of_parent_width = (x_stop - x_start);
        let close_button = new FloatingIconButton(this.world, ICON_CROSS, 16, this.force_hide_self_and_all_child_attachments_recursively.bind(this));
        close_button.set_attachment_vertical_offset(-8, HALF);
        close_button.set_attachment_horizontal_offset(0, -HALF + x_start + total_percentage_of_parent_width / 2);
        close_button.set_attachment_depth_offset(2);
        close_button.attach_to(this);
    };

    this.add_attachment_to_bottom = function(floating_element) {
        floating_element.set_attachment_vertical_offset(floating_element.height / 2, -HALF);
        floating_element.set_attachment_depth_offset(1);
        floating_element.attach_to(this);
    };

    /*__   __           __   __   ___  __       ___    __        __  
     |__) /  \ |  |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__` 
     |  \ \__/ |/\|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */
    this.display_rows = function() {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (!this.rows[r].row_hidden) {
                this.rows[r].display();
            }
        }
    };

    this.recalculate_row_offsets = function() {
        let previous_row = null;
        let total_vertical_height = 0;
        let r;
        for (r = 0; r < this.rows.length; r++) {
            let row = this.rows[r];
            if (!row.row_hidden) {
                row.set_row_vertical_position(total_vertical_height);
                total_vertical_height += row.get_height();
            }
        }
    };

    this._get_all_rows_with_index_equal_to_or_greater = function(row_index) {
        let local_rows = [];
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number >= row_index) {
                local_rows.push(this.rows[r]);
            }
        }
        return local_rows;
    };

    this._get_max_row_number = function() {
        let max_row = -1;
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number > max_row) {
                max_row = this.rows[r].row_number;
            }
        }
        return max_row;
    };

    this.get_row_with_index = function(index) {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number === index) {
                return this.rows[r];
            }
        }
        return null;
    };

    this.get_row_with_name = function(name) {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_name === name) {
                return this.rows[r];
            }
        }
        return null;
    };

    this.has_row_with_name = function(name) {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_name === name) {
                return true;
            }
        }
        return false;
    };

    this.add_row = function(row_index, row_name) {
        if (!is_defined(row_index)) {
            row_index = this._get_max_row_number() + 1;
        } else {
            // Check if any existing rows need to be shifted down.
            let all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(row_index);
            let r;
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_down();
            }
        }

        // Now create the new row.
        let floating_row = new FloatingRow(this, row_index, row_name);
        this.rows.push(floating_row);
        if (is_defined(this.auto_adjust_height_if_needed)) {
            this.auto_adjust_height_if_needed();
        }
        return floating_row;
    };

    this.delete_row_by_index = function(row_index) {
        let row_to_delete = -1;
        let deleted_rows_index = null;
        let r;
        for (r = 0; r < this.rows.length; r++) {
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
            let all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(deleted_rows_index);
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_up();
            }
        }

        if (is_defined(this.auto_adjust_height_if_needed)) {
            this.auto_adjust_height_if_needed();
        }
    };

    this.delete_row_by_name = function(row_name) {
        let row_to_delete = -1;
        let deleted_rows_index = null;
        let r;
        for (r = 0; r < this.rows.length; r++) {
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
            let all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(deleted_rows_index);
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_up();
            }
        }

        if (is_defined(this.auto_adjust_height_if_needed)) {
            this.auto_adjust_height_if_needed();
        }
    };

    /*__          __   ___  __      __   __        __
     /__` |    | |  \ |__  |__)    |__) /  \ |  | /__`
     .__/ |___ | |__/ |___ |  \    |  \ \__/ |/\| .__/ */

    /*
    slider_change: function(slider, delta) {
        var new_value = slider.get_text_as_value() + delta;
        slider.current_percentage = (new_value - slider.minimum_value) / (slider.maximum_value - slider.minimum_value);
        slider.update_text(new_value.toString());

        var max_one = ONE_THIRD;
        var min_max_width = 25 / this.width;
        var x_end = 1;

        //slider.pfw_x_start = ((x_end - max_one - min_max_width * 2) * slider.current_percentage) + (max_one);
        slider.pfw_x_start = (((x_end - min_max_width) - (max_one + min_max_width)) * slider.current_percentage) + (max_one + min_max_width);
        slider.pfw_x_end = slider.pfw_x_start + min_max_width;

        this.update_position_for_floating_2D_text(slider);
        CURRENT_PLAYER.look_at(slider.get_position());
    },

    slider_increased: function(slider) {
        if (slider.get_text_as_value() < slider.maximum_value) {
            this.slider_change(slider, 1);
        }
    },

    slider_decreased: function(slider) {
        if (slider.get_text_as_value() > slider.minimum_value) {
            this.slider_change(slider, -1);
        }
    },

    add_floating_slider: function(x_start, x_end, current_value, minimum_value, maximum_value, label, row) {

        // Determine the % width that 25 pixels will be.
        var min_max_width = 25 / this.width;

        // Label width will be 1/3 width.
        // Slider width will be the remaining 2/3 width.
        var label_width = (this.width * (x_end - x_start)) * ONE_THIRD;

        var max_one = x_end * ONE_THIRD;

        // Floating Label.
        var floating_label = new Floating2DText(label_width, label, TYPE_CONSTANT, this.world);
        floating_label.parent_floating_wall = this;
        floating_label.pfw_x_start = x_start;
        floating_label.pfw_x_end = max_one;
        floating_label.pfw_row = row;

        // TODO : Eventually the minimum and maximum label should just dynamically move out of the way if the slider objects overlaps with them.
        // TODO : For now make the minimum and maximum labels be transparent.

        // Minimum Value Label.
        var floating_minimum_label = new Floating2DText(25, minimum_value.toString(), TYPE_CONSTANT, this.world);
        floating_minimum_label.parent_floating_wall = this;
        floating_minimum_label.pfw_x_start = max_one;
        floating_minimum_label.pfw_x_end = max_one + min_max_width;
        floating_minimum_label.pfw_row = row;

        // Maximum Value Label.
        var floating_maximum_label = new Floating2DText(25, maximum_value.toString(), TYPE_CONSTANT, this.world);
        floating_maximum_label.parent_floating_wall = this;
        floating_maximum_label.pfw_x_start = x_end - min_max_width;
        floating_maximum_label.pfw_x_end = x_end;
        floating_maximum_label.pfw_row = row;

        // Slider object.
        var floating_slider = new Floating2DText(25, current_value.toString(), TYPE_CONSTANT, this.world);
        this.world.interactive_objects.push(floating_slider);
        floating_slider.parent_floating_wall = this;

        var current_percentage = (current_value - minimum_value) / (maximum_value - minimum_value);

        floating_slider.pfw_x_start = ((x_end - max_one - min_max_width * 2) * current_percentage) + (max_one);
        floating_slider.pfw_x_end = floating_slider.pfw_x_start + min_max_width;
        floating_slider.pfw_row = row;
        floating_slider.current_percentage = current_percentage;
        floating_slider.maximum_value = maximum_value;
        floating_slider.minimum_value = minimum_value;

        floating_slider.requires_mouse_x_movement = true;
        floating_slider.bind_slider_delta_x_functions(this.slider_increased.bind(this, floating_slider), this.slider_decreased.bind(this, floating_slider));

        this.update_position_and_normal_for_floating_2D_text(floating_label);
        this.update_position_and_normal_for_floating_2D_text(floating_minimum_label);
        this.update_position_and_normal_for_floating_2D_text(floating_maximum_label);
        this.update_position_and_normal_for_floating_2D_text(floating_slider);

        // Return the slider object so that a value changed function can be binded.
        return floating_slider;
    },
    */

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_3D_rows_save_data = function() {
        let save_data = '';
        let add_seperator = false;
        let r;
        for (r = 0; r < this.rows.length; r++) {
            let data = this.rows[r].get_3D_rows_save_data();
            if (data !== NO_SAVE_DATA) {
                if (add_seperator) {
                    save_data += '@';
                }
                save_data += data;
                if (!add_seperator) {
                    add_seperator = true;
                }
            }
        }
        if (save_data === '') {
            return NO_SAVE_DATA;
        }
        return save_data;
    };

    this.has_3D_rows = function() {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].get_all_elements_with_tag(SAVE_TAG_3D_ROW).length > 0) {
                return true;
            }
        }
        return false;
    };
}