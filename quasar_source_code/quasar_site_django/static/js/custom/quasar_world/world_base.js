'use strict'

function World() {

    this.player                     = null
    this.currently_looked_at_object = null
    this.raycaster                  = null
    this.current_world              = false
    this.scene                      = new THREE.Scene()

    this.default_tab_target         = null
    this.interactive_objects        = []

    this.add_to_scene = function(object) {
        this.scene.add(object)
    }

    this.remove_from_scene = function(object) {
        this.scene.remove(object)
    }

    this.set_player =  function(player) {
        this.player = player
        this.raycaster = new THREE.Raycaster(this.player.fps_controls.get_position(), this.player.fps_controls.get_direction())
        this.currently_looked_at_object = null
    }

    this.add_interactive_object = function(interactive_object) {
        this.interactive_objects.push(interactive_object)
    }

    this.update_interactive_objects = function() {
        this.raycaster.set(this.player.fps_controls.get_position(), this.player.fps_controls.get_direction())

        var match_was_found = false

        // Find out what's currently being looked at if anything.
        for (var i = 0; i < this.interactive_objects.length; i++) {
            // The true parameter indicates recursive search.
            if (this.raycaster.intersectObject(this.interactive_objects[i].object3D, true).length > 0) {
                // A new object is being looked at, so look away from the old one and look at new one.
                if (this.currently_looked_at_object !== this.interactive_objects[i]) {
                    if (this.currently_looked_at_object !== null) {
                        this.currently_looked_at_object.look_away()
                    }
                    this.currently_looked_at_object = this.interactive_objects[i]
                    this.currently_looked_at_object.look_at()
                }
                // Regardless a match was found and only one intersection can occur so break.
                match_was_found = true
                break
            }
        }
        // If no match was found but 'currently_looked_at_object' is not null then set it to null.
        if (!match_was_found && this.currently_looked_at_object !== null) {
            this.currently_looked_at_object.look_away()
            this.currently_looked_at_object = null
        }
    }

    this.tab_to_next_interactive_object = function() {

        console.log('TAB FUNCTION CALLED!!')

        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage(this.player)
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target
                this.currently_looked_at_object.engage(this.player)
            } else {
                this.currently_looked_at_object.look_away()
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target
                this.currently_looked_at_object.look_at()
            }
            this.player.look_at(this.currently_looked_at_object.object3D.position)
        } else if (this.default_tab_target !== null) {
            this.currently_looked_at_object = this.default_tab_target
            this.player.look_at(this.currently_looked_at_object.object3D.position)
        }
    }

    this.key_down_event_for_interactive_objects = function() {
        if (event.keyCode === KEY_CODE_BACK_SLASH) {
            if (this.currently_looked_at_object !== null) {
                if (this.currently_looked_at_object.is_engaged()) {
                    this.currently_looked_at_object.disengage(this.player)
                }
            }
        } else if (event.keyCode === KEY_CODE_TAB) {
            this.tab_to_next_interactive_object()
            event.preventDefault()
            event.stopPropagation()
        }
        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.needs_engage_for_parsing_input) {
                this.currently_looked_at_object.parse_keycode(event)
            }
        }
        if (event.keyCode == KEY_CODE_E) {
            if (this.currently_looked_at_object !== null) {
                if (!this.currently_looked_at_object.is_engaged()) {
                    this.currently_looked_at_object.engage(this.player)
                }
            }
        }
    }

    this.set_default_tab_target = function(default_tab_target) {
        this.default_tab_target = default_tab_target
    }
}
