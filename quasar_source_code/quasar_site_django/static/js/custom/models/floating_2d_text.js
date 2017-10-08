'use strict'

function Floating2DText(w, h, text, type, scene) {
    this.__init__(w, h, text, type, scene)
}

function Floating2DLabelInput(w, h, label_text, input_type, scene) {
    this.__init__(w, h, label_text, input_type, scene)
}

Floating2DLabelInput.prototype = {
    floating_label: null,
    floating_input: null,

    one_third_width: null,
    two_third_width: null,

    x_separation : null,

    __init__: function(w, h, label_text, input_type, scene) {
        this.one_third_width = w / 3.0
        this.two_third_width = this.one_third_width * 2.0
        this.x_separation    = w / 2.0

        this.floating_label = new Floating2DText(this.one_third_width, h, label_text, TYPE_LABEL, scene)
        this.floating_input = new Floating2DText(this.two_third_width, h, '', input_type, scene)

        this.floating_input.also_color_this_floating_text = this.floating_label
    },

    update_position: function(px, py, pz) {
        this.floating_label.update_position_and_look_at(new THREE.Vector3(px, py, pz), new THREE.Vector3(px, py, pz + 1))
        this.floating_input.update_position_and_look_at(new THREE.Vector3(px + this.x_separation, py, pz), new THREE.Vector3(px + this.x_separation, py, pz + 1))
    },

    set_input_value: function(input_value) {
        this.floating_input.update_text(input_value)
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
    height: null,
    material: null,
    dynamic_texture: null,

    object3d: null,

    scene: null,

    wireframe: null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,

    // Properties.
    type: null,

    //
    original_border_color: null,

    //
    also_color_this_floating_text: null,

    __init__: function(w, h, text, type, scene) {
        this.scene = scene

        this.width              = w
        this.height             = h

        this.text               = text
        this._hidden_text       = ''

        this.being_looked_at    = false
        this.being_engaged_with = false

        this.original_border_color = 0xFFC0CB

        this.type = type
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

    update_just_color: function(color) {
        if (this.type == TYPE_TITLE) {
            this.dynamic_texture.clear().drawText(this.text, 0, 40, color)
        } else {
            this.dynamic_texture.clear().drawText(this.text, 0, 20, color)
        }
        this.dynamic_texture.needsUpdate = true
    },

    update_text_color: function(text, color) {
        if (this.type == TYPE_TITLE) {
            this.dynamic_texture.clear().drawText(text, 0, 40, color)
        } else {
            this.dynamic_texture.clear().drawText(text, 0, 20, color)
        }
        this.current_text = text
        this.dynamic_texture.needsUpdate = true
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            this.update_text_color(text, COLOR_TEXT_DEFAULT)
        }
    },

    create: function() {
        this.object3d = new THREE.Object3D()
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)
        this.dynamic_texture = new THREEx.DynamicTexture(this.width * 2, this.height * 2)
        if (this.type == TYPE_TITLE) {
            this.dynamic_texture.context.font = 'Bold 40px Arial'
        } else {
            this.dynamic_texture.context.font = '20px Arial'
        }

        // Remove anti-alias from the text.
        this.dynamic_texture.texture.magFilter = THREE.NearestFilter
        this.dynamic_texture.texture.minFilter = THREE.LinearMipMapLinearFilter

        //this.dynamic_texture.texture.anisotropy = renderer_api.renderer.capabilities.getMaxAnisotropy()
        this.update_text(this.text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        this.material.transparent = true
        // TODO : Make this only 1 sided
        this.material.side = THREE.DoubleSide

        // Adds the edge colorings.
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        var geo = new THREE.EdgesGeometry(this.mesh.geometry) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial({color: this.original_border_color, linewidth: 3})
        this.wireframe = new THREE.LineSegments(geo, mat)
        this.mesh.add(this.wireframe)

        this.object3d.add(this.mesh)

        this.scene.add(this.object3d)
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3d.position.x = position_vector.x
        this.object3d.position.y = position_vector.y
        this.object3d.position.z = position_vector.z
        this.object3d.lookAt(look_at_position)
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

            GLOBAL_AUDIO.play_typing_sound()

        } else if (event.key.length == 1) {
            if (this.type == TYPE_INPUT_PASSWORD) {
                this._hidden_text += event.key
                this.add_character('*')
            } else if (this.type == TYPE_INPUT_REGULAR) {
                this.add_character(event.key)
            }

            GLOBAL_AUDIO.play_typing_sound()
        }
    }

}
