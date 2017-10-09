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
        this.world_login.player = player
        this.world_home.player = player
    },

    update_current_scene: function() {
        this.current_world.update()
    },

    set_current_world: function(world) {
        if (this.current_world !== null) {
            this.current_world.exit_world()
            this.current_world.current_world = false
            this.previous_world = this.current_world
        }
        this.current_world = world
        this.current_world.current_world = true
        this.current_scene = this.current_world.scene

        this.current_world.enter_world()
    },

    key_down_event: function(event) {
        this.current_world.key_down_event(event)
    },

    add_to_current_scene: function(object) {
        this.current_world.add(object)
    }

}