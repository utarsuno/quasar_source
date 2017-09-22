'use strict'

// Renders all the worlds.
var renderer_api = new RendererAPI()

// LoginWorld.
var login_world = new LoginWorld()
renderer_api.set_current_world(login_world)

// Model of the user. Must be created AFTER the scene gets set.
var player = new Player(renderer_api)
login_world.player = player

var previous_time = performance.now()

var animate = function () {
    requestAnimationFrame(animate)

    renderer_api.pre_render()

    var time = performance.now()
    var delta = (time - previous_time) / 1000

    player.update(delta)
    renderer_api.update_current_scene()

    renderer_api.render()

    renderer_api.post_render()

    previous_time = time
}

animate()

