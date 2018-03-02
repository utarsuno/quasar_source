'use strict';

function World(world_entity) {

    this.entity = world_entity;

    this.currently_looked_at_object = null;
    this.raycaster                  = new THREE.Raycaster();
    this.scene                      = new THREE.Scene();
    this.player_menu                = new PlayerMenu(this);
    this.floating_cursor            = new FloatingCursor(this);

    this.root_attachables = [];

    this.default_tab_target         = null;
    this.interactive_objects        = [];

    // TODO : Implement this.
    this.player_exit_position = null;

    this.add_to_scene = function(object) {
        this.scene.add(object);
    };

    this.look_away_from_currently_looked_at_object = function() {
        this.currently_looked_at_object.look_away();
        if (this.currently_looked_at_object.uses_cursor) {
            this.floating_cursor.detach();
        }
        this.currently_looked_at_object = null;
    };

    this._match_found = function(object_to_match) {
        for (var i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i].mesh.uuid === object_to_match.uuid || this.interactive_objects[i].geometry.uuid === object_to_match.uuid) {
                return i;
            }
        }
        return -1;
    };

    this.update_interactive_objects = function() {
        // Don't perform an update if currently engaged with 3D text.
        if (is_defined(this.currently_looked_at_object)) {
            if (this.currently_looked_at_object.maintain_engage_until_right_click) {
                if (this.currently_looked_at_object.is_engaged()) {
                    return;
                }
            }
        }

        this.raycaster.set(CURRENT_PLAYER.fps_controls.get_position(), CURRENT_PLAYER.fps_controls.get_direction());
        var smallest_distance = 99999;
        var interactive_index = -1;
        var intersection_data = null;

        // Find out what's currently being looked at if anything.
        for (var i = 0; i < this.interactive_objects.length; i++) {
            // The true parameter indicates recursive search.
            var intersections = this.raycaster.intersectObject(this.interactive_objects[i].object3D, true);

            for (var d = 0; d < intersections.length; d++) {
                if (intersections[d].distance < smallest_distance) {
                    var match_found = this._match_found(intersections[d].object);
                    if (match_found !== NOT_FOUND) {
                        smallest_distance = intersections[d].distance;
                        interactive_index = match_found;
                        intersection_data = intersections[d];
                    }
                }
            }
        }

        if (interactive_index === NOT_FOUND) {
            if (this.currently_looked_at_object !== null) {
                this.look_away_from_currently_looked_at_object();
            }

            // Check for any custom plane intersection.

        } else {
            // Interactive match found.
            var interactive_match = this.interactive_objects[interactive_index];

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
                this.currently_looked_at_object.look_at();
                this.floating_cursor.attach(interactive_match);
                this.floating_cursor.update_position(intersection_data.point);
            }
        }
    };

    this.set_default_tab_target = function(default_tab_target) {
        this.default_tab_target = default_tab_target;
    };

    /*__   __   ___      ___  ___     __     __  ___       __   ___
     /  ` |__) |__   /\   |  |__     |__) | /  `  |  |  | |__) |__
     \__, |  \ |___ /~~\  |  |___    |    | \__,  |  \__/ |  \ |___ */
    this.create_new_floating_picture = function(image_file) {
        var floating_picture = new FloatingPicture(image_file, this, false);
        // TODO : Move this logic.
        this.root_attachables.push(floating_picture);
    };

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    this.remove_from_scene = function(object) {
        this.scene.remove(object);

        // TODO : Refactor this
        if (object.hasOwnProperty('object3D')) {
            this.scene.remove(object.object3D);
        }
    };

    this.remove_from_interactive_then_scene = function(object_to_remove) {
        // First remove the interactive.
        var index_to_remove = -1;
        for (var i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i] === object_to_remove) {
                index_to_remove = i;
                break;
            }
        }
        if (index_to_remove !== -1) {
            this.interactive_objects.splice(index_to_remove, 1);
        }
        // Next remove the object from the scene.
        this.remove_from_scene(object_to_remove);
    };
}
