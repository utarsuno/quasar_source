function Floating2DText(w, h, text, type, scene) {
    this.__init__(w, h, text, type, scene)
}

function FloatingLabelInput(w, h, label_text, input_type, scene) {
    this.__init__(w, h, label_text, input_type, scene)
}

FloatingLabelInput.prototype = {
    floating_label: null,
    floating_input: null,

    one_third_width: null,
    two_third_width: null,

    __init__: function(w, h, label_text, input_type, scene) {
        this.one_third_width = w / 3.0
        this.two_third_width = this.one_third_width * 2.0

        //this.floating_label = new Floating2DText(this.one_third_width, h, label_text, TYPE_LABEL, scene)
        console.log(this.two_third_width)
        this.floating_input = new Floating2DText(this.two_third_width, h, '', input_type, scene)


    },

    update_position: function(px, py, pz) {
        //this.floating_label.update_position_and_look_at(new THREE.Vector3(px, py, pz), new THREE.Vector3(px, py, pz + 1))
        this.floating_input.update_position_and_look_at(new THREE.Vector3(px + this.one_third_width, py, pz), new THREE.Vector3(px + this.one_third_width, py, pz + 1))
    }
}

Floating2DText.prototype = {
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

    __init__: function(w, h, text, type, scene) {
        this.scene = scene

        this.width              = w
        this.height             = h

        this.text               = text

        this.being_looked_at    = false
        this.being_engaged_with = false

        this.original_border_color = 0xFFC0CB

        this.type = type
        this.create()
    },

    look_at: function() {
        if (this.being_looked_at === false) {
            this.wireframe.material.color.setHex(HIGHLIGHT_COLOR)
        }
        this.being_looked_at = true
    },

    look_away: function() {
        if (this.being_looked_at) {
            this.wireframe.material.color.setHex(this.original_border_color)
        }
        this.being_looked_at = false
    },

    disengage: function(player) {
        this.being_engaged_with = false
        if (this.type != TYPE_BUTTON) {
            player.disengage()
        }
    },

    is_engaged: function() {
        return this.being_engaged_with
    },

    engage: function(player) {
        this.being_engaged_with = true
        if (this.type != TYPE_BUTTON) {
            player.engage()
        }
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            if (this.type == TYPE_TITLE) {
                this.dynamic_texture.clear().drawText(text, 16, 80, TEXT_COLOR)
            } else {
                this.dynamic_texture.clear().drawText(text, 8, 40, TEXT_COLOR)
            }
            this.current_text = text
            this.dynamic_texture.needsUpdate = true
        }
    },

    create: function() {
        this.object3d = new THREE.Object3D()
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)
        this.dynamic_texture = new THREEx.DynamicTexture(this.width * 4, this.height * 4)
        if (this.type == TYPE_TITLE) {
            this.dynamic_texture.context.font = 'Bold 64px Arial'
        } else {
            this.dynamic_texture.context.font = '32px Arial'
        }
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
            }
        } else if (event.key.length == 1) {
            if (this.type == TYPE_INPUT_PASSWORD) {
                this.add_character('*')
            } else if (this.type == TYPE_INPUT_REGULAR) {
                this.add_character(event.key)
            }
        }
    }

}
