'use strict'

function RendererAPI() {
    this.__init__()
}

RendererAPI.prototype = {
    field_of_view   : null,
    window_width    : null,
    window_height   : null,
    aspect_ratio    : null,
    near_clipping   : null,
    far_clipping    : null,
    renderer        : null,
    webgl_enabled   : null,
    warning_message : null,

    // Custom objects.
    stats_api       : null,

    // Three js object.
    previous_world  : null,
    previous_scene  : null,
    world           : null,
    scene           : null,
    current_scene   : null,

    // These variables get added later on.
    camera          : null,

    // Player controlled object.
    crosshair       : null,

    __init__: function() {
        this.webgl_enabled = !!Detector.webgl
        if (this.webgl_enabled === false) {
            this.warning_message = Detector.getWebGLErrorMessage()
            console.log('WebGL is not enabled!')
            console.log(this.get_warning_message())
            throw new Error('WebGL is not enabled!')
        } else {
            this.stats_api = new StatsAPI()

            // Since WebGL is enabled we can proceed.
            this.field_of_view = 70
            this.get_window_properties()
            this.near_clipping = 0.1
            this.far_clipping  = 10000
            this.renderer      = new THREE.WebGLRenderer({antialias: true, alpha: true})
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(this.window_width, this.window_height)
            this.renderer.setClearColor(0x000000, 1)

            this.renderer.domElement.style.position = 'absolute'
            this.renderer.domElement.style.zIndex = 1
            this.renderer.domElement.style.top = 0

            document.body.appendChild(this.renderer.domElement)

            window.addEventListener('resize', this.on_window_resize.bind(this), false)
        }
    },

    update_current_scene: function() {
        this.world.update()
    },

    set_current_world: function(world) {
        if (this.world !== null) {
            this.world.exit_world()
            this.previous_world = this.world
            this.previous_scene = this.scene
        }
        this.world = world
        this.scene = this.world.scene

        this.world.enter_world()
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    pre_render: function() {
        this.stats_api.pre_render()
    },

    render: function() {
        this.renderer.render(this.scene, this.camera)
    },

    post_render: function() {
        this.stats_api.post_render()
    },

    get_window_properties: function() {
        this.window_width  = window.innerWidth
        this.window_height = window.innerHeight
        this.aspect_ratio  = this.window_width / this.window_height
    },

    on_window_resize: function() {
        this.get_window_properties()
        this.camera.aspect = this.aspect_ratio
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.window_width, this.window_height)
        this.crosshair.set_center_x_center_y(this.window_width / 2, this.window_height / 2)
    },

    set_camera: function(camera) {
        this.camera = camera
    },

    is_webgl_enabled: function() {
        return this.webgl_enabled
    },

    get_warning_message: function () {
        return this.warning_message
    }
}

// NOT BEING USED FOR THE TIME BEING, POTENTIALLY FOREVER c:
function CSSRendererAPI() {
    this.__init__()
}

CSSRendererAPI.prototype = {

    renderer: null,

    __init__: function() {
        this.renderer = new THREE.CSS3DRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.domElement.style.position = 'absolute'
        this.renderer.domElement.style.top = 0

        //document.body.appendChild(this.renderer.domElement)

        window.addEventListener('resize', this.on_window_resize.bind(this), false)
    },

    on_window_resize: function() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}