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

        this.width = width
        this.height = height

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height)

        console.log(this.left_right)
        var title_offset = new THREE.Vector3(this.left_right.x * 50, this.left_right.y * 50, this.left_right.z * 50)

        //this.title = new Floating2DText((this.width / 4.0) * 3.0, this.title_text, TYPE_INPUT_REGULAR, this.scene)
        this.title = new Floating2DText(this.width / 2, 'Default Group Name', TYPE_INPUT_REGULAR, this.scene)
        this.title.update_position_and_look_at(this.get_position_for_row(title_offset.x, this.get_y_position_for_row(0) + title_offset.y, title_offset.z, 5),
            this.get_look_at_for_row(title_offset.x, this.get_y_position_for_row(0) + title_offset.y, title_offset.z, 5))


        // Create entity button.
        this.create_entity = new Floating2DText(this.width, 'Create Entity', TYPE_BUTTON, this.scene)
        this.create_entity.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(1), 0, 1), this.get_look_at_for_row(0, this.get_y_position_for_row(1), 0, 1))
        //this.create_entity.set_engage_function(this.create_entity_button_pressed.bind(this))

        // Save changes button.
        this.save_changes = new Floating2DText(this.width, 'Save Changes', TYPE_BUTTON, this.scene)
        this.save_changes.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(2), 0, 1), this.get_look_at_for_row(0, this.get_y_position_for_row(2), 0, 1))
        //this.save_changes.set_engage_function(this.send_changes_to_server.bind(this))

        // Delete entity wall button.
        this.delete_entity_wall = new Floating2DText(this.width, 'Delete Entity Wall', TYPE_BUTTON, this.scene)
        this.delete_entity_wall.set_default_color(COLOR_TEXT_RED)
        this.delete_entity_wall.update_position_and_look_at(this.get_position_for_row(0, this.title.height - this.height, 0, 1), this.get_look_at_for_row(0, this.title.height - this.height, 0, 1))
        //this.delete_entity_wall.set_engage_function(this.delete_entity_wall_pressed.bind(this))

        this.interactive_objects = []
        this.interactive_objects.push(this.title)
        this.interactive_objects.push(this.create_entity)
        this.interactive_objects.push(this.save_changes)
        this.interactive_objects.push(this.delete_entity_wall)

        // Set the tab targets.
        this.title.set_next_tab_target(this.create_entity)
        this.create_entity.set_next_tab_target(this.save_changes)
        this.save_changes.set_next_tab_target(this.delete_entity_wall)
        this.delete_entity_wall.set_next_tab_target(this.title)

        this.object3D.add(this.wall.mesh)

        this.scene.add(this.object3D)

        // Inherit from Visibility.
        Visibility.call(this)
        this.add_additional_visibility_object(this.title)
        this.add_additional_visibility_object(this.create_entity)
        this.add_additional_visibility_object(this.save_changes)
        this.add_additional_visibility_object(this.delete_entity_wall)
    },

    update_title: function (title) {
        this.title.update_text(title)
    },

    get_y_position_for_row: function (y_index) {
        return (-16.0 / 2.0) * (1 + (2 * y_index))
    },

    get_position_for_row: function (x_offset, y_offset, z_offset, depth) {
        var p = new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z)
        p.addScaledVector(this.depth_start, depth)
        return p
    },

    get_look_at_for_row: function (x_offset, y_offset, z_offset, depth) {
        var la = new THREE.Vector3(this.look_at.x + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z)
        la.addScaledVector(this.depth_start, depth)
        return la
    },

    get_all_interactive_objects: function () {
        return this.interactive_objects
    }
}