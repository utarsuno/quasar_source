'use strict'

function EntityWall(position, look_at, scene) {
    this.__init__(position, look_at, scene)
}

EntityWall.prototype = {

    position    : null,
    look_at     : null,
    scene       : null,

    normal      : null,
    depth_start : null,
    depth       : null,

    width       : null,
    height      : null,

    title_text  : null,
    title       : null,

    interactive_objects: null,

    entities: null,

    // POST calls.
    post_call_save_changes: null,

    save_changes_result: function(result) {
        if (result === SERVER_REPLY_GENERIC_YES) {
            console.log('Saved the data!')
        } else {
            console.log('ERROR SAVING : ' + result)
        }
    },

    send_changes_to_server: function() {
        console.log('SAVE CHANGES!!!')

        var username = WORLD_MANAGER.world_home.player.get_username()
        var password = WORLD_MANAGER.world_home.player.get_username()

        this.post_call_save_changes.perform_post({'username': username, 'password': password, 'save_data': 'todo'}, this.save_changes_result.bind(this))
    },

    __init__: function(position, scene) {
        this.position = position
        this.look_at  = new THREE.Vector3(0, this.position.y, 0)

        this.normal = new THREE.Vector3(this.look_at.x - this.position.x, this.look_at.y - this.position.y, this.look_at.z - this.position.z)
        this.normal.normalize()

        this.depth = new THREE.Vector3(this.normal.x * 20, this.normal.y * 20, this.normal.z * 20)
        this.depth_start = new THREE.Vector3(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2)

        this.scene    = scene

        this.object3D = new THREE.Object3D()

        this.object3D.position.x = position.x + this.width / 2
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z
        this.object3D.lookAt(new THREE.Vector3(this.look_at.x + this.width / 2, this.look_at.y, this.look_at.z))

        this.width = 500
        this.height = 1000

        // Base wall.
        this.wall = new PlaneAPI(500, 1000)

        // Base title.
        this.title_text = 'Default Group Name'
        //this.title = new Floating2DText((this.width / 4.0) * 3.0, this.title_text, TYPE_INPUT_REGULAR, this.scene)
        this.title = new Floating2DText(this.width, this.title_text, TYPE_INPUT_REGULAR, this.scene)

        this.title.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(0), 0), this.get_look_at_for_row(0, this.get_y_position_for_row(0), 0))

        // Create entity button.
        this.create_entity = new Floating2DText(this.width, 'Create Entity', TYPE_BUTTON, this.scene)
        this.create_entity.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(1), 0), this.get_look_at_for_row(0, this.get_y_position_for_row(1), 0))

        // Save changes button.
        this.save_changes = new Floating2DText(this.width, 'Save Changes', TYPE_BUTTON, this.scene)
        this.save_changes.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(2), 0), this.get_look_at_for_row(0, this.get_y_position_for_row(2, 0)))
        this.save_changes.set_engage_function(this.send_changes_to_server.bind(this))

        // Delete entity wall button.
        this.delete_entity_wall = new Floating2DText(this.width, 'Delete Entity Wall', TYPE_BUTTON, this.scene)
        this.delete_entity_wall.update_position_and_look_at(this.get_position_for_row(0, this.title.height - this.height, 0), this.get_look_at_for_row(0, this.title.height - this.height, 0))

        this.interactive_objects = []
        this.interactive_objects.push(this.title)
        this.interactive_objects.push(this.create_entity)
        this.interactive_objects.push(this.save_changes)
        this.interactive_objects.push(this.delete_entity_wall)

        this.object3D.add(this.wall.mesh)

        this.scene.add(this.object3D)

        this.entities = []
        this.post_call_save_changes = new PostHelper('/save_entities')
    },

    add_entity: function(entity) {

    },

    get_y_position_for_row: function(y_index) {
        return (-16.0 / 2.0) * (1 + (2 * y_index))
    },

    get_position_for_row: function(x_offset, y_offset, z_offset) {
        var p = new THREE.Vector3(this.object3D.position.x - this.width / 2 + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z)
        p.add(this.depth_start)
        return p
    },

    get_look_at_for_row: function(x_offset, y_offset, z_offset) {
        var la = new THREE.Vector3(this.look_at.x - this.width / 2 + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z)
        la.add(this.depth_start)
        return la
    },

    get_all_interactive_objects: function() {
        return this.interactive_objects
    }
}