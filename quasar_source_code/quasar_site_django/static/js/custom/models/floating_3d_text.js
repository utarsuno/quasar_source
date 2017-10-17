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
    current_color: null,

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

        // Inherit from Interactive.
        Interactive.call(this)
        // Inherit from Visibility.
        Visibility.call(this)

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

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            this.update_just_color(COLOR_HIGHLIGHT)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_just_color(COLOR_TEXT_HIGHLIGHT)
            }
        } else {
            this.update_just_color(COLOR_TEXT_DEFAULT)
            if (this.also_color_this_floating_text !== null) {
                this.also_color_this_floating_text.update_just_color(COLOR_TEXT_DEFAULT)
            }
        }
    },

    state_change_engage: function(being_engaged_with, player) {
        if (being_engaged_with) {
            player.engage()
        } else {
            player.disengage()
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

        /*
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.border_geometry = new THREE.PlaneGeometry(this.width, this.height * 2)

        // Adds the edge colorings.
        this.border_mesh = new THREE.Mesh(this.border_geometry, this.material)
        var border_geo = new THREE.EdgesGeometry(this.border_mesh.geometry) // or WireframeGeometry
        var border_mat = new THREE.LineBasicMaterial({color: this.original_border_color, linewidth: 3})
        this.border_wireframe = new THREE.LineSegments(border_geo, border_mat)
        this.border_mesh.add(this.border_wireframe)
        //this.border_mesh.visible = false
        this.object3D.add(this.border_mesh)
        */

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
        this.object3D.position.y = position_vector.y - this.height
        this.object3D.position.z = position_vector.z
        //this.current_text_object.position.x -= this.width / 2
        var look_at = new THREE.Vector3(look_at_position.x + this.width / 2, look_at_position.y - this.height, look_at_position.z)
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

}