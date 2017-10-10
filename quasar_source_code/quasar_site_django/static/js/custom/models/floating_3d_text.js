'use strict'

function Floating3DText(w, text, type, scene) {
    this.__init__(w, text, type, scene)
}

//const GLOBAL_FONT = new THREE.Font(JSON.parse(document.getElementById('font_3d').innerHTML))

// TODO : Abstract away the logic from the rendering in different classes.
Floating3DText.prototype = {

    // Only used for Password type texts.
    _hidden_text: null,

    text: null,
    width: null,
    size: null,
    height: null,
    text_height: null,
    material: null,
    text_geometry: null,

    object3D: null,
    current_text_object: null,

    scene: null,

    wireframe: null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,
    current_color: null,
    is_visible: null,

    // Properties.
    type: null,

    //
    original_border_color: null,

    //
    also_color_this_floating_text: null,

    __init__: function(w, text, type, scene) {
        this.scene = scene

        this.width              = w

        this.text               = text
        this._hidden_text       = ''

        this.being_looked_at    = false
        this.being_engaged_with = false

        this.original_border_color = 0xFFC0CB

        this.is_visible = true

        this.type = type
        this.create_outline()
        this.create()
    },

    get_text: function() {
        if (this.type === TYPE_INPUT_PASSWORD) {
            return this._hidden_text
        }
        return this.text
    },

    look_at: function() {
        if (this.being_looked_at === false) {
            this.wireframe.material.color.setHex(COLOR_HIGHLIGHT)
            this.update_text_color(this.text, COLOR_TEXT_HIGHLIGHT)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_just_color(COLOR_TEXT_HIGHLIGHT)
            }
        }
        this.being_looked_at = true
    },

    look_away: function() {
        if (this.being_looked_at) {
            this.wireframe.material.color.setHex(this.original_border_color)
            this.update_text_color(this.text, COLOR_TEXT_DEFAULT)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_just_color(COLOR_TEXT_DEFAULT)
            }
        }
        this.being_looked_at = false
    },

    disengage: function(player) {
        if (this.type != TYPE_BUTTON) {
            this.being_engaged_with = false
            player.disengage()
        }
    },

    is_engaged: function() {
        return this.being_engaged_with
    },

    engage: function(player) {
        if (this.type != TYPE_BUTTON) {
            this.being_engaged_with = true
            player.engage()
        }
    },

    update_just_color: function(color_arg) {
        this.material.color.setHex(color_arg)
        this.material.needsUpdate = true
    },

    update_text_color: function(text, color_arg) {
        if (this.current_color !== color_arg) {
            this.material.color.setHex(color_arg)
            this.material.needsUpdate = true
        }
        if (this.current_text_object !== null) {
            this.object3D.remove(this.current_text_object)
            this.current_text_object.geometry.dispose()
            this.current_text_object.material.dispose()
        }

        console.log('CREATED 3D TEXT')

        // Make sure to remove the previous geometry!
        if (this.text_geometry !== null) {
            this.text_geometry.dispose()
        }

        this.text_geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.text_height,
            curveSegments: 2,
            font: GLOBAL_FONT
        })

        this.current_text = text

        this.current_text_object = new THREE.Mesh(this.text_geometry, this.material)
        this.object3D.add(this.current_text_object)
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            this.update_text_color(text, COLOR_TEXT_DEFAULT)
        }
    },

    create_outline: function() {
        this.material = new THREE.MeshLambertMaterial({color: COLOR_TEXT_DEFAULT})
        this.current_color = COLOR_TEXT_DEFAULT
        this.material.needsUpdate = true


        this.object3D = new THREE.Object3D()

        if (this.type === TYPE_TITLE) {
            this.height = 32
        } else {
            this.height = 16
        }

        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.border_geometry = new THREE.PlaneGeometry(this.width, this.height)

        // Adds the edge colorings.
        this.border_mesh = new THREE.Mesh(this.border_geometry, this.material)
        var border_geo = new THREE.EdgesGeometry(this.border_mesh.geometry) // or WireframeGeometry
        var border_mat = new THREE.LineBasicMaterial({color: this.original_border_color, linewidth: 3})
        this.border_wireframe = new THREE.LineSegments(border_geo, border_mat)
        this.border_mesh.add(this.border_wireframe)

        this.object3D.add(this.border_mesh)

        this.scene.add(this.object3D)
    },

    create: function() {
        if (this.type == TYPE_TITLE) {
            this.size = 40
            this.text_height = 2
        } else {
            this.size = 20
            this.text_height = 1
        }
        this.update_text(this.text)

        // TODO : Make this only 1 sided
        this.material.side = THREE.DoubleSide
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3D.position.x = position_vector.x + this.width / 2
        this.object3D.position.y = position_vector.y - this.height / 2
        this.object3D.position.z = position_vector.z
        this.current_text_object.position.x -= this.width / 2
        var look_at = new THREE.Vector3(look_at_position.x + this.width / 2, look_at_position.y - this.height / 2, look_at_position.z)
        this.object3D.lookAt(look_at)
    },

    add_character: function(character) {
        this.text = this.text + character
        this.update_text(this.text)
    },

    pop_character: function() {
        this.text = this.text.slice(0, -1)
        this.update_text(this.text)
    },

    parse_keycode: function(event) {
        var keycode = event.keyCode

        if (keycode == 8) {
            if (this.text.length > 0) {
                this.pop_character()
                if (this.type == TYPE_INPUT_PASSWORD) {
                    this._hidden_text = this._hidden_text.slice(0, -1)
                }
            }

            AUDIO_MANAGER.play_typing_sound()

        } else if (event.key.length == 1) {
            if (this.type == TYPE_INPUT_PASSWORD) {
                this._hidden_text += event.key
                this.add_character('*')
            } else if (this.type == TYPE_INPUT_REGULAR) {
                this.add_character(event.key)
            }

            AUDIO_MANAGER.play_typing_sound()
        }
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
    },

    set_to_visible: function() {
        this.is_visible = true
        this.object3D.visible = true
        this.object3D.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true
            }
        })
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
    }

}