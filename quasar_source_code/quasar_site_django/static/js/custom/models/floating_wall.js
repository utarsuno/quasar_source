'use strict';

function FloatingWall(width, height, position, look_at, world) {
    this.__init__(width, height, position, look_at, world);
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

    __init__: function (width, height, position, normal, world) {

        this.position = position;
        //this.look_at = new THREE.Vector3(0, this.position.y, 0)

        this.normal = normal;
        this.depth_start = new THREE.Vector3(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2);

        this.look_at = new THREE.Vector3(this.position.x + this.depth_start.x, this.position.y + this.depth_start.y, this.position.z + this.depth_start.z);

        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        this.world = world;
        this.scene = this.world.scene;

        this.object3D = new THREE.Object3D();

        this.object3D.position.set(position.x, position.y, position.z);
        this.object3D.lookAt(new THREE.Vector3(this.look_at.x, this.look_at.y, this.look_at.z));

        // Inherit from Visibility.
        Visibility.call(this);

        this.interactive_objects = [];

        this.width = width;
        this.height = height;

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height);

        this.object3D.add(this.wall.mesh);

        this.scene.add(this.object3D);

        this.objects_to_remove_later = [];
        //this.add_additional_visibility_object(this.title)

        this.all_floating_2d_texts = [];
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
            this.close_button = this.add_floating_2d_text(16, 'X', TYPE_BUTTON, (this.width / 2.0) - 16 / 2, 2 + additional_depth, 0, 0);
        } else {
            this.close_button = this.add_floating_2d_text(16, 'X', TYPE_BUTTON, (this.width / 2.0) - 16 / 2, 2, 0, 0);
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
    }
};