'use strict'

function Floating3DText(w, h, text, type, scene) {
    this.__init__(w, h, text, type, scene)
}

// Globally load the font files needed on startup.
var font_loader = new THREE.FontLoader()
var global_font = null

// If Floating3DText objects are created while the font is null they will be put into a que instead.
var floating_3d_text_objects_to_make = []

function add_3d_text(floating_3d_text_object) {
    floating_3d_text_objects_to_make.push(floating_3d_text_object)
}

function create_qued_3d_text_objects() {
    console.log('Creating qued 3d text objects!')
    for (var x = 0; x < floating_3d_text_objects_to_make.length; x++) {
        floating_3d_text_objects_to_make[x].create()
    }
}

font_loader.load(
    // resource URL
    '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/font/helvetiker_regular.typeface.json',
    // Function when resource is loaded
    function (font) {
        global_font = font
        console.log('Set global font to : ')
        console.log(font)
    },
    // Function called when download progresses
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded for font file.')
        if (xhr.loaded === xhr.total) {
            create_qued_3d_text_objects()
        }
    },
    // Function called when download errors
    function (xhr) {
        console.log('An error occurred trying to load the font file! Error was : {' + xhr + '}')
    }
)

// TODO : Abstract away the logic from the rendering in different classes.
Floating3DText.prototype = {

    // Only used for Password type texts.
    _hidden_text: null,

    text: null,
    width: null,
    size: null,
    height: null,
    material: null,

    object3d: null,
    current_text_object: null,

    scene: null,

    wireframe: null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,
    current_color: null,

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
        this.create_outline()
        if (global_font === null) {
            add_3d_text(this)
        } else {
            this.create()
        }
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
        this.material = new THREE.MeshLambertMaterial({ color: color_arg })
        this.material.needsUpdate = true
    },

    update_text_color: function(text, color) {
        if (this.current_color !== color) {
            this.material = new THREE.MeshLambertMaterial({color: color})
            this.current_color = color
            this.material.needsUpdate = true
        }
        this.scene.remove(this.current_text_object)
        var text_geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.height,
            curveSegments: 2,
            font: global_font
        })

        this.current_text = text

        this.current_text_object = new THREE.Mesh(text_geometry, this.material)
        this.scene.add(this.current_text_object)
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            this.update_text_color(text, COLOR_TEXT_DEFAULT)
        }
    },

    create_outline: function() {
        this.object3d = new THREE.Object3D()
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)

        // Adds the edge colorings.
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        var geo = new THREE.EdgesGeometry(this.mesh.geometry) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial({color: this.original_border_color, linewidth: 3})
        this.wireframe = new THREE.LineSegments(geo, mat)
        this.mesh.add(this.wireframe)

        this.object3d.add(this.mesh)

        this.scene.add(this.object3d)
    },

    create: function() {
        if (this.type == TYPE_TITLE) {
            this.size = 160
            this.height = 8
        } else {
            this.size = 80
            this.height = 4
        }
        this.update_text(this.text)

        // TODO : Make this only 1 sided
        this.material.side = THREE.DoubleSide
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