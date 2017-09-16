'use strict'

function LoginPanel(renderer_api) {
    this.__init__(renderer_api)
}

function FloatingText(text, renderer_api) {
    this.__init__(text, renderer_api)
}

FloatingText.prototype = {
    text: null,
    _text_plane: null,

    __init__: function(text, renderer_api) {
        this.text = text

        var text_position = new THREE.Vector3(40, 40, 40)
        var text_rotation = new THREE.Vector3(0, 0, 0)
        this._text_plane = new PlaneAPI(200, 50, text_position, text_rotation)
        this._text_plane.create_dynamic_text(this.text, renderer_api)
    },

    get_mesh: function() {
        return this._text_plane.mesh
    },

    set_position: function(x, y, z) {
        this._text_plane.position.x = x
        this._text_plane.position.y = y
        this._text_plane.position.z = z
    },

    set_rotation: function(x, y, z) {
        this._text_plane.rotation.x = x
        this._text_plane.rotation.y = y
        this._text_plane.rotation.z = z
    }
}

LoginPanel.prototype = {

    // State variables.
    active          : null,

    //

    renderer_api    : null,

    background_plane: null,
    position        : null,
    rotation        : null,

    // GUI components.
    username_label  : null,
    password_label  : null,

    __init__: function(renderer_api) {
        this.active = false
        this.renderer_api = renderer_api

        this.position = new THREE.Vector3(50, 50, 50)
        this.rotation = new THREE.Vector3(0, Math.PI / 2.0, 0)

        this.background_plane = new PlaneAPI(30, 30, this.position, this.rotation)

        this.username_label = new FloatingText('Username :', renderer_api)
        this.password_label = new FloatingText('Password :', renderer_api)

        this.background_plane.create_standard(renderer_api.scene)

        /*
        var loader = new THREE.FontLoader()
        loader.load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/font/helvetiker_regular.typeface.json', function(tex){
            var  textGeo = new THREE.TextGeometry('Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday', {
                size: 80,
                height: 4,
                curveSegments: 2,
                font: tex
            })
            var  color = new THREE.Color()
            color.setRGB(100, 100, 100)
            var  textMaterial = new THREE.MeshLambertMaterial({ color: color })
            var  text = new THREE.Mesh(textGeo, textMaterial)
            renderer_api.add_to_scene(text)
        })
        */
    },

    update: function(player_position_vector, player_direction_vector) {

        var text_multiplier = 45.0
        var text_position = new THREE.Vector3(player_position_vector.x + text_multiplier * player_direction_vector.x,
            player_position_vector.y + text_multiplier * player_direction_vector.y,
            player_position_vector.z + text_multiplier * player_direction_vector.z)

        this.set_position(player_position_vector.x + 50 * player_direction_vector.x, player_position_vector.y + 50 * player_direction_vector.y, player_position_vector.z + 50 * player_direction_vector.z)
        this.background_plane.mesh.lookAt(player_position_vector)

        this.username_label.set_position(text_position.x, text_position.y, text_position.z)
        this.password_label.set_position(text_position.x, text_position.y, text_position.z)
        this.username_label.get_mesh().lookAt(player_position_vector)
        this.password_label.get_mesh().lookAt(player_position_vector)
    },

    set_position: function(x, y, z) {
        this.background_plane.position.x = x
        this.background_plane.position.y = y
        this.background_plane.position.z = z
    },

    set_rotation: function(x, y, z) {
        this.background_plane.rotation.x = x
        this.background_plane.rotation.y = y
        this.background_plane.rotation.z = z
    }

}