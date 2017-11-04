'use strict'

function FloatingSlider(position, normal, world) {
    this.__init__(position, normal, world)
}

FloatingSlider.prototype = {

    minimum_value: null,
    maximum_value: null,
    current_value: null,

    __init__: function(current_value, minimum_value, maximum_value, width, position, normal, world) {
        this.object3D =- new THREE.Object3D()

        // Visibility must be inherited after interactive.
        Interactive.call(this)
        Visibility.call(this)

        this.current_value = current_value
        this.minimum_value = minimum_value
        this.maximum_value = maximum_value
        this.width         = width
        this.half_width    = this.width / 2.0
        this.position      = position
        this.normal        = normal
        this.world         = world

        this.left_right = new THREE.Vector3(0, 1, 0)
        l(this.left_right)
        l(this.normal)
        this.left_right.cross(this.normal)
        this.left_right.normalize()

        // Create the slider wall here.
        this.wall = new PlaneAPI(this.width, 20)
        this.object3D.add(this.wall.mesh)

        // Create the actual slider object.
        this.current_value_text = new Floating2DText(100, 'CURRENT PERCENTAGE %', COLOR_TEXT_CONSTANT, this.world.scene)
        this.current_value_text.update_position_and_look_at(this._get_current_position_on_slider(0, 50, 0), this.normal)

        this.object3D.position.x = position.x
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z
        this.object3D.lookAt(new THREE.Vector3(position.x + normal.x, position.y + normal.y, position.z + normal.z))

        this.world.scene.add(this.object3D)
        //this.world.interactive_objects.push()
    },

    get_current_value: function() {
        return this.current_value
    },

    _get_current_position_on_slider: function(x_offset, y_offset, z_offset) {
        var position = new THREE.Vector3()
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

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    state_change_look_at: function(being_looked_at) {
        /*
        if (being_looked_at) {
            this.wireframe.material.color.setHex(COLOR_HIGHLIGHT)
            this.update_color(COLOR_TEXT_HIGHLIGHT)
            //this.update_text_color(this.text, COLOR_TEXT_HIGHLIGHT)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_text_color(this.also_color_this_floating_text.text, COLOR_TEXT_HIGHLIGHT)
            }
        } else {
            this.wireframe.material.color.setHex(this.original_border_color)
            this.update_color(this.default_color)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_text_color(this.also_color_this_floating_text.text, this.default_color)
            }
        }
        */
    },

    state_change_engage: function(being_engaged_with) {
        /*
        if (being_engaged_with) {
            if (this.type != TYPE_BUTTON && this.type != TYPE_CHECK_BOX) {
                WORLD_MANAGER.player.engage()
            } else {
                this.being_engaged_with = false
            }
        } else {
            WORLD_MANAGER.player.disengage()
        }
        */
    },
}