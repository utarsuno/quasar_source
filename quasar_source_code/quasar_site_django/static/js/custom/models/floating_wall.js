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

        this.world.interactive_objects.push(this.object3D);
        this.engable = false;
        this.only_used_for_blocking_input = true;

        if (is_defined(default_background_color)) {
            this.default_background_color = default_background_color;
        } else {
            this.default_background_color = COLOR_FLOATING_WALL_BASE;
        }
        this.set_background_color(this.default_background_color, true);

        //this.make_base_wall_visible();

        this._2D_rows = [];
        this._3D_rows = [];

        // Inherit from Saveable but set to false by default.
        Saveable.call(this, ENTITY_TYPE_WALL);
        this.saveable = false;
        this.add_save_field(ENTITY_PROPERTY_WIDTH);
        this.add_save_field(ENTITY_PROPERTY_HEIGHT);
        this.add_save_field(ENTITY_PROPERTY_POSITION);
        this.add_save_field(ENTITY_PROPERTY_NORMAL);
        this.add_save_field(ENTITY_PROPERTY_IS_ROOT_ATTACHABLE);
        this.add_save_field(ENTITY_PROPERTY_3D_ROWS);
        this.add_save_field(ENTITY_PROPERTY_2D_ROWS);
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
        this.close_button = this.add_row_2D_text([1 - (one_pixel_width * 16), 1], 0, ICON_CROSS, TYPE_ICON);
        this.close_button.set_attachment_depth_offset(2);
        this.close_button.engable = false;
        this.close_button.set_engage_function(this.hide_self_and_all_child_attachments_recursively.bind(this));

        this.world.interactive_objects.push(this.close_button);

        return this.close_button;
    },

    /*__   __           __   __   ___  __       ___    __        __  
     |__) /  \ |  |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__` 
     |  \ \__/ |/\|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */
    add_row_3D_text: function(centered, row, text, type, color) {
        var floating_3D_text = new Floating3DText(text, type, this.world);

        if (centered) {
            floating_3D_text.set_attachment_horizontal_offset(0, 0);
        } else {
            floating_3D_text.set_attachment_horizontal_offset(0, -HALF);
        }

        if (is_defined(color)) {
            floating_3D_text.set_default_color(color);
            floating_3D_text.set_color(color, true);
        }

        // TODO : WARNING : Fix row height at some point.
        floating_3D_text.set_attachment_vertical_offset(-16 + -32 * row, HALF);

        floating_3D_text.attach_to(this);

        // Needed for saving.
        this._3D_rows.push([row, centered, floating_3D_text]);

        return floating_3D_text;
    },

    add_row_2D_text: function(x_start_and_stop, row, text, type, syntax_checks, color) {
        var total_percentage_of_parent_width = (x_start_and_stop[1] - x_start_and_stop[0]);
        var floating_2D_text_width = this.width * total_percentage_of_parent_width;
        var floating_2D_text = new Floating2DText(floating_2D_text_width, text, type, this.world, syntax_checks);

        if (is_defined(color)) {
            floating_2D_text.set_default_color(color);
            floating_2D_text.set_color(color, true);
        }

        floating_2D_text.set_attachment_depth_offset(1);
        floating_2D_text.set_attachment_horizontal_offset(0, -HALF + x_start_and_stop[0] + total_percentage_of_parent_width / 2);

        // TODO : WARNING : For now every row is set to 16 height distance. This should eventually be made to allow for dynamic row heights.
        floating_2D_text.set_attachment_vertical_offset(-8 + -16 * row, HALF);

        floating_2D_text.attach_to(this);

        // Needed for saving.
        this._2D_rows.push([row, x_start_and_stop[0], x_start_and_stop[1], floating_2D_text]);

        return floating_2D_text;
    },

    _delete_row: function(row) {
        var delete_index = -1;
        for (var r = 0; r < this._2D_rows.length; r++) {
            if (this._2D_rows[r] === row) {
                delete_index = r;
                break;
            }
        }
        this._2D_rows.splice(delete_index, 1);
    },

    delete_row: function(row) {
        var objects_to_delete = [];

        var row_objects_to_remove = [];

        for (var r = 0; r < this._2D_rows.length; r++) {
            if (this._2D_rows[r][0] === row) {
                objects_to_delete.push(this._2D_rows[r][3]);
                row_objects_to_remove.push(this._2D_rows);
            }
        }

        for (var d = 0; d < objects_to_delete.length; d++) {
            var sub_attachments = objects_to_delete[d]._get_all_attachments_recursively();
            for (var s = 0; s < sub_attachments.length; s++) {
                if (objects_to_delete.indexOf(sub_attachments[s]) === NOT_FOUND) {
                    objects_to_delete.push(sub_attachments[s]);
                }
            }
        }

        // Delete the rows.
        for (r = 0; r < row_objects_to_remove.length; r++) {
            this._delete_row(row_objects_to_remove[r]);
        }

        // Delete all objects.
        for (d = 0; d < objects_to_delete.length; d++) {
            this.world.remove_from_interactive_then_scene(objects_to_delete[d]);
            objects_to_delete[d].full_remove();
        }

        // Update the position of any rows below the deleted row.
        for (r = 0; r < this._2D_rows.length; r++) {
            if (this._2D_rows[r][0] > row) {
                this._2D_rows[r][0] -= 1;
                this._2D_rows[r][3].apply_delta_to_vertical_offset(8, null);
            }
        }

        // Perform a refresh.
        this.refresh_position_and_look_at();
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
    // TODO : Remove or re-format
    get_all_floating_2D_texts_with_property: function(property_name) {
        var floating_texts = [];
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            if (this.all_floating_2d_texts[i].hasOwnProperty(property_name)) {
                floating_texts.push(this.all_floating_2d_texts[i]);
            }
        }
        return floating_texts;
    },

    // TODO : Reformat this!
    get_all_floating_wall_children_recursively: function() {
        var all_wall_children = [];
        for (var w = 0; w < this.all_floating_walls.length; w++) {
            all_wall_children.push(this.all_floating_walls[w]);
            var all_sub_children = this.all_floating_walls[w].get_all_floating_wall_children_recursively();
            for (var s = 0; s < all_sub_children.length; s++) {
                all_wall_children.push(all_sub_children[s]);
            }
        }
        return all_wall_children;
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