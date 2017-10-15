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
        this.title = new Floating2DText((this.width / 4.0) * 3.0, this.title_text, TYPE_INPUT_REGULAR, this.scene)
        this.title.update_position_and_look_at(this.get_position_for_row(0, -this.title.height / 2, (this.width / 4.0) * 3.0), this.get_look_at_for_row(0, -this.title.height / 2, 0))

        // Create entity button.
        this.create_entity = new Floating2DText(this.width, 'Create Entity', TYPE_BUTTON, this.scene)
        this.create_entity.update_position_and_look_at(this.get_position_for_row(0, (-this.title.height / 2) * 3, this.width), this.get_look_at_for_row(0, (-this.title.height / 2) * 3, 0))

        // Delete entity wall button.
        this.delete_entity_wall = new Floating2DText(this.width, 'Delete Entity Wall', TYPE_BUTTON, this.scene)
        this.delete_entity_wall.update_position_and_look_at(this.get_position_for_row(0, this.title.height - this.height, this.width), this.get_look_at_for_row(0, this.title.height - this.height, 0))

        this.interactive_objects = []
        this.interactive_objects.push(this.title)
        this.interactive_objects.push(this.create_entity)
        this.interactive_objects.push(this.delete_entity_wall)

        this.object3D.add(this.wall.mesh)

        this.scene.add(this.object3D)
    },

    get_position_for_row: function(x_offset, y_offset, width) {
        var p = new THREE.Vector3(this.object3D.position.x - width / 2 + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z)
        p.add(this.depth_start)
        return p
    },

    get_look_at_for_row: function(x_offset, y_offset, width) {
        var la = new THREE.Vector3(this.look_at.x - width / 2 + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z)
        la.add(this.depth_start)
        return la
    },

    get_all_interactive_objects: function() {
        return this.interactive_objects
    }
}