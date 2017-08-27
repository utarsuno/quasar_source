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

    // These variables get added later on.
    camera          : null,

    __init__: function() {
        this.webgl_enabled = !!Detector.webgl
        if (this.webgl_enabled === false) {
            this.warning_message = Detector.getWebGLErrorMessage()
        } else {
            // Since WebGL is enabled we can proceed.
            this.field_of_view = 70
            this.get_window_properties()
            this.near_clipping = 0.1
            this.far_clipping  = 1000
            this.renderer      = new THREE.WebGLRenderer({antialias: true, alpha:true})
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(this.window_width, this.window_height)
            this.renderer.setClearColor(0x000000, 0)

            this.renderer.domElement.style.position = 'absolute'
            this.renderer.domElement.style.zIndex = -5
            this.renderer.domElement.style.top = 0

            //document.body.appendChild(this.renderer.domElement)

            window.addEventListener('resize', this.on_window_resize.bind(this), false)
        }
    },

    render: function(scene, camera) {
        this.renderer.render(scene, camera)
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
    }
}