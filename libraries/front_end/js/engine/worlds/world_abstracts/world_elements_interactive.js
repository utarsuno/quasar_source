'use strict';

$_QE.prototype.WorldElementsInteractive = function() {

    this.elements_interactive = [];
    this.raycaster            = new THREE.Raycaster();

    // For cache optimizations.
    this._intersections       = [];

    this.update_elements_interactive = function() {
        // Don't check for interactive objects if currently engaged with an input field as the camera doesn't move when typing.
        if (this.currently_looked_at_object != null) {
            if (this.currently_looked_at_object.feature_typing) {
                if (this.currently_looked_at_object.is_engaged()) {
                    return;
                }
            }
        }

        // Faster than '.length = 0'
        if (this._intersections.length != 0) {
            this._intersections = [];
        }

        this.raycaster.set(this.player.get_position(), this.player.get_normal());
        // Max search distance.
        let smallest_distance = 99999;
        let interactive_index = -1;
        let intersection_data = null;
        let the_match         = null;

        // Find out what's currently being looked at if anything.
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {
            // The true parameter indicates recursive search.
            //this.raycaster.intersectObject(this.elements_interactive[i].object3D, true, this._intersections);

            if (this.elements_interactive[i].group != null) {
                //TODO: check if this condition gets hit.
                this.raycaster.intersectObject(this.elements_interactive[i].group, true, this._intersections);
            } else {
                this.raycaster.intersectObject(this.elements_interactive[i].mesh, true, this._intersections);
            }
            //this.raycaster.intersectObject(this.elements_interactive[i].mesh, true, this._intersections);

            // Only check the first result returned as they are already sorted by distance.
            if (this._intersections.length !== 0) {
                if (this._intersections[0].distance < smallest_distance) {

                    if (this._intersections[0].object.userData[USER_DATA_KEY_PARENT_OBJECT] != null) {
                        smallest_distance = this._intersections[0].distance;
                        interactive_index = i;
                        intersection_data = this._intersections[0];

                        the_match = intersection_data.object.userData[USER_DATA_KEY_PARENT_OBJECT];
                    }

                    //l('THE INTERSECTION DATA IS:');
                    //l(intersection_data);
                }
            }
        }

        // TODO: User mesh.userData to point to parent object.

        if (interactive_index === NOT_FOUND) {
            if (this.currently_looked_at_object !== null) {
                this.look_away_from_currently_looked_at_object();
            }
        } else {
            if (this.currently_looked_at_object === null) {
                this.set_new_currently_looked_at_object(the_match, intersection_data.point);
            } else if (this.currently_looked_at_object !== the_match) {
                this.look_away_from_currently_looked_at_object();
                this.set_new_currently_looked_at_object(the_match, intersection_data.point);
            }
        }
    };

    this.remove_from_elements_interactive = function(element) {
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {
            if (this.elements_interactive[i] === element) {
                element.in_world_list_elements_interactive = false;
                this.elements_interactive.splice(i, 1);
                return;
            }
        }
    };

    this.add_element_interactive = function(element) {
        this.elements_interactive.push(element);
        element.in_world_list_elements_interactive = true;
    };
};