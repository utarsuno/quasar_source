'use strict'

// Renders all the worlds.
var renderer_api = new RendererAPI()

// WorldManager.
WORLD_MANAGER = new WorldManager()
// Entity Manager.
ENTITY_MANAGER = new EntityManager()

// Model of the user. Must be created AFTER the scene gets set.
var player = new Player(renderer_api)

WORLD_MANAGER.set_player(player)
WORLD_MANAGER.set_current_world(WORLD_MANAGER.world_login)

// Now create the global audio.
AUDIO_MANAGER = new AudioManager(player)

var previous_time = performance.now()

var animate = function () {
    requestAnimationFrame(animate)

    renderer_api.pre_render()

    var time = performance.now()
    var delta = (time - previous_time) / 1000

    player.update(delta)
    WORLD_MANAGER.update_current_scene()

    renderer_api.render()

    renderer_api.post_render()

    previous_time = time
}

animate()
