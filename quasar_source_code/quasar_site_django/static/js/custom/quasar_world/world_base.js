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


                console.log(this.raycaster.intersectObject(this.interactive_objects[i].object3D, true))


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
        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage(this.player)
                this.currently_looked_at_object.look_away()
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target
                this.currently_looked_at_object.look_at()
                if (this.currently_looked_at_object.maintain_engage_when_tabbed_to) {
                    this.currently_looked_at_object.engage(this.player)
                }
            } else {
                this.currently_looked_at_object.look_away()
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target
                this.currently_looked_at_object.look_at()
            }
            this.player.look_at(this.currently_looked_at_object.object3D.position)
        } else if (this.default_tab_target !== null && this.default_tab_target !== undefined) {
            this.currently_looked_at_object = this.default_tab_target
            this.player.look_at(this.currently_looked_at_object.object3D.position)
            this.currently_looked_at_object.look_at()
        }
    }

    this.key_down_event_for_interactive_objects = function(event) {
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
        if (event.keyCode == KEY_CODE_E || event.keyCode === KEY_CODE_ENTER) {
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

    // World defaults.

    // Create the lighting and default ground.
    var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 10, 10)
    plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
    //var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
    var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
    var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
    this.add_to_scene(plane_mesh)

    var light3 = new THREE.PointLight(0xccffcc, .8, 0)
    light3.position.set(5, 100, 5)
    this.add_to_scene(light3)

    var color1 = '#b9ffd2'
    var color2 = '#090920'
    var light2 = new THREE.HemisphereLight(color1, color2, .5)
    this.add_to_scene(light2)

    var light = new THREE.AmbientLight(0x404040, .2) // soft white light
    this.add_to_scene(light)

}
