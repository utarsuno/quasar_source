'use strict'

function InteractiveWall(w, h, position, look_at, scene) {
    this.__init__(w, h, position, look_at, scene)
}

// TODO : NOTE : Only works in a single orientation. At some point this class will go through heavy refactoring.
InteractiveWall.prototype = {

    width : null,
    height: null,
    position: null,
    look_at : null,
    object3D: null,
    scene    : null,

    wall: null,

    is_visible: null,

    close_button: null,

    title: null,

    rows: null,

    list_of_interactive_objects: null,

    close_button_clicked: function() {
        this.set_to_invisible()
    },

    __init__: function(w, h, position, look_at, scene) {
        this.is_visible = true

        this.list_of_interactive_objects = []

        this.scene = scene
        this.width = w
        this.height = h
        this.object3D = new THREE.Object3D()

        this.look_at = look_at

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height)
        this.object3D.add(this.wall.mesh)

        // Close button.
        this.close_button = new CheckBox(true, this.scene)
        var close_button_position = new THREE.Vector3(position.x + this.width - this.close_button.width, position.y + this.height / 2 - this.close_button.height / 2, position.z + 1)
        var close_button_look_at = new THREE.Vector3(look_at.x + this.width - this.close_button.width, look_at.y + this.height / 2 - this.close_button.height / 2, look_at.z + 2)
        this.close_button.update_position_and_look_at(close_button_position, close_button_look_at)

        this.close_button.floating_2d_text.set_engage_function(this.close_button_clicked.bind(this))
        this.list_of_interactive_objects.push(this.close_button.floating_2d_text)

        //this.close_button.floating_2d_text.object3D.remove(this.close_button.floating_2d_text.mesh)
        //this.close_button.remove_floating_2d_texts_object3D()
        //this.object3D.add(this.close_button.floating_2d_text.mesh)

        this.object3D.position.x = position.x + this.width / 2
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z
        this.object3D.lookAt(new THREE.Vector3(look_at.x + this.width / 2, look_at.y, look_at.z))

        this.scene.add(this.object3D)

        this.rows = []
    },

    set_to_invisible: function() {
        this.is_visible = false
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false
        this.object3D.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false
            }
        })
        this.close_button.set_to_invisible()
        if (this.title !== null) {
            this.title.set_to_invisible()
        }
        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i][0].set_to_invisible()
            this.rows[i][1].set_to_invisible()
        }
    },

    set_to_visible: function() {
        this.is_visible = true
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = true
        this.object3D.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true
            }
        })
        this.close_button.set_to_visible()
        if (this.title !== null) {
            this.title.set_to_visible()
        }
        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i][0].set_to_visible()
            this.rows[i][1].set_to_visible()
        }
    },

    toggle_visibility: function() {
        this.is_visible = !this.is_visible
        var local_is_visible = this.is_visible
        this.object3D.visible = this.is_visible
        this.object3D.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
                child.visible = local_is_visible
            }
        })
        if (this.is_visible) {
            this.close_button.set_to_visible()
            if (this.title !== null) {
                this.title.set_to_visible()
            }
            for (var i = 0; i < this.rows.length; i++) {
                this.rows[i][0].set_to_visible()
                this.rows[i][1].set_to_visible()
            }
        } else {
            this.close_button.set_to_invisible()
            if (this.title !== null) {
                this.title.set_to_invisible()
            }
            for (var i = 0; i < this.rows.length; i++) {
                this.rows[i][0].set_to_invisible()
                this.rows[i][1].set_to_invisible()
            }
        }
    },

    get_all_interactive_objects: function() {
        return this.list_of_interactive_objects
    },

    add_title: function(title) {
        this.title = new Floating3DText(this.width / 2, title, TYPE_TITLE, this.scene)
        var title_position = new THREE.Vector3(this.object3D.position.x - this.width / 2, this.object3D.position.y + this.height / 2 - this.title.height / 2, this.object3D.position.z + 1)
        var title_look_at = new THREE.Vector3(this.look_at.x, this.look_at.y + this.height / 2 - this.title.height / 2, this.look_at.z + 2)
        this.title.update_position_and_look_at(title_position, title_look_at)
    },

    add_input_row: function(input_name) {
        var row_length = this.rows.length + 1
        var row_title = new Floating2DText(this.width / 3, input_name, TYPE_INPUT_REGULAR, this.scene)
        var y_offset = row_length * row_title.height + (2 * row_length)
        var row_position = new THREE.Vector3(this.object3D.position.x - this.width / 2, this.object3D.position.y + this.height / 2 - this.title.height / 2 - y_offset, this.object3D.position.z + 1)
        var row_look_at = new THREE.Vector3(this.look_at.x, this.look_at.y + this.height / 2 - this.title.height / 2 - y_offset, this.look_at.z + 2)
        row_title.update_position_and_look_at(row_position, row_look_at)

        var row_input = new Floating2DText((this.width / 3) * 2, input_name, TYPE_INPUT_REGULAR, this.scene)
        var row_input_position = new THREE.Vector3(this.object3D.position.x - this.width / 2 + this.width / 3, this.object3D.position.y + this.height / 2 - this.title.height / 2 - y_offset, this.object3D.position.z + 1)
        var row_input_look_at = new THREE.Vector3(this.look_at.x, this.look_at.y + this.height / 2 - this.title.height / 2 - y_offset, this.look_at.z + 2)
        row_input.update_position_and_look_at(row_input_position, row_input_look_at)

        this.rows.push([row_title, row_input])

        this.list_of_interactive_objects.push(row_input)
    }
}