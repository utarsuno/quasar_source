'use strict'

function FloatingWall(width, height, position, look_at, world) {
    this.__init__(width, height, position, look_at, world)
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

        this.position = position
        //this.look_at = new THREE.Vector3(0, this.position.y, 0)

        this.normal = normal
        this.depth_start = new THREE.Vector3(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2)

        this.look_at = new THREE.Vector3(this.position.x + this.depth_start.x, this.position.y + this.depth_start.y, this.position.z + this.depth_start.z)

        this.left_right = new THREE.Vector3(0, 1, 0)
        this.left_right.cross(this.normal)
        this.left_right.normalize()

        this.world = world
        this.scene = this.world.scene

        this.object3D = new THREE.Object3D()

        //this.object3D.position.x = position.x
        //this.object3D.position.y = position.y
        //this.object3D.position.z = position.z
        this.object3D.position.set(position.x, position.y, position.z)
        this.object3D.lookAt(new THREE.Vector3(this.look_at.x, this.look_at.y, this.look_at.z))

        // Inherit from Visibility.
        Visibility.call(this)

        this.interactive_objects = []

        this.width = width
        this.height = height

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height)

        /*
        var title_offset = this.get_relative_x_shift(-1.0 * (this.width / 4.0))

        this.title = new Floating2DText(this.width / 2, 'Create New Entity', TYPE_INPUT_REGULAR, this.scene)
        this.title.update_position_and_look_at(this.get_position_for_row(title_offset.x, this.get_y_position_for_row(0) + title_offset.y, title_offset.z, 2),
            this.get_look_at_for_row(title_offset.x, this.get_y_position_for_row(0) + title_offset.y, title_offset.z, 2))

        // Entity name.
        this.entity_name_label = this.add_floating_2d_text(this.width / 3, 'Entity Name :', TYPE_INPUT_REGULAR, -1.0 * (this.width / 3.0), 1, 1, 0)
        */

        // Add new attribute button.

        /*
        // Save changes button.
        this.create_entity_button = this.add_floating_2d_text(this.width, 'Create Entity', TYPE_BUTTON, 0, 2, 0, 0)
        this.create_entity_button.set_default_color(COLOR_TEXT_GREEN)
        this.create_entity_button.push(this.close_button)
        //this.delete_entity_wall.set_engage_function(this.delete_entity_wall_pressed.bind(this))
        */

        //this.interactive_objects.push(this.title)

        //this.interactive_objects.push(this.create_entity)
        //this.interactive_objects.push(this.save_changes)
        //this.interactive_objects.push(this.delete_entity_wall)

        // Set the tab targets.
        /*
        this.title.set_next_tab_target(this.close_button)
        this.close_button.set_next_tab_target(this.create_entity)

        this.create_entity.set_next_tab_target(this.save_changes)
        this.save_changes.set_next_tab_target(this.delete_entity_wall)
        this.delete_entity_wall.set_next_tab_target(this.title)
        */

        this.object3D.add(this.wall.mesh)

        this.scene.add(this.object3D)


        this.objects_to_remove_later = []
        //this.add_additional_visibility_object(this.title)


        this.all_floating_2d_texts = []
    },

    update_position: function(position_vector) {
        this.object3D.position.set(position_vector.x, position_vector.y, position_vector.z)
        if (this.close_button !== null && this.close_button !== undefined) {
            this.update_floating_2d_text_position(position_vector, this.close_button, (this.width / 2.0) - 16 / 2, 2, 0, 0)
        }
        // TODO : update the remaining positions as well.
    },

    update_floating_2d_text_position: function(position_vector, floating_2d_text, x_offset, z_offset, row, additional_y_offset) {
        var relative_x_shift = this.get_relative_x_shift(x_offset)
        var y_position = this.get_y_position_for_row(row) + additional_y_offset

        var new_position = new THREE.Vector3(position_vector.x + relative_x_shift.x, position_vector.y + this.height / 2 + y_position + relative_x_shift.y, position_vector.z + relative_x_shift.z)
        new_position.addScaledVector(this.depth_start, z_offset)

        var new_look_at = new THREE.Vector3(position_vector.x + relative_x_shift.x, position_vector.y + this.height / 2 + y_position + relative_x_shift.y, position_vector.z + relative_x_shift.z)
        new_look_at.addScaledVector(this.depth_start, z_offset)
        new_look_at.addScaledVector(this.normal, 10)

        floating_2d_text.update_position_and_look_at(new_position, new_look_at)
    },

    add_object_to_remove_later: function(object_to_remove) {
        this.objects_to_remove_later.push(object_to_remove)
    },

    remove_from_scene: function() {
        this.scene.remove(this.wall)
        for (var i = 0; i < this.objects_to_remove_later.length; i++) {
            this.scene.remove(this.objects_to_remove_later[i])
        }
    },

    add_close_button: function(additional_depth) {
        if (additional_depth !== null && additional_depth !== null) {
            this.close_button = this.add_floating_2d_text(16, 'X', TYPE_BUTTON, (this.width / 2.0) - 16 / 2, 2 + additional_depth, 0, 0)
        } else {
            this.close_button = this.add_floating_2d_text(16, 'X', TYPE_BUTTON, (this.width / 2.0) - 16 / 2, 2, 0, 0)
        }
        this.interactive_objects.push(this.close_button)
        return this.close_button
    },

    get_all_floating_2d_texts: function() {
        return this.all_floating_2d_texts
    },

    add_floating_2d_text: function(width, text, type, x_offset, z_offset, row, additional_y_offset) {

        var floating_2D_text = new Floating2DText(width, text, type, this.scene)
        var relative_x_shift = this.get_relative_x_shift(x_offset)
        var y_position = this.get_y_position_for_row(row) + additional_y_offset

        floating_2D_text.update_position_and_look_at(this.get_position_for_row(relative_x_shift.x, relative_x_shift.y + y_position, relative_x_shift.z, z_offset), this.get_look_at_for_row(relative_x_shift.x, relative_x_shift.y + y_position, relative_x_shift.z, z_offset))

        this.add_additional_visibility_object(floating_2D_text)

        this.all_floating_2d_texts.push(floating_2D_text)

        return floating_2D_text
    },

    update_title: function (title) {
        this.title.update_text(title)
    },

    get_y_position_for_row: function (y_index) {
        return (-16.0 / 2.0) * (1 + (2 * y_index))
    },

    // Shifts the left-right position (on the wall) of the object by the distance provided. Negative values go left, positive go right.
    get_relative_x_shift: function(distance) {
        return new THREE.Vector3(this.left_right.x * distance, this.left_right.y * distance, this.left_right.z * distance)
    },

    get_position_for_row: function (x_offset, y_offset, z_offset, depth) {
        var p = new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z + z_offset)
        p.addScaledVector(this.depth_start, depth)
        return p
    },

    get_look_at_for_row: function (x_offset, y_offset, z_offset, depth) {
        var la = new THREE.Vector3(this.look_at.x + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z + z_offset)
        la.addScaledVector(this.depth_start, depth)
        return la
    },

    get_all_interactive_objects: function () {
        return this.interactive_objects
    }
}