'use strict'

function SettingsWorld() {
    this.__init__()
}

SettingsWorld.prototype = {

    __init__: function() {
        // Inherit world properties.
        World.call(this)
    },

    update: function() {
        this.update_interactive_objects()
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
    },

    enter_world: function() {
        this.current_world = true

        this.player.set_position(new THREE.Vector3(130, 90, 300))

        if (GLOBAL_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME) === 'true') {
            if (GLOBAL_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== undefined) {
                if (GLOBAL_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== 'undefined') {
                    this.login_username.set_input_value(GLOBAL_COOKIES.get(COOKIE_REMEMBERED_USERNAME))
                }
            }
        }
    },

    exit_world: function() {
        this.current_world = false
    }
}