'use strict'

function Floating2DText(w, text, type, scene) {
    this.__init__(w, text, type, scene)
}

function Floating2DLabelInput(w, label_text, input_type, scene) {
    this.__init__(w, label_text, input_type, scene)
}

Floating2DLabelInput.prototype = {
    floating_label: null,
    floating_input: null,

    one_third_width: null,
    two_third_width: null,

    x_separation : null,

    __init__: function(w, label_text, input_type, scene) {
        this.one_third_width = w / 3.0
        this.two_third_width = this.one_third_width * 2.0
        this.x_separation    = w / 2.0

        this.floating_label = new Floating2DText(this.one_third_width, label_text, TYPE_LABEL, scene)
        this.floating_input = new Floating2DText(this.two_third_width, '', input_type, scene)

        this.floating_input.also_color_this_floating_text = this.floating_label
    },

    update_position: function(px, py, pz) {
        this.floating_label.update_position_and_look_at(new THREE.Vector3(px + this.one_third_width / 2, py, pz), new THREE.Vector3(px + this.one_third_width / 2, py, pz + 1))
        this.floating_input.update_position_and_look_at(new THREE.Vector3(px + this.two_third_width / 2 + this.one_third_width, py, pz), new THREE.Vector3(px + this.two_third_width / 2 + this.one_third_width, py, pz + 1))
    },

    set_input_value: function(input_value) {
        this.floating_input.force_update_text(input_value)
    },

    get_input_text: function() {
        return this.floating_input.get_text().trim()
    }
}

Floating2DText.prototype = {

    // Only used for Password type texts.
    _hidden_text: null,

    text: null,
    width: null,
    material: null,
    dynamic_texture: null,

    object3D: null,

    scene: null,

    wireframe: null,

    // Properties.
    type: null,

    //
    original_border_color: null,

    //
    also_color_this_floating_text: null,

    //
    default_color: null,

    //
    label: null,
    label_position: null,

    __init__: function(w, text, type, scene) {
        this.scene = scene

        this.width              = w

        this.text               = text
        this._hidden_text       = ''

        this.original_border_color = 0xFFC0CB

        this.type = type

        if (this.type === TYPE_TITLE) {
            this.height = 32
        } else {
            this.height = 16
        }

        // Inherit from Interactive.
        Interactive.call(this)
        // Inherit from Visibility.
        Visibility.call(this)

        switch (this.type) {
        case TYPE_BUTTON:
        case TYPE_CHECK_BOX:
        case TYPE_TITLE:
            this.maintain_engage_when_tabbed_to = false
            this.default_color = COLOR_TEXT_BUTTON
            break
        case TYPE_CONSTANT_TEXT:
            this.default_color = COLOR_TEXT_CONSTANT
            this.engable = false
            break
        default:
            this.default_color = COLOR_TEXT_DEFAULT
        }

        this.create()
    },

    set_label_position: function(label_position) {
        this.label_position = label_position
    },

    get_label_position: function() {
        return this.label_position
    },

    set_label: function(label_value) {
        this.label = label_value
    },

    get_label: function() {
        if (this.label === null || this.label === undefined) {
            return ''
        }
        return this.label
    },

    set_default_color: function(default_color) {
        this.default_color = default_color
        this.update_text_color(this.text, this.default_color)
    },

    get_text: function() {
        if (this.type === TYPE_INPUT_PASSWORD) {
            return this._hidden_text
        }
        return this.text
    },

    get_position: function() {
        return this.object3D.position
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    state_change_look_at: function(being_looked_at) {
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
    },

    state_change_engage: function(being_engaged_with) {
        if (being_engaged_with) {
            if (this.type != TYPE_BUTTON && this.type != TYPE_CHECK_BOX) {
                WORLD_MANAGER.player.engage()
            } else {
                this.being_engaged_with = false
            }
        } else {
            WORLD_MANAGER.player.disengage()
        }
    },

    get_text_length: function() {
        return this.dynamic_texture.getTextLength(this.text)
    },

    get_text_height: function() {
        return this.height
    },

    clear_text: function() {
        this.dynamic_texture.clear()
        this.dynamic_texture.needsUpdate = true
    },

    update_color: function(color) {
        this.update_text_color(this.text, color)
    },

    update_text_color: function(text, color) {
        this.text = text
        switch (this.type) {
        case TYPE_TITLE:
        case TYPE_CHECK_BOX:
        case TYPE_BUTTON:
            // Render the text in the center.
            this.dynamic_texture.clear().drawText(this.text, this.width - this.get_text_length() / 2, this.height + this.height / 2, color)
            break
        default:
            this.dynamic_texture.clear().drawText(this.text, 0, this.height, color)
        }
        this.dynamic_texture.needsUpdate = true
    },

    force_update_text: function(text) {
        this.update_text_color(text, this.default_color)
    },

    update_text: function(text) {
        if (this.text !== text) {
            this.update_text_color(text, this.default_color)
        }
    },

    create: function() {
        this.object3D = new THREE.Object3D()
        if (this.type == TYPE_TITLE) {
            this.height = 32
        } else {
            this.height = 16
        }
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)
        this.dynamic_texture = new THREEx.DynamicTexture(this.width * 2, this.height * 2)
        if (this.type == TYPE_TITLE) {
            this.dynamic_texture.context.font = 'Bold 40px Arial'
        } else {
            this.dynamic_texture.context.font = '20px Arial'
        }

        // Remove anti-alias from the text.
        // TODO : Try rendering without these enabled.
        this.dynamic_texture.texture.magFilter = THREE.NearestFilter
        this.dynamic_texture.texture.minFilter = THREE.LinearMipMapLinearFilter

        // TODO : Investigate this
        //this.dynamic_texture.texture.anisotropy = renderer_api.renderer.capabilities.getMaxAnisotropy()

        this.force_update_text(this.text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        // TODO : try to make it a semi-transprent background instead (might help fix the visual bugs regarding seeing through walls)

        this.material.transparent = true

        //this.material.transparent = false
        //this.material.color.setHex(COLOR_HEX_BLACK)

        this.material.side = THREE.FrontSide

        // Adds the edge colorings.
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        var geo = new THREE.EdgesGeometry(this.mesh.geometry) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial({color: this.original_border_color, linewidth: 3})
        this.wireframe = new THREE.LineSegments(geo, mat)
        this.mesh.add(this.wireframe)

        this.object3D.add(this.mesh)
        this.scene.add(this.object3D)
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3D.position.x = position_vector.x
        this.object3D.position.y = position_vector.y
        this.object3D.position.z = position_vector.z

        var look_at = new THREE.Vector3(look_at_position.x, look_at_position.y, look_at_position.z)

        this.object3D.lookAt(look_at)
    },

    add_character: function(character) {
        this.text = this.text + character
        this.force_update_text(this.text)
    },

    pop_character: function() {
        this.text = this.text.slice(0, -1)
        this.force_update_text(this.text)
    },

    // TODO : Parse this logic out for the Floating2DText and Floating3DText classes!!!!
    parse_keycode: function(event) {
        var keycode = event.keyCode

        if (keycode == KEY_CODE_DELETE) {
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

    delete_self: function() {
        // TODO : Implement this function!!!
    }

}
