'use strict'

function FloatingSlider(current_value, minimum_value, maximum_value, width, position, normal, world) {
    this.__init__(current_value, minimum_value, maximum_value, width, position, normal, world)
}

FloatingSlider.prototype = {

    minimum_value: null,
    maximum_value: null,
    current_value: null,

    slider_increased: function() {
        if (this.current_value < this.maximum_value) {
            this.current_value += this.one_percent_value
        }
        if (this.current_value > this.maximum_value) {
            this.current_value = this.maximum_value
        }
        this.update()
    },

    slider_decreased: function() {
        if (this.current_value > this.minimum_value) {
            this.current_value -= this.one_percent_value
        }
        if (this.current_value < this.minimum_value) {
            this.current_value = this.minimum_value
        }
        this.update()
    },

    update: function() {
        var current_percentage = (this.current_value - this.minimum_value) / (this.maximum_value - this.minimum_value)
        this.current_value_text.update_text(current_percentage.toString())
        this.current_value_text.update_position_and_look_at(this._get_current_position_on_slider(0, 50, 0), this._get_current_look_at_on_slider(0, 50, 0))
        this.slider_object.update_position_and_look_at(this._get_current_position_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2), this._get_current_look_at_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2))
        WORLD_MANAGER.player.look_at(this.slider_object.get_position())
    },

    __init__: function(current_value, minimum_value, maximum_value, width, position, normal, world) {
        this.object3D = new THREE.Object3D()

        // Visibility must be inherited after interactive.
        Interactive.call(this)
        Visibility.call(this)

        this.current_value = current_value
        this.minimum_value = minimum_value
        this.maximum_value = maximum_value
        this.one_percent_value = (this.maximum_value - this.minimum_value) * 0.01
        this.width         = width
        this.half_width    = this.width / 2.0
        this.position      = position
        this.normal        = normal
        this.world         = world

        this.slider_offset = 0

        this.left_right = new THREE.Vector3(0, 1, 0)
        this.left_right.cross(this.normal)
        this.left_right.normalize()

        // Create the slider wall here.
        this.wall = new PlaneAPI(this.width, 20)
        this.object3D.add(this.wall.mesh)

        // Create the actual slider object.
        var current_percentage = (this.current_value - this.minimum_value) / (this.maximum_value - this.minimum_value)
        this.current_value_text = new Floating2DText(100, current_percentage.toString(), COLOR_TEXT_CONSTANT, this.world.scene)
        this.slider_object = new Floating2DText(6, '|', COLOR_TEXT_CONSTANT, this.world.scene)

        this.object3D.position.x = position.x
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z
        this.object3D.lookAt(new THREE.Vector3(position.x + normal.x, position.y + normal.y, position.z + normal.z))

        this.current_value_text.update_position_and_look_at(this._get_current_position_on_slider(0, 50, 0), this._get_current_look_at_on_slider(0, 50, 0))
        this.slider_object.update_position_and_look_at(this._get_current_position_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2), this._get_current_look_at_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2))
        this.slider_object.requires_mouse_x_movement = true

        this.slider_object.bind_increase_and_decrease_functions(this.slider_increased.bind(this), this.slider_decreased.bind(this))

        this.world.scene.add(this.object3D)
        this.world.interactive_objects.push(this.slider_object)
    },

    get_current_value: function() {
        return this.current_value
    },

    _get_current_position_on_slider: function(x_offset, y_offset, z_offset) {
        var position = new THREE.Vector3(this.position.x, this.position.y, this.position.z)
        var current_percentage = (this.current_value - this.minimum_value) / (this.maximum_value - this.minimum_value)
        if (this.current_value < this.maximum_value / 2.0) {
            position.addScaledVector(this.left_right, -current_percentage * this.half_width)
        } else {
            position.addScaledVector(this.left_right, current_percentage * this.half_width)
        }
        if (is_defined(x_offset)) {
            position.x += x_offset
        }
        if (is_defined(y_offset)) {
            position.y += y_offset
        }
        if (is_defined(z_offset)) {
            position.z += z_offset
        }
        return position
    },

    _get_current_look_at_on_slider: function(x_offset, y_offset, z_offset) {
        var position = this._get_current_position_on_slider(x_offset, y_offset, z_offset)
        return new THREE.Vector3(position.x + this.normal.x, position.y + this.normal.y, position.z + this.normal.z)
    }

}