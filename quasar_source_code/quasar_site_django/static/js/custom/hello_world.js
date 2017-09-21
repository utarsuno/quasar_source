'use strict'

// Renders all the worlds.
var renderer_api = new RendererAPI()

// Model of the user.
var player = new Player(renderer_api)

// LoginWorld.
var login_world = new LoginWorld()

var previous_time = performance.now()

var animate = function () {
    //shader_api.render()

    requestAnimationFrame(animate)

    renderer_api.pre_render()

    var time = performance.now()
    var delta = (time - previous_time) / 1000

    player.update(delta)

    renderer_api.render()
    //css_renderer_api.renderer.render(cssScene, camera)

    renderer_api.post_render()

    previous_time = time
}

animate()

