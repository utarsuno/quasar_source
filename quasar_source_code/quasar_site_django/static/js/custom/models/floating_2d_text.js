function Floating2DText(w, h, text, type, scene) {
    this.__init__(w, h, text, type, scene)
}

Floating2DText.prototype = {
    text: null,
    width: null,
    height: null,
    material: null,
    dynamic_texture: null,

    object3d: null,

    scene: null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,

    // Properties.
    type_password: null,
    type_title   : null,

    //
    original_border_color: null,

    __init__: function(w, h, text, type, scene) {
        this.scene = scene

        this.width              = w
        this.height             = h

        this.text               = text

        this.being_looked_at    = false
        this.being_engaged_with = false

        this.original_border_color = '0xFFC0CB'

        if (type === TYPE_PASSWORD) {
            this.type_password = true
            this.type_title    = false
        } else if (type === TYPE_TITLE) {
            this.type_password = false
            this.type_title    = true
        } else if (type === TYPE_DEFAULT) {
            this.type_password = false
            this.type_title    = false
        }
        this.create()
    },

    look_at: function() {
        if (this.being_looked_at === false) {
            this.mesh.material.color.setHex(this.original_border_color)
        }
        this.being_looked_at = true
    },

    look_away: function() {
        if (this.being_looked_at) {
            this.mesh.material.color.setHex(HIGHLIGHT_COLOR)
        }
        this.being_looked_at = false
    },

    disengage: function() {
        this.being_engaged_with = false
    },

    is_engaged: function() {
        return this.being_engaged_with
    },

    engage: function() {
        this.being_engaged_with = true
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            if (this.type_title) {
                this.dynamic_texture.clear().drawText(text, 16, 80, 'black')
            } else {
                this.dynamic_texture.clear().drawText(text, 8, 40, 'black')
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
        //this.dynamic_texture.context.font = 'Bold 20px Arial'
        this.dynamic_texture.context.font = '32px Arial'
        if (this.type_title) {
            this.dynamic_texture.context.font = 'Bold 64px Arial'
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
        var mat = new THREE.LineBasicMaterial( {color: this.original_border_color, linewidth: 3})
        var wireframe = new THREE.LineSegments(geo, mat)
        this.mesh.add(wireframe)

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
            if (this.type_password) {
                this.add_character('*')
            } else {
                this.add_character(event.key)
            }
        }
    }

}
