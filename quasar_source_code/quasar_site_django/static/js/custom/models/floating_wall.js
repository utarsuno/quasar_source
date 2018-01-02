'use strict';

// var dates_in_future_colors = get_color_range_list(COLOR_SCHEDULE_PRESENT, COLOR_SCHEDULE_FUTURE, dates_in_future.length + 1);
const COLORS = get_color_range_list(COLOR_FLOATING_WALL_BASE, COLOR_FLOATING_WALL_TOP, 8);

function FloatingWall(width, height, position, normal, world, scalable, color_index) {
    this.__init__(width, height, position, normal, world, scalable, color_index);
}

FloatingWall.prototype = {

    __init__: function (width, height, position, normal, world, scalable, color_index) {
        this.all_floating_2d_texts          = [];
        this.all_floating_3D_texts          = [];
        this.all_floating_walls             = [];
        this.objects_to_remove_later        = [];
        this.floating_walls_to_remove_later = [];

        this.object3D = new THREE.Object3D();
        // Default value.
        this.normal_depth = 5;

        this.update_normal(normal);

        this.object3D.position.set(position.x + this.normal.x * this.normal_depth, position.y + this.normal.y * this.normal_depth, position.z + this.normal.z * this.normal_depth);
        this.x_without_normal = this.object3D.position.x - this.normal.x * this.normal_depth;
        this.y_without_normal = this.object3D.position.y - this.normal.y * this.normal_depth;
        this.z_without_normal = this.object3D.position.z - this.normal.z * this.normal_depth;

        this.width = width;
        this.height = height;

        this.world = world;
        this.scene = this.world.scene;

        if (!is_defined(color_index)) {
            this.color_index = 0;
        } else {
            this.color_index = color_index;
        }

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        // Base wall.
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = new THREE.MeshBasicMaterial({
            color: COLORS[this.color_index],
            //transparent: true,
            //opacity: 0.85,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        //this.wall_mesh.position.set(position.x - right_side.x, position.y - this.height / 2 - right_side.y, position.z - right_side.z);

        this.scalable = scalable;
        if (!is_defined(this.scalable)) {
            this.scalable = false;
        }

        // Used to determine what actions to be taking.
        this.current_cursor = null;

        this.object3D.add(this.mesh);
        this.scene.add(this.object3D);

        this.player_horizontal_distance_to_wall_center_liner = null;
        this.player_previous_y_position = null;




        this.previous_cursor_y_position = null;
    },

    perform_action: function(cursor_type) {
        // TODO : Clean up this function later on.

        //l('PERFORM AN ACTION PLZ');
        //l(cursor_type);

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

        this.update_position_and_normal_for_all_floating_text();
        for (var j = 0; j < this.all_floating_walls.length; j++) {
            this.all_floating_walls[j].update_position_and_normal_for_all_floating_text();
        }
    },

    update_position_and_normal_for_all_floating_text: function() {
        // TODO : Update position for all floating 3D text
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            this.update_position_and_normal_for_floating_2D_text(this.all_floating_2d_texts[i]);
        }
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

    _set_height: function(new_height) {
        this.height = new_height;

        this.object3D.remove(this.mesh);
        var new_geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.geometry.dispose();
        this.geometry = new_geometry;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    },

    _update_height: function(new_height_percentage) {
        this.height *= new_height_percentage;

        this.object3D.remove(this.mesh);
        var new_geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.geometry.dispose();
        this.geometry = new_geometry;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);

        for (var i = 0; i < this.all_floating_walls.length; i++) {
            if (this.all_floating_walls[i].scalable) {
                this.all_floating_walls[i]._update_height(new_height_percentage);
            }
        }

        // TODO : auto-scale floating 2d texts!
    },

    _update_width: function(new_width_percentage) {
        this.width *= new_width_percentage;

        this.object3D.remove(this.mesh);
        var new_geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.geometry.dispose();
        this.geometry = new_geometry;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);

        for (var i = 0; i < this.all_floating_walls.length; i++) {
            if (this.all_floating_walls[i].scalable) {
                this.all_floating_walls[i]._update_width(new_width_percentage);
            }
        }

        // TODO : auto-scale floating 2d texts!
    },

    add_3D_title: function(title_name, type, color, row) {
        if (is_defined(type)) {
            this.floating_3d_title = new Floating3DText(title_name, type, this.scene);
        } else {
            this.floating_3d_title = new Floating3DText(title_name, TYPE_TITLE, this.scene);
        }
        var x_shift = this.get_relative_x_shift(-1.0 * (this.floating_3d_title.width / 2.0));
        var additional_y_height = 0;
        if (is_defined(row)) {
            additional_y_height = this.floating_3d_title.height * row;
        }
        var y_position = this.get_position_for_row(x_shift.x, x_shift.y + this.floating_3d_title.height / 2 + additional_y_height, x_shift.z);
        this.floating_3d_title.update_position_and_normal(y_position, this.normal);
        if (is_defined(color)) {
            this.floating_3d_title.set_default_color(color);
        }
        this.add_additional_visibility_object(this.floating_3d_title);
        this.objects_to_remove_later.push(this.floating_3d_title);
    },

    /* ___       __       ___         __                          __                __     ___  ___     ___
      |__  |    /  \  /\   |  | |\ | / _`    |  |  /\  |    |    /__`     /\  |\ | |  \     |  |__  \_/  |
      |    |___ \__/ /~~\  |  | | \| \__>    |/\| /~~\ |___ |___ .__/    /~~\ | \| |__/     |  |___ / \  |  */
    add_close_button: function() {
        var one_pixel_width = 1 / this.width;
        this.close_button = this.add_floating_2d_text(1 - (one_pixel_width * 16), 1, ICON_CROSS, TYPE_BUTTON, 0);
        this.close_button.set_engage_function(this.close_button_pressed.bind(this));
        return this.close_button;
    },

    add_floating_wall_off_of_button: function(width, height, button, scalable) {
        var button_position = button.get_position();

        var floating_wall = this.add_floating_wall_to_center_of_position(width, height, new THREE.Vector3(button_position.x, button_position.y, button_position.z), scalable, this.color_index + 1);

        floating_wall.pfw_button = button;

        return floating_wall;
    },

    add_floating_wall_to_center_of_position: function(width, height, position, scalable, color_index) {
        var floating_wall_position = new THREE.Vector3(position.x, position.y, position.z);
        var floating_wall = new FloatingWall(width, height, floating_wall_position, this.normal, this.world, scalable, color_index);

        floating_wall.parent_floating_wall = this;
        floating_wall.pfw_width = width;
        floating_wall.pfw_height = height;
        floating_wall.pfw_position = position;

        // TODO : visibility for floating walls to remove
        this.floating_walls_to_remove_later.push(floating_wall);

        this.all_floating_walls.push(floating_wall);

        return floating_wall;
    },

    update_position_for_floating_2D_text: function(floating_2D_text) {
        var width;
        var x_offset;
        if (floating_2D_text.hasOwnProperty('pfw_fixed_width')) {
            width = floating_2D_text['pfw_fixed_width'];
            if (floating_2D_text['pfw_position_offset'] < 0) {
                floating_2D_text['pfw_position_offset'] = this.width + floating_2D_text['pfw_position_offset'];
            }
            x_offset = this.width * (floating_2D_text['pfw_position_offset'] / this.width);
        } else {
            width = this.width * (floating_2D_text['pfw_x_end'] - floating_2D_text['pfw_x_start']);
            x_offset = this.width * floating_2D_text['pfw_x_start'];
        }
        var additional_x_shift = 0;
        if (width < this.width) {
            additional_x_shift = -1.0 * ((1.0 - (width / this.width)) / 2.0) * this.width;
        }
        var relative_x_shift = this.get_relative_x_shift(x_offset + additional_x_shift);
        var y_position = this.get_y_position_for_row(floating_2D_text['pfw_row']);
        floating_2D_text.update_position(this.get_position_for_row(relative_x_shift.x, relative_x_shift.y + y_position, relative_x_shift.z));
    },

    update_position_and_normal_for_floating_2D_text: function(floating_2D_text) {
        var width;
        var x_offset;
        if (floating_2D_text.hasOwnProperty('pfw_fixed_width')) {
            width = floating_2D_text['pfw_fixed_width'];
            if (floating_2D_text['pfw_position_offset'] < 0) {
                floating_2D_text['pfw_position_offset'] = this.width + floating_2D_text['pfw_position_offset'];
            }
            x_offset = this.width * (floating_2D_text['pfw_position_offset'] / this.width);
        } else {
            width = this.width * (floating_2D_text['pfw_x_end'] - floating_2D_text['pfw_x_start']);
            x_offset = this.width * floating_2D_text['pfw_x_start'];
        }
        var additional_x_shift = 0;
        if (width < this.width) {
            additional_x_shift = -1.0 * ((1.0 - (width / this.width)) / 2.0) * this.width;
        }
        var relative_x_shift = this.get_relative_x_shift(x_offset + additional_x_shift);
        var y_position = this.get_y_position_for_row(floating_2D_text['pfw_row']);
        if (floating_2D_text.hasOwnProperty('additional_normal_offset')) {
            floating_2D_text.set_normal_depth(this.normal_depth + this.normal_depth + this['additional_normal_offset']);
        } else {
            floating_2D_text.set_normal_depth(this.normal_depth + this.normal_depth);
        }
        floating_2D_text.update_position_and_normal(this.get_position_for_row(relative_x_shift.x, relative_x_shift.y + y_position, relative_x_shift.z), this.normal);
    },

    add_floating_2d_text: function(x_start, x_end, text, type, row) {
        var floating_2d_text_width = this.width * (x_end - x_start);
        var floating_2D_text = new Floating2DText(floating_2d_text_width, text, type, this.scene);

        floating_2D_text.parent_floating_wall = this;
        floating_2D_text.pfw_x_start = x_start;
        floating_2D_text.pfw_x_end = x_end;
        floating_2D_text.pfw_row = row;

        this.update_position_and_normal_for_floating_2D_text(floating_2D_text);

        if (type === TYPE_INPUT_REGULAR || type === TYPE_INPUT_PASSWORD || type === TYPE_BUTTON || type === TYPE_TITLE) {
            floating_2D_text.is_in_interactive_list = true;
            this.world.interactive_objects.push(floating_2D_text);
        }

        this.add_additional_visibility_object(floating_2D_text);
        this.objects_to_remove_later.push(floating_2D_text);
        this.all_floating_2d_texts.push(floating_2D_text);

        return floating_2D_text;
    },

    /*__          __   ___  __      __   __        __
     /__` |    | |  \ |__  |__)    |__) /  \ |  | /__`
     .__/ |___ | |__/ |___ |  \    |  \ \__/ |/\| .__/ */

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
        var floating_label = new Floating2DText(label_width, label, TYPE_CONSTANT_TEXT, this.scene);
        floating_label.parent_floating_wall = this;
        floating_label.pfw_x_start = x_start;
        floating_label.pfw_x_end = max_one;
        floating_label.pfw_row = row;

        // TODO : Eventually the minimum and maximum label should just dynamically move out of the way if the slider objects overlaps with them.
        // TODO : For now make the minimum and maximum labels be transparent.

        // Minimum Value Label.
        var floating_minimum_label = new Floating2DText(25, minimum_value.toString(), TYPE_CONSTANT_TEXT, this.scene);
        floating_minimum_label.parent_floating_wall = this;
        floating_minimum_label.pfw_x_start = max_one;
        floating_minimum_label.pfw_x_end = max_one + min_max_width;
        floating_minimum_label.pfw_row = row;

        // Maximum Value Label.
        var floating_maximum_label = new Floating2DText(25, maximum_value.toString(), TYPE_CONSTANT_TEXT, this.scene);
        floating_maximum_label.parent_floating_wall = this;
        floating_maximum_label.pfw_x_start = x_end - min_max_width;
        floating_maximum_label.pfw_x_end = x_end;
        floating_maximum_label.pfw_row = row;

        // Slider object.
        var floating_slider = new Floating2DText(25, current_value.toString(), TYPE_CONSTANT_TEXT, this.scene);
        floating_slider.is_in_interactive_list = true;
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

        this.add_additional_visibility_object(floating_label);
        this.add_additional_visibility_object(floating_minimum_label);
        this.add_additional_visibility_object(floating_maximum_label);
        this.add_additional_visibility_object(floating_slider);

        this.objects_to_remove_later.push(floating_label);
        this.objects_to_remove_later.push(floating_minimum_label);
        this.objects_to_remove_later.push(floating_maximum_label);
        this.objects_to_remove_later.push(floating_slider);

        this.all_floating_2d_texts.push(floating_label);
        this.all_floating_2d_texts.push(floating_minimum_label);
        this.all_floating_2d_texts.push(floating_maximum_label);
        this.all_floating_2d_texts.push(floating_slider);

        // Return the slider object so that a value changed function can be binded.
        return floating_slider;
    },

    /*     __   __       ___  ___                         ___  __
     |  | |__) |  \  /\   |  |__     \  /  /\  |    |  | |__  /__`
     \__/ |    |__/ /~~\  |  |___     \/  /~~\ |___ \__/ |___ .__/ */
    update_normal: function(normal) {
        this.normal = new THREE.Vector3(normal.x, normal.y, normal.z);
        this.normal.normalize();
        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        this.object3D.lookAt(new THREE.Vector3(this.object3D.position.x + this.normal.x * 100, this.object3D.position.y + this.normal.y * 100, this.object3D.position.z + this.normal.z * 100));

        for (var j = 0; j < this.all_floating_walls.length; j++) {
            this.all_floating_walls[j].update_normal(normal);
        }
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    get_y_position_for_row: function (y_index) {
        if (y_index < 0) {
            y_index *= -1;
            var offset = (-16.0 / 2.0) * (1 + (2 * y_index));
            return -this.height + offset;
        }
        return (-16.0 / 2.0) * (1 + (2 * y_index));
    },

    // Shifts the left-right position (on the wall) of the object by the distance provided. Negative values go left, positive go right.
    get_relative_x_shift: function(distance) {
        return new THREE.Vector3(this.left_right.x * distance, this.left_right.y * distance, this.left_right.z * distance);
    },

    get_position_for_row: function (x_offset, y_offset, z_offset) {
        return new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z + z_offset);
    },

    _get_horizontal_distance_to_center: function(x, z) {
        return sqrt(squared(x - this.object3D.position.x) + squared(z - this.object3D.position.z));
    },

    get_required_cursor: function(cursor_position_vector) {
        var y_percentage = ((this.object3D.position.y + this.height / 2) - cursor_position_vector.y) / this.height;
        var horizontal_percentage = (this._get_horizontal_distance_to_center(cursor_position_vector.x, cursor_position_vector.z) / this.width);

        var vertical_scroll = false;
        var horizontal_scroll = false;

        if (y_percentage < 0.02 || y_percentage > 0.98) {
            vertical_scroll = true;
        }
        if (horizontal_percentage > .48) {
            horizontal_scroll = true;
        }
        if (vertical_scroll && horizontal_scroll) {
            return CURSOR_TYPE_LARGER;
        } else if (vertical_scroll) {
            return CURSOR_TYPE_VERTICAL;
        } else if (horizontal_scroll) {
            return CURSOR_TYPE_HORIZONTAL;
        } else {
            return CURSOR_TYPE_MOUSE;
        }
    },

    get_all_floating_2D_texts_with_property: function(property_name) {
        var floating_texts = [];
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            if (this.all_floating_2d_texts[i].hasOwnProperty(property_name)) {
                floating_texts.push(this.all_floating_2d_texts[i]);
            }
        }
        return floating_texts;
    },

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
    get_parametric_equation: function() {
        return [this.normal.x, this.normal.y, this.normal.z, this.normal.x * this.object3D.position.x + this.normal.y * this.object3D.position.y + this.normal.z * this.object3D.position.z];
    },

    _is_point_inside_floating_wall: function(x, y, z) {
        // TODO : Simplify later.
        if (this.object3D.position.y + this.height / 2 < y) {
            return false;
        }
        if (this.object3D.position.y - this.height / 2 > y) {
            return false;
        }
        return this._get_horizontal_distance_to_center(x, z) <= this.width / 2;
    },

    get_player_look_at_infinite_plane_intersection_point: function() {
        // TODO : Check if the player_parametric_equation can be passed in instead of re-calculated so often.
        var player_parametric_equation = CURRENT_PLAYER.get_parametric_equation();
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

        var t = (plane_d - plane_nx * line_x0 - plane_ny * line_y0 - plane_nz * line_z0) / (plane_nx * line_nx + plane_ny * line_ny + plane_nz * line_nz);

        var intersection_values = CURRENT_PLAYER.get_parametric_value(t);

        return new THREE.Vector3(intersection_values[0], intersection_values[1], intersection_values[2]);
    },

    get_player_look_at_intersection_point: function(player_parametric_equation) {
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

        var t = (plane_d - plane_nx * line_x0 - plane_ny * line_y0 - plane_nz * line_z0) / (plane_nx * line_nx + plane_ny * line_ny + plane_nz * line_nz);

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
    clear_inputs: function() {
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            if (this.all_floating_2d_texts[i].type === TYPE_INPUT_REGULAR || this.all_floating_2d_texts[i].type === TYPE_INPUT_PASSWORD) {
                this.all_floating_2d_texts[i].clear();
            }
        }
    },

    clear_floating_2d_texts: function() {
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            this.world.remove_from_interactive_then_scene(this.all_floating_2d_texts[i]);
        }
        this.objects_to_remove_later.length = 0;
        this.all_floating_2d_texts.length = 0;
    },

    remove_from_scene: function() {
        for (var j = 0; j < this.floating_walls_to_remove_later.length; j++) {
            this.floating_walls_to_remove_later[j].remove_from_scene();
        }
        for (var i = 0; i < this.objects_to_remove_later.length; i++) {
            this.world.remove_from_interactive_then_scene(this.objects_to_remove_later[i]);
        }
        this.scene.remove(this.object3D);
        this.mesh.material.dispose();
        this.mesh.geometry.dispose();
    },

    remove_floating_2d_texts_with_property: function(property_name) {
        var elements_to_remove = this.get_all_floating_2D_texts_with_property(property_name);
        for (var i = 0; i < elements_to_remove.length; i++) {
            var index_to_remove = -1;
            for (var j = 0; j < this.all_floating_2d_texts.length; j++) {
                if (this.all_floating_2d_texts[j].hasOwnProperty(property_name)) {
                    index_to_remove = j;
                }
            }
            this.world.remove_from_interactive_then_scene(this.all_floating_2d_texts[index_to_remove]);
            this.all_floating_2d_texts.splice(index_to_remove, 1);
        }
    },

    /*        __     __           ___
      \  / | /__` | |__) | |    |  |  \ /
       \/  | .__/ | |__) | |___ |  |   |  */
    close_button_pressed: function() {
        this.hide();
    },

    hide: function() {
        this.set_to_invisible();
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            this.all_floating_2d_texts[i].set_to_invisible();
        }
        for (var j = 0; j < this.all_floating_walls.length; j++) {
            this.all_floating_walls[j].hide();
        }
    },

    show: function() {
        this.set_to_visible();
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            this.all_floating_2d_texts[i].set_to_visible();
        }
        for (var j = 0; j < this.all_floating_walls.length; j++) {
            this.all_floating_walls[j].show();
        }
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */

    // TODO : Perhaps add a border glow? Learn the 3rd party line api

    state_change_look_at: function(being_looked_at) {
        /*
        if (being_looked_at) {
            if (this.hasOwnProperty('background_color')) {
                this.background_color = BACKGROUND_COLOR_FOCUS;
            }
            this.update_color(COLOR_HIGHLIGHT);
        } else {
            if (this.hasOwnProperty('background_color')) {
                this.background_color = COLOR_TRANSPARENT;
            }
            this.update_color(this.default_color);
        }
        */
    },


    state_change_engage: function(being_engaged_with) {
        if (being_engaged_with) {
            MANAGER_WORLD.current_floating_cursor.engage();
        } else {
            MANAGER_WORLD.current_floating_cursor.disengage();
            this.player_horizontal_distance_to_wall_center_liner = null;
        }
    }

};