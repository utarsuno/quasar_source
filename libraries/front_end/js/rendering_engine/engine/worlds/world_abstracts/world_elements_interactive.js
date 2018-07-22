'use strict';

$_QE.prototype.WorldElementsInteractive = function() {

    this.elements_interactive = [];
    this.raycaster            = new THREE.Raycaster();

    // For cache optimizations.
    this._intersections = [];

    this.update_elements_interactive = function() {
        // Don't check for interactive objects if currently engaged with an input field as the camera doesn't move when typing.
        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.feature_needs_mobile_keyboard) {
                if (this.currently_looked_at_object.is_engaged()) {
                    return;
                }
            }
        }

        this._intersections.length = 0;

        //this.raycaster.set(CURRENT_PLAYER.fps_controls.get_position(), CURRENT_PLAYER.fps_controls.get_direction());
        this.raycaster.set(this.player.yaw.position, this.player.get_direction());
        let smallest_distance = 99999;
        let interactive_index = -1;
        let intersection_data = null;

        // Find out what's currently being looked at if anything.
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {
            // The true parameter indicates recursive search.
            this.raycaster.intersectObject(this.elements_interactive[i].object3D, true, this._intersections);

            // Only check the first result returned as they are already sorted by distance.
            if (this._intersections.length !== 0) {
                if (this._intersections[0].distance < smallest_distance) {
                    smallest_distance = this._intersections[0].distance;
                    interactive_index = i;
                    intersection_data = this._intersections[0];
                }
            }
        }

        if (interactive_index === NOT_FOUND) {
            if (this.currently_looked_at_object !== null) {
                this.look_away_from_currently_looked_at_object();
            }
        } else {
            // Interactive match found.
            let interactive_match = this.elements_interactive[interactive_index];

            if (this.currently_looked_at_object !== null) {
                if (this.currently_looked_at_object !== interactive_match) {
                    // A new object is being looked at so look away from the old match.
                    this.look_away_from_currently_looked_at_object();
                } else {
                    // Since the currently looked at object match is the same then all we need to do is update the cursor position.
                    this.floating_cursor.update_position(intersection_data.point);
                }
            } else {
                // An object is being looked at for the first time.
                this.currently_looked_at_object = interactive_match;
                this.look_at_currently_looked_at_object(false, true);
            }
        }
    };

    this.remove_from_elements_interactive = function(element) {
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {
            if (this.elements_interactive[i] === element) {
                element._in_world_elements_interactive = false;
                this.elements_interactive.splice(i, 1);
                return;
            }
        }
    };

    this.add_element_interactive = function(element) {
        this.elements_interactive.push(element);
        element._in_world_elements_interactive = true;
    };
};