'use strict';

const COLORS = get_color_range_list(COLOR_FLOATING_WALL_BASE, COLOR_FLOATING_WALL_TOP, 8);

function FloatingWall(width, height, position, normal, world, scalable) {
    this.__init__(width, height, position, normal, world, scalable);
}

FloatingWall.prototype = {

    __init__: function (width, height, position, normal, world, scalable) {
        // Inherit from Attachmentable.
        Attachmentable.call(this, world);
        // Inherit from Animatable.
        Animatable.call(this);

        this.width = width;
        this.height = height;

        this._create_base_wall();

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

        if (this.scalable) {
            this.engable = false;
        }

        // TODO : Double check this design.
        this.current_cursor = null;
        this.player_horizontal_distance_to_wall_center_liner = null;
        this.player_previous_y_position = null;
        this.previous_cursor_y_position = null;

        this.default_background_color = COLOR_FLOATING_WALL_BASE;

        //this.make_base_wall_visible();
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

    _create_base_wall: function() {
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

    /*

    // TODO : NEED TO REFORMAT THIS FUNCTION! Potentially move all the logic to the Cursor class.
    perform_action: function(cursor_type) {
        // TODO : Clean up this function later on.

        //var old_cursor_position = MANAGER_WORLD.current_world.floating_cursor.get_position();
        var new_cursor_position = this.get_player_look_at_infinite_plane_intersection_point();
        //l('The new cursor position is :');
        //l(new_cursor_position);
        MANAGER_WORLD.current_floating_cursor.set_position(new_cursor_position);
        var cursor_position = MANAGER_WORLD.current_floating_cursor.get_position();

        if (cursor_type === CURSOR_TYPE_HORIZONTAL) {

            var new_width_percentage = (this._get_horizontal_distance_to_center(cursor_position.x, cursor_position.z) / this.width) * 2;
            this._update_width(new_width_percentage);

        } else if (cursor_type === CURSOR_TYPE_VERTICAL) {

            var new_height_percentage = (((this.object3D.position.y + this.height / 2) - cursor_position.y) / this.height);
            if (new_height_percentage < 0) {
                new_height_percentage *= -1;
                new_height_percentage += 1;
            } else if (new_height_percentage < .25) {
                new_height_percentage = 1 - new_height_percentage;
            }
            this._update_height(new_height_percentage);

        } else if (cursor_type === CURSOR_TYPE_MOUSE) {

            var player_position = CURRENT_PLAYER.get_position();

            var y_offset = 0;
            var current_floating_cursor_y = MANAGER_WORLD.current_floating_cursor.get_position().y;
            if (this.previous_cursor_y_position === null) {
                this.previous_cursor_y_position = current_floating_cursor_y;
            } else if (this.previous_cursor_y_position !== current_floating_cursor_y) {
                // TODO : Temporary fix.
                if (!MANAGER_INPUT.space && !MANAGER_INPUT.shift) {
                    y_offset += current_floating_cursor_y - this.previous_cursor_y_position;
                }
                this.previous_cursor_y_position = current_floating_cursor_y;
            }
            //if (MANAGER_WORLD.current_floating_cursor.get_position().y - )

            if (!is_defined(this.player_horizontal_distance_to_wall_center_liner)) {
                this.player_horizontal_distance_to_wall_center_liner = this._get_horizontal_distance_to_center(player_position.x, player_position.z);
            }
            if (!is_defined(this.player_previous_y_position)) {
                this.player_previous_y_position = player_position.y;
            } else {
                y_offset += player_position.y - this.player_previous_y_position;
                this.player_previous_y_position = player_position.y;
            }

            var player_normal = CURRENT_PLAYER.get_direction();
            var reverse_player_normal = new THREE.Vector3(player_normal.x * -1, 0, player_normal.z * -1);
            this.update_normal(reverse_player_normal);
            //this.update_position_with_offset_xyz(0, y_offset, 0);

            var new_position = new THREE.Vector3(player_position.x + player_normal.x * this.player_horizontal_distance_to_wall_center_liner, this.object3D.position.y, player_position.z + player_normal.z * this.player_horizontal_distance_to_wall_center_liner);

            this.update_position_with_offset_xyz(new_position.x - this.x_without_normal, new_position.y - this.y_without_normal + y_offset, new_position.z - this.z_without_normal);
        }

        //this.update_position_and_normal_for_all_floating_text();
        //for (var j = 0; j < this.all_floating_walls.length; j++) {
        //    this.all_floating_walls[j].update_position_and_normal_for_all_floating_text();
        //}

        this.update_position_and_normal_for_all_floating_text_recursively();
    },

    // TODO : Verify that this function works with the rest of this class.
    set_position_and_normal: function(p, n, no_depth) {

        // TODO : Improve design of this function.

        var depth = true;
        if (is_defined(no_depth)) {
            depth = !no_depth;
        }
        if (depth) {
            this.update_normal(n);
            this.object3D.position.set(p.x + this.normal.x * this.normal_depth, p.y + this.normal.y * this.normal_depth, p.z + this.normal.z * this.normal_depth);
            this.x_without_normal = this.object3D.position.x - this.normal.x * this.normal_depth;
            this.y_without_normal = this.object3D.position.y - this.normal.y * this.normal_depth;
            this.z_without_normal = this.object3D.position.z - this.normal.z * this.normal_depth;
        } else {
            this.object3D.position.set(p.x, p.y, p.z);
            this.x_without_normal = this.object3D.position.x;
            this.y_without_normal = this.object3D.position.y;
            this.z_without_normal = this.object3D.position.z;
            this.update_normal(n);
        }

        this.object3D.lookAt(new THREE.Vector3(this.object3D.position.x + this.normal.x * 100, this.object3D.position.y + this.normal.y * 100, this.object3D.position.z + this.normal.z * 100));

        this.update_position_and_normal_for_all_floating_text_recursively();
    },

    update_position_with_offset_xyz: function(x, y, z) {
        // TODO : Optimize later.

        if (this.hasOwnProperty('parent_floating_wall') || this.hasOwnProperty('pfw_button')) {
            // Follows add_floating_wall_to_center_of_position
            if (this.hasOwnProperty('pfw_button')) {
                var button = this['pfw_button'].get_position();
                //  var floating_wall = this.add_floating_wall_to_center_of_position(width, height, new THREE.Vector3(button_position.x, button_position.y, button_position.z), scalable);
                this.object3D.position.set(button.x + this.normal.x * this.normal_depth, button.y + this.normal.y * this.normal_depth, button.z + this.normal.z * this.normal_depth);

                this.x_without_normal = this.object3D.position.x - this.normal.x * this.normal_depth;
                this.y_without_normal = this.object3D.position.y - this.normal.y * this.normal_depth;
                this.z_without_normal = this.object3D.position.z - this.normal.z * this.normal_depth;
            }

        } else {
            this.object3D.position.x = this.x_without_normal + x + this.normal.x * this.normal_depth;
            this.object3D.position.y = this.y_without_normal + y + this.normal.y * this.normal_depth;
            this.object3D.position.z = this.z_without_normal + z + this.normal.z * this.normal_depth;

            this.x_without_normal = this.object3D.position.x - this.normal.x * this.normal_depth;
            this.y_without_normal = this.object3D.position.y - this.normal.y * this.normal_depth;
            this.z_without_normal = this.object3D.position.z - this.normal.z * this.normal_depth;
        }

        for (var j = 0; j < this.all_floating_walls.length; j++) {
            this.all_floating_walls[j].update_position_with_offset_xyz(x, y, z);
        }
    },

    */

    /*
    _dimensions_changed: function(is_width, new_percentage) {
        if (this.scalable) {
            this._create_base_wall();

            for (var f = 0; f < this.all_floating_2d_texts.length; f++) {
                if (is_width) {
                    this.all_floating_2d_texts[f]._update_width(new_percentage);
                } else {
                    this.all_floating_2d_texts[f]._update_height(new_percentage);
                }
            }
        }

        var all_floating_walls = this.get_all_floating_wall_children_recursively();
        for (var w = 0; w < all_floating_walls.length; w++) {
            if (all_floating_walls[w].scalable) {
                if (is_width) {
                    this.all_floating_walls[f]._update_width(new_percentage);
                } else {
                    this.all_floating_walls[w]._update_height(new_percentage);
                }
            }
        }
    },

    _update_height: function(new_height_percentage) {
        this.height *= new_height_percentage;
        this._dimensions_changed(false, new_height_percentage);
    },

    _update_width: function(new_width_percentage) {
        this.width *= new_width_percentage;
        this._dimensions_changed(true, new_width_percentage);
    },

    clear_inputs: function() {
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            if (this.all_floating_2d_texts[i].type === TYPE_INPUT || this.all_floating_2d_texts[i].type === TYPE_PASSWORD) {
                this.all_floating_2d_texts[i].clear();
            }
        }
    },
    */

    /* ___       __       ___         __                          __                __     ___  ___     ___
      |__  |    /  \  /\   |  | |\ | / _`    |  |  /\  |    |    /__`     /\  |\ | |  \     |  |__  \_/  |
      |    |___ \__/ /~~\  |  | | \| \__>    |/\| /~~\ |___ |___ .__/    /~~\ | \| |__/     |  |___ / \  |  */
    add_close_button: function() {
        var one_pixel_width = 1 / this.width;
        this.close_button = this.add_row_2D_text([1 - (one_pixel_width * 16), 1], 0, ICON_CROSS, TYPE_ICON);
        this.close_button.set_attachment_depth_offset(2);
        this.close_button.set_engage_function(this.set_to_invisible.bind(this));
        return this.close_button;
    },

    /*     __   __      __   __        __
      /\  |  \ |  \    |__) /  \ |  | /__`
     /~~\ |__/ |__/    |  \ \__/ |/\| .__/ */
    add_row_3D_text: function(centered, row, text, type) {
        var floating_3D_text = new Floating3DText(text, type, this.world);

        if (centered) {
            floating_3D_text.set_attachment_horizontal_offset(0, 0);
        } else {
            floating_3D_text.set_attachment_horizontal_offset(0, -HALF);
        }

        // TODO : WARNING : Fix row height at some point.
        floating_3D_text.set_attachment_vertical_offset(-16 + -32 * row, HALF);

        floating_3D_text.attach_to(this);
        return floating_3D_text;
    },

    add_row_2D_text: function(x_start_and_stop, row, text, type, syntax_checks) {
        var total_percentage_of_parent_width = (x_start_and_stop[1] - x_start_and_stop[0]);
        var floating_2D_text_width = this.width * total_percentage_of_parent_width;
        var floating_2D_text = new Floating2DText(floating_2D_text_width, text, type, this.world, syntax_checks);

        floating_2D_text.set_attachment_depth_offset(1);
        floating_2D_text.set_attachment_horizontal_offset(0, -HALF + x_start_and_stop[0] + total_percentage_of_parent_width / 2);

        // TODO : WARNING : For now every row is set to 16 height distance. This should eventually be made to allow for dynamic row heights.
        floating_2D_text.set_attachment_vertical_offset(-8 + -16 * row, HALF);

        floating_2D_text.attach_to(this);

        return floating_2D_text;
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

    wheel_event: function(delta) {
        if (delta === 1) {
            this.player_horizontal_distance_to_wall_center_liner *= 1.1;
        } else if (delta == -1) {
            this.player_horizontal_distance_to_wall_center_liner *= .9;
        }
    },

    // TODO : Reformat this!
    cursor_action_disengaged: function() {
        //MANAGER_WORLD.current_floating_cursor.disengage();
        this.player_horizontal_distance_to_wall_center_liner = null;
        this.previous_cursor_y_position = null;
        this.player_previous_y_position = null;
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    get_position_for_row: function (x_offset, y_offset, z_offset) {
        return new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z + z_offset);
    },

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

    /* __                  ___           ___  ___  __   __   ___  __  ___    __                     ___
      |__) |     /\  |\ | |__     | |\ |  |  |__  |__) /__` |__  /  `  |  | /  \ |\ |     |\/|  /\   |  |__|
      |    |___ /~~\ | \| |___    | | \|  |  |___ |  \ .__/ |___ \__,  |  | \__/ | \|     |  | /~~\  |  |  | */
    // TODO : REFACTOR INTO MATH UTILITIES!!!

    get_parametric_equation: function() {
        return [this.normal.x, this.normal.y, this.normal.z, this.normal.x * this.object3D.position.x + this.normal.y * this.object3D.position.y + this.normal.z * this.object3D.position.z];
    },

    // TODO : This will only work for walls that have a y normal of 0.
    _is_point_inside_floating_wall: function(x, y, z) {
        // TODO : Simplify later.
        if (this.object3D.position.y + this.height / 2 < y) {
            return false;
        }
        if (this.object3D.position.y - this.height / 2 > y) {
            return false;
        }
        return this.get_horizontal_distance_to_center(x, z) <= this.width / 2;
    },

    _calculate_t_value: function(player_parametric_equation) {
        var floating_wall_parametric_equation = this.get_parametric_equation();
        const INDEX_OF_POSITION = 0;
        const INDEX_OF_DIRECTION = 1;
        var line_x0 = player_parametric_equation[0][INDEX_OF_POSITION];
        var line_y0 = player_parametric_equation[1][INDEX_OF_POSITION];
        var line_z0 = player_parametric_equation[2][INDEX_OF_POSITION];
        var line_nx = player_parametric_equation[0][INDEX_OF_DIRECTION];
        var line_ny = player_parametric_equation[1][INDEX_OF_DIRECTION];
        var line_nz = player_parametric_equation[2][INDEX_OF_DIRECTION];
        var plane_nx = floating_wall_parametric_equation[0];
        var plane_ny = floating_wall_parametric_equation[1];
        var plane_nz = floating_wall_parametric_equation[2];
        var plane_d  = floating_wall_parametric_equation[3];
        return (plane_d - plane_nx * line_x0 - plane_ny * line_y0 - plane_nz * line_z0) / (plane_nx * line_nx + plane_ny * line_ny + plane_nz * line_nz);
    },

    get_player_look_at_infinite_plane_intersection_point: function() {
        var player_parametric_equation = CURRENT_PLAYER.get_parametric_equation();
        var t = this._calculate_t_value(player_parametric_equation);
        var intersection_values = CURRENT_PLAYER.get_parametric_value(t);
        return new THREE.Vector3(intersection_values[0], intersection_values[1], intersection_values[2]);
    },

    get_player_look_at_intersection_point: function(player_parametric_equation) {
        var t = this._calculate_t_value(player_parametric_equation);
        if (t < 0) {
            return false;
        }
        var intersection_values = CURRENT_PLAYER.get_parametric_value(t);
        if (!this._is_point_inside_floating_wall(intersection_values[0], intersection_values[1], intersection_values[2])) {
            return false;
        }
        // Also add the cursor type needed.
        var cursor_position = new THREE.Vector3(intersection_values[0], intersection_values[1], intersection_values[2]);
        var c = this.get_required_cursor(cursor_position);
        return [cursor_position, c];
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
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
            //MANAGER_WORLD.current_floating_cursor.engage();
        } else {
            this.current_background_color = this.default_background_color;
            // TODO : Refresh command.
            //this.refresh();

            //l('Floating wall disengage!');

            if (MANAGER_WORLD.current_floating_cursor.engaged) {
                l('disengage the cursor!');
                MANAGER_WORLD.current_floating_cursor.disengage();
            }
        }
        this.refresh();
    },

    state_change_engage: function(being_engaged_with) {
        if (being_engaged_with) {
            this.set_background_color(COLOR_FLOATING_WALL_HIGHLIGHT);
            //MANAGER_WORLD.current_floating_cursor.engage();
        } else {
            this.current_background_color = this.default_background_color;
        }
        this.refresh();
    }

};