'use strict';

function FloatingWall(width, height, position, look_at, world, scalable) {
    this.__init__(width, height, position, look_at, world, scalable);
}

FloatingWall.prototype = {

    position: null,
    look_at: null,
    world: null,
    scene: null,

    normal: null,
    depth_start: null,
    depth: null,

    width: null,
    height: null,

    title_text: null,
    title: null,

    interactive_objects: null,

    __init__: function (width, height, position, normal, world, scalable) {
        this.normal = normal;
        this.depth_start = new THREE.Vector3(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2);

        this.look_at = new THREE.Vector3(position.x + this.depth_start.x, position.y + this.depth_start.y, position.z + this.depth_start.z);

        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        this.width = width;
        this.height = height;

        var right_side = this.get_relative_x_shift(-this.width / 2);

        this.world = world;
        this.scene = this.world.scene;

        this.object3D = new THREE.Object3D();

        // Inherit from Visibility.
        Visibility.call(this);

        this.interactive_objects = [];

        // Base wall.
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = new THREE.MeshBasicMaterial({
            color: 0x060606,
            //transparent: true,
            //opacity: 0.85,
            side: THREE.DoubleSide
        });
        this.wall_mesh = new THREE.Mesh(this.geometry, this.material);
        //this.wall_mesh.position.set(position.x - right_side.x, position.y - this.height / 2 - right_side.y, position.z - right_side.z);
        // Base wall.

        this.scalable = scalable;

        if (is_defined(scalable)) {
            if (scalable) {
                // The scaling slider is an invisible sphere that sits in the bottom right corner of the wall.
                var sphereGeom = new THREE.SphereGeometry(8, 4, 4);
                var blueMaterial = new THREE.MeshBasicMaterial({color: 0xa6fff2, transparent: true, opacity: 0.8});
                this.sliding_cursor = new THREE.Mesh(sphereGeom, blueMaterial);
                this.cursor_object3D = new THREE.Object3D();
                this.cursor_object3D.add(this.sliding_cursor);
                this.cursor_object3D.position.set(position.x - right_side.x, position.y - this.height / 2 - right_side.y, position.z - right_side.z);
            }
        }

        this.objects_to_remove_later = [];
        //this.add_additional_visibility_object(this.title)

        this.all_floating_2d_texts = [];

        // Used to determine what actions to be taking.
        this.current_cursor = null;

        this.position_cache_x = null;

        this.object3D.add(this.wall_mesh);

        this.scene.add(this.object3D);
        if (is_defined(scalable)) {
            if (scalable) {
                this.scene.add(this.cursor_object3D);
            }
        }

        this.object3D.position.set(position.x, position.y, position.z);
        this.object3D.lookAt(new THREE.Vector3(this.look_at.x, this.look_at.y, this.look_at.z));
    },

    _update_scale: function() {
        var scale_position = this.get_player_look_at_intersection_point_without_is_point_inside_check();
        l('The scale position is at ');
        l(scale_position);

        l('The current scale sphere position is at ');
        l(this.cursor_object3D.position);

        this.cursor_object3D.position.set(scale_position.x, scale_position.y, scale_position.z);

        //  Dynamically change the width and height!
        l('TODO : Dynamically change the width and height!');

        this.object3D.remove(this.wall_mesh);
        //this.scene.remove(this.wall_mesh);

        // TODO : Calculate the new width and height
        var new_geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.geometry.dispose();
        this.geometry = new_geometry;
        this.wall_mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.wall_mesh);
    },

    update: function() {
        /*
        if (this.currently_scaling) {
            var p = CURRENT_PLAYER.get_position();
            if (this.position_cache_x !== int(p.x) || this.position_cache_y !== int(p.y) || this.position_cache_z !== int(p.z)) {
                this.turn_off_scaling();
            } else {
                this._update_scale();
            }
        }*/
    },

    get_required_cursor: function(cursor_position_vector) {
        var y_percentage = cursor_position_vector.y / this.object3D.position.y;
        var horizontal_percentage = this._get_horizontal_distance_to_center(cursor_position_vector.x, cursor_position_vector.z);
        l('Y % :');
        l(y_percentage);
        l('H % :');
        l(horizontal_percentage);
    },

    turn_off_scaling: function() {
        //this.currently_scaling = false;
        //CURRENT_PLAYER.disengage();
    },

    lock_on_scaling: function() {
        this.currently_scaling = true;
        CURRENT_PLAYER.engage_but_leave_controls_enabled();
        CURRENT_PLAYER.look_at(this.cursor_object3D.position);
        var current_player_position = CURRENT_PLAYER.get_position();
        this.position_cache_x = int(current_player_position.x);
        this.position_cache_y = int(current_player_position.y);
        this.position_cache_z = int(current_player_position.z);
    },

    clear_inputs: function() {
        for (var i = 0; i < this.all_floating_2d_texts.length; i++) {
            if (this.all_floating_2d_texts[i].type == TYPE_INPUT_REGULAR || this.all_floating_2d_texts[i].type == TYPE_INPUT_PASSWORD) {
                this.all_floating_2d_texts[i].clear();
            }
        }
    },

    add_3d_title: function(title_name) {
        this.floating_3d_title = new Floating3DText(this.width, title_name, TYPE_TITLE, this.scene, COLOR_DAY_PRESENT);
        var x_shift    = this.get_relative_x_shift(-1.0 * (this.floating_3d_title.width / 2.0));
        var y_position = this.get_position_for_row(x_shift.x, x_shift.y + this.floating_3d_title.height / 2, x_shift.z, 0);
        var look_at    = this.get_look_at_for_row(x_shift.x, x_shift.y + this.floating_3d_title.height / 2, x_shift.z, 0);
        this.floating_3d_title.update_position_and_look_at(y_position, look_at);
    },

    update_position: function(position_vector) {
        this.object3D.position.set(position_vector.x, position_vector.y, position_vector.z);
        if (is_defined(this.close_button)) {
            this.update_floating_2d_text_position(position_vector, this.close_button, (this.width / 2.0) - 16 / 2, 2, 0, 0);
        }
        // TODO : update the remaining positions as well.
    },

    update_floating_2d_text_position: function(position_vector, floating_2d_text, x_offset, z_offset, row, additional_y_offset) {
        var relative_x_shift = this.get_relative_x_shift(x_offset);
        var y_position = this.get_y_position_for_row(row) + additional_y_offset;

        var new_position = new THREE.Vector3(position_vector.x + relative_x_shift.x, position_vector.y + this.height / 2 + y_position + relative_x_shift.y, position_vector.z + relative_x_shift.z);
        new_position.addScaledVector(this.depth_start, z_offset);

        var new_look_at = new THREE.Vector3(position_vector.x + relative_x_shift.x, position_vector.y + this.height / 2 + y_position + relative_x_shift.y, position_vector.z + relative_x_shift.z);
        new_look_at.addScaledVector(this.depth_start, z_offset);
        new_look_at.addScaledVector(this.normal, 10);

        floating_2d_text.update_position_and_look_at(new_position, new_look_at);
    },

    add_object_to_remove_later: function(object_to_remove) {
        this.objects_to_remove_later.push(object_to_remove);
    },

    remove_from_scene: function() {
        for (var i = 0; i < this.objects_to_remove_later.length; i++) {
            this.world.remove_from_interactive_then_scene(this.objects_to_remove_later[i]);
        }
        this.scene.remove(this.object3D);
    },

    add_close_button: function(additional_depth) {
        if (additional_depth !== null && additional_depth !== null) {
            this.close_button = this.add_floating_2d_text(16, 'X', TYPE_BUTTON, this.width - 16 / 2, 2 + additional_depth, 0, 0);
        } else {
            this.close_button = this.add_floating_2d_text(16, 'X', TYPE_BUTTON, this.width - 16 / 2, 2, 0, 0);
        }
        this.interactive_objects.push(this.close_button);
        return this.close_button;
    },

    get_all_floating_2d_texts: function() {
        return this.all_floating_2d_texts;
    },

    add_floating_2d_text: function(width, text, type, x_offset, z_offset, row, additional_y_offset) {
        // FOR_DEV_START
        if (!is_defined(this.scene)) {
            l('THE SCENE IS NOT DEFINED!');
        }
        // FOR_DEV_END

        var floating_2D_text = new Floating2DText(width, text, type, this.scene);

        var additional_x_shift = 0;
        if (width < this.width) {
            additional_x_shift = -1.0 * ((1.0 - (width / this.width)) / 2.0) * this.width;
        }

        var relative_x_shift = this.get_relative_x_shift(x_offset + additional_x_shift);
        var y_position = this.get_y_position_for_row(row) + additional_y_offset;

        floating_2D_text.update_position_and_look_at(this.get_position_for_row(relative_x_shift.x, relative_x_shift.y + y_position, relative_x_shift.z, z_offset), this.get_look_at_for_row(relative_x_shift.x, relative_x_shift.y + y_position, relative_x_shift.z, z_offset));

        this.add_additional_visibility_object(floating_2D_text);
        this.add_object_to_remove_later(floating_2D_text);

        this.all_floating_2d_texts.push(floating_2D_text);

        return floating_2D_text;
    },

    update_title: function (title) {
        this.title.update_text(title);
    },

    get_y_position_for_row: function (y_index) {
        return (-16.0 / 2.0) * (1 + (2 * y_index));
    },

    _get_horizontal_distance_to_center: function(x, z) {
        return sqrt(squared(x - this.object3D.position.x) + squared(z - this.object3D.position.z));
    },

    // Shifts the left-right position (on the wall) of the object by the distance provided. Negative values go left, positive go right.
    get_relative_x_shift: function(distance) {
        return new THREE.Vector3(this.left_right.x * distance, this.left_right.y * distance, this.left_right.z * distance);
    },

    get_position_for_row: function (x_offset, y_offset, z_offset, depth) {
        var p = new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z + z_offset);
        p.addScaledVector(this.depth_start, depth);
        return p;
    },

    get_look_at_for_row: function (x_offset, y_offset, z_offset, depth) {
        var la = new THREE.Vector3(this.look_at.x + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z + z_offset);
        la.addScaledVector(this.depth_start, depth);
        return la;
    },

    get_all_interactive_objects: function () {
        return this.interactive_objects;
    },

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
        var right_side = this.get_relative_x_shift(-this.width / 2);

        if (right_side.x < 0) {
            if (this.object3D.position.x + right_side.x > x) {
                return false;
            }
        } else {
            if (this.object3D.position.x + right_side.x < x) {
                return false;
            }
        }
        if (right_side.z < 0) {
            if (this.object3D.position.z + right_side.z > z) {
                return false;
            }
        } else {
            if (this.object3D.position.z + right_side.z < z) {
                return false;
            }
        }
        return true;
    },

    get_player_look_at_intersection_point_without_is_point_inside_check: function() {
        var player_parametric_equation = CURRENT_PLAYER.get_parametric_equation();
        var floating_wall_parametric_equation = this.get_parametric_equation();

        // TODO : Simplify later.
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

    get_player_look_at_intersection_point: function() {
        var player_parametric_equation = CURRENT_PLAYER.get_parametric_equation();
        var floating_wall_parametric_equation = this.get_parametric_equation();

        // TODO : Simplify later.
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

        if (!this._is_point_inside_floating_wall(intersection_values[0], intersection_values[1], intersection_values[2])) {
            return false;
        }

        // Also add the cursor type needed.
        var cursor_position = new THREE.Vector3(intersection_values[0], intersection_values[1], intersection_values[2]);
        var c = this.get_required_cursor(cursor_position);

        l(c);

        return cursor_position;
    }
};