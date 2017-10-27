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

    camera          : null,

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
            this.near_clipping = 1.0
            this.far_clipping  = 10000.0
            this.renderer      = new THREE.WebGLRenderer({antialias: true, alpha: true})
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(this.window_width, this.window_height)
            this.renderer.setClearColor(0x000000, 1)

            this.camera = new THREE.PerspectiveCamera(this.field_of_view, this.aspect_ratio, this.near_clipping, this.far_clipping)

            this.renderer.domElement.style.position = 'absolute'
            this.renderer.domElement.style.zIndex = 1
            this.renderer.domElement.style.top = 0

            document.body.appendChild(this.renderer.domElement)

            window.addEventListener('resize', this.on_window_resize.bind(this), false)
        }
    },

    pre_render: function() {
        this.stats_api.pre_render()
    },

    render: function() {
        this.renderer.render(WORLD_MANAGER.current_world.scene, this.camera)
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