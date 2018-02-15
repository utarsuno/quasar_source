'use strict';

const COLORS = get_color_range_list(COLOR_FLOATING_WALL_BASE, COLOR_FLOATING_WALL_TOP, 8);

function FloatingWall(width, height, position, normal, world, scalable, default_background_color) {
    this.__init__(width, height, position, normal, world, scalable, default_background_color);
}

FloatingWall.prototype = {

    __init__: function (width, height, position, normal, world, scalable, default_background_color) {
        // Inherit from Attachmentable.
        Attachmentable.call(this, world);
        // Inherit from Animatable.
        Animatable.call(this);

        this.width = width;
        this.height = height;

        this.auto_adjust_height = false;

        this.create_base_mesh();

        if (is_defined(normal)) {
            this.set_normal(normal.x, normal.y, normal.z, false);
        }
        if (is_defined(position)) {
            this.set_position(position.x, position.y, position.z, false);
        }

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.scalable = scalable;
        if (!is_defined(this.scalable)) {
            this.scalable = false;
        }

        this.world.interactive_objects.push(this);
        this.engable = false;
        if (!this.scalable) {
            this.only_used_for_blocking_input = true;
        }

        if (is_defined(default_background_color)) {
            this.default_background_color = default_background_color;
        } else {
            this.default_background_color = COLOR_FLOATING_WALL_BASE;
        }
        this.set_background_color(this.default_background_color, true);

        //this.make_base_wall_visible();

        this.rows = [];

        // Inherit from Saveable but set to false by default.
        Saveable.call(this, ENTITY_TYPE_WALL);
        this.saveable = false;
        this.add_save_field(ENTITY_PROPERTY_WIDTH);
        this.add_save_field(ENTITY_PROPERTY_HEIGHT);
        this.add_save_field(ENTITY_PROPERTY_POSITION);
        this.add_save_field(ENTITY_PROPERTY_NORMAL);
        this.add_save_field(ENTITY_PROPERTY_IS_ROOT_ATTACHABLE);
        // TODO : REFACTOR THIS!!!
        this.add_save_field(ENTITY_PROPERTY_3D_ROWS);
        //this.add_save_field(ENTITY_PROPERTY_2D_ROWS);
    },

    load_from_entity_data: function(entity) {
        this.set_entity(entity);
        this.width = this.get_value(ENTITY_PROPERTY_WIDTH);
        this.height = this.get_value(ENTITY_PROPERTY_HEIGHT);
        var position = this.get_value(ENTITY_PROPERTY_POSITION);
        var normal = this.get_value(ENTITY_PROPERTY_NORMAL);
        this.set_position(position.x, position.y, position.z);
        this.set_normal(normal.x, normal.y, normal.z);
        this.dimensions_changed();

        var rows_3D = this.get_value(ENTITY_PROPERTY_3D_ROWS);
        // INDEX --> 0 - row_number, 1 - text, 2 - type
        if (rows_3D !== NO_SAVE_DATA) {
            var rows_3D_to_load = [];
            // Check if there is only a single row or multiple.
            if (rows_3D.indexOf('@') === NOT_FOUND) {
                // Single row.
                rows_3D_to_load.push(rows_3D);
            } else {
                // Multiple.
                rows_3D_to_load = rows_3D.split('@');
            }
            for (var r = 0; r < rows_3D_to_load.length; r++) {
                var data = rows_3D_to_load[r].split('+');
                if (is_string(data[0])) {
                    this.add_full_row_3D(parseInt(data[0]), data[1], data[2]);
                } else {
                    this.add_full_row_3D(data[0], data[1], data[2]);
                }
            }
        }
    },

    auto_adjust_height_if_needed: function() {
        if (this.auto_adjust_height) {
            var height_needed = (this._get_max_row_number() + 1) * 16;
            if (this.height !== height_needed) {
                this.set_new_height(height_needed);
                this.refresh_position_and_look_at();
            }
        }
    },

    set_auto_adjust_height: function(auto_adjust) {
        this.auto_adjust_height = auto_adjust;
    },

    make_base_wall_invisible: function() {
        this._make_base_wall_visible = false;
        if (is_defined(this.mesh)) {
            this.mesh.visible = false;
        }
    },

    make_base_wall_visible: function() {
        this._make_base_wall_visible = true;
        if (is_defined(this.mesh)) {
            this.mesh.visible = true;
        }
    },

    create_base_mesh: function() {
        // Check if the there is an existing wall that needs to be fully cleaned up.
        // TODO : Refactor this!!!
        //this.resource_cleanup();

        if (!is_defined(this.material)) {
            this.material = new THREE.MeshBasicMaterial({
                // TODO : THE COLOR IS TEMPORARY!!!
                color: COLORS[0],
                //transparent: true,
                //opacity: 0.85,
                side: THREE.DoubleSide
            });
        }

        // Now re-create the base wall.
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        //if (!this._make_base_wall_visible) {
        //    this.mesh.visible = false;
        //}
        this.object3D.add(this.mesh);
    },

    /* ___       __       ___         __                          __                __     ___  ___     ___
      |__  |    /  \  /\   |  | |\ | / _`    |  |  /\  |    |    /__`     /\  |\ | |  \     |  |__  \_/  |
      |    |___ \__/ /~~\  |  | | \| \__>    |/\| /~~\ |___ |___ .__/    /~~\ | \| |__/     |  |___ / \  |  */
    add_close_button: function() {
        var one_pixel_width = 1 / this.width;
        var x_start = 1 - (one_pixel_width * 16);
        var x_stop = 1;
        var total_percentage_of_parent_width = (x_stop - x_start);
        var close_button_width = this.width * total_percentage_of_parent_width;
        this.close_button = new Floating2DText(close_button_width, ICON_CROSS, TYPE_ICON, this.world);

        this.close_button.set_attachment_vertical_offset(-8, HALF);
        this.close_button.set_attachment_horizontal_offset(0, -HALF + x_start + total_percentage_of_parent_width / 2);
        this.close_button.set_attachment_depth_offset(2);
        this.close_button.engable = false;

        this.close_button.attach_to(this);

        this.close_button.set_engage_function(this.force_hide_self_and_all_child_attachments_recursively.bind(this));

        this.world.interactive_objects.push(this.close_button);

        return this.close_button;
    },

    /*__   __           __   __   ___  __       ___    __        __  
     |__) /  \ |  |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__` 
     |  \ \__/ |/\|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */
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

        this.auto_adjust_height_if_needed();
        return floating_row;
    },

    // This utility function is used for creating a single row that contains a single 3D element.
    add_full_row_3D: function(row_index, text, type, color) {
        var current_row = this.add_row(row_index);
        current_row.add_3D_element(text, type, color);

        this.auto_adjust_height_if_needed();
        return current_row;
    },

    // This utility function is used for creating a single row that contains a single 2D element that spans the entire width.
    add_full_row_2D: function(row_index, text, type, color, syntax_checks) {
        if (!is_defined(row_index)) {
            row_index = this._get_max_row_number() + 1;
        }
        var current_row = this.add_row(row_index);
        current_row.add_2D_element([0, 1], text, type, color, syntax_checks);

        this.auto_adjust_height_if_needed();
        return current_row;
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

        this.auto_adjust_height_if_needed();
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

        this.auto_adjust_height_if_needed();
    },

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

    /*     __   __       ___  ___                         ___  __
     |  | |__) |  \  /\   |  |__     \  /  /\  |    |  | |__  /__`
     \__/ |    |__/ /~~\  |  |___     \/  /~~\ |___ \__/ |___ .__/ */
    set_background_color: function(c) {
        if (is_list(c)) {
            c = c[COLOR_HEX_INDEX];
        }
        //l('Setting floating wall background color to : ' + c);
        this.material.color.setHex(c);
        this.material.needsUpdate = true;
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    get_3D_rows_save_data: function() {
        var save_data = '';
        var add_seperator = false;
        for (var r = 0; r < this.rows.length; r++) {
            var data = this.rows[r].get_3D_rows_save_data();
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
    },

    has_3D_rows: function() {
        for (var r = 0; r < this.rows.length; r++) {
            if (this.rows[r].get_all_elements_with_tag(SAVE_TAG_3D_ROW).length > 0) {
                return true;
            }
        }
        return false;
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    delete_mesh: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
    },

    full_remove: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
            // TODO : UPDATE THREE JS VERSION!
            //this.mesh.dispose();
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
        if (is_defined(this.material)) {
            this.material.dispose();
        }
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */

    // TODO : Perhaps add a border glow? Learn the 3rd party line api

    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            this.set_background_color(COLOR_FLOATING_WALL_HIGHLIGHT);
        } else {
            this.set_background_color(this.default_background_color);
        }
    },

    state_change_engage: function(being_engaged_with) {
        l('TODO : Floating wall state engage changed!')
    }

};