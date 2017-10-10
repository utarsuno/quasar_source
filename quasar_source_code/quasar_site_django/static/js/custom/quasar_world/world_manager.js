'use strict'

function WorldManager() {
    this.__init__()
}

WorldManager.prototype = {

    player         : null,

    previous_world : null,
    current_world  : null,
    current_scene  : null,

    // Pre-defined worlds.
    world_login    : null,
    world_home     : null,
    world_settings : null,

    __init__: function() {
        this.world_login = new LoginWorld()
        this.world_home = new HomeWorld()
    },

    set_player: function(player) {
        this.player = player
        this.world_login.set_player(player)
        this.world_home.set_player(player)
    },

    update_current_scene: function() {
        this.current_world.update()
    },

    set_current_world: function(world) {
        if (this.current_world !== null) {

            // Before exiting the world make sure to remove the camera reference.
            this.current_world.remove_from_scene(this.player.fps_controls.get_object())

            this.current_world.exit_world()
            this.current_world.current_world = false
            this.previous_world = this.current_world
        }
        this.current_world = world
        this.current_world.current_world = true
        this.current_scene = this.current_world.scene

        // Before adding the world make sure to add the camera reference.
        this.current_world.add_to_scene(this.player.fps_controls.get_object())
        this.current_world.enter_world()
    },

    key_down_event: function(event) {
        this.current_world.key_down_event(event)
    },

    add_to_current_scene: function(object) {
        this.current_world.add(object)
    },

    add_to_all_scenes: function(object) {
        this.world_login.add_to_scene(object)
        this.world_home.add_to_scene(object)
    }

}