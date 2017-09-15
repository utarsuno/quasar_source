'use strict'

function LoginPanel(renderer_api) {
    this.__init__(renderer_api)
}

function FloatingText(text) {
    this.__init__(text)
}

FloatingText.prototype = {
    text: null,
    _text_plane: null,

    __init__: function(text) {
        this.text = text

        var text_position = new THREE.Vector3(40, 40, 40)
        var text_rotation = new THREE.Vector3(0, 0, 0)
        this._text_plane = new PlaneAPI(200, 50, text_position, text_rotation)
        this._text_plane.create_dynamic_text(this.text, renderer_api)
    },

    get_mesh: function() {
        return this._text_plane.mesh
    }
}

LoginPanel.prototype = {

    renderer_api    : null,

    background_plane: null,
    position        : null,
    rotation        : null,

    // GUI components.
    username_label  : null,
    password_label  : null,

    __init__: function(renderer_api) {

        this.renderer_api = renderer_api

        this.position = new THREE.Vector3(50, 50, 50)
        this.rotation = new THREE.Vector3(0, Math.PI / 2.0, 0)

        this.background_plane = new PlaneAPI(30, 30, this.position, this.rotation)

        this.username_label = new FloatingText('Username :')
        this.password_label = new FloatingText('Password :')

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

    set_position: function(x, y, z) {
        this.background_plane.position.x = x
        this.background_plane.position.y = y
        this.background_plane.position.z = z
    },

    set_rotation: function(x, y, z) {
        this.background_plane.rotation.x = x
        this.background_plane.rotation.y = y
        this.background_plane.rotation.z = z
    },

}