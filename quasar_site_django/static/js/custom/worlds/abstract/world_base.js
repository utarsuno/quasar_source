'use strict';

function World(world_entity) {

    this.entity = world_entity;

    this.currently_looked_at_object = null;
    this.raycaster                  = new THREE.Raycaster();
    this.scene                      = new THREE.Scene();

    this.root_attachables = [];

    this.interactive_objects        = [];

    // For reference optimization.
    this._up_vector = UP_VECTOR;

    // For cache optimizations.
    this._intersections = [];

    this.look_away_from_currently_looked_at_object = function() {
        this.currently_looked_at_object.look_away();
        if (this.currently_looked_at_object.uses_cursor) {
            this.floating_cursor.detach();
        }
        this.currently_looked_at_object = null;
    };

    this.delete_all = function() {
        // Delete all the entity groups.
        let eg;
        for (eg = 0; eg < this.entity_groups.length; eg++) {
            this.entity_groups[eg].base_wall.fully_remove_self_and_all_sub_attachments();
        }
        this.entity_groups.length = 0;

        /*
            this.floating_pictures = [];
    this.entity_groups     = [];
    this.month_view_walls  = [];

    this.number_of_videos_to_load = 0;
    this.number_of_videos_loaded  = 0;
    this.video_entities = [];
    this.videos            = [];
         */
    };

    this.update_interactive_objects = function() {
        // Don't check for interactive objects if currently engaged with an input field as the camera doesn't move when typing.
        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.needs_mobile_keyboard) {
                if (this.currently_looked_at_object.is_engaged()) {
                    return;
                }
            }
        }

        this._intersections.length = 0;

        //this.raycaster.set(CURRENT_PLAYER.fps_controls.get_position(), CURRENT_PLAYER.fps_controls.get_direction());
        this.raycaster.set(CURRENT_PLAYER.fps_controls.yaw.position, CURRENT_PLAYER.fps_controls.get_direction());
        let smallest_distance = 99999;
        let interactive_index = -1;
        let intersection_data = null;

        // Find out what's currently being looked at if anything.
        let i;
        for (i = 0; i < this.interactive_objects.length; i++) {
            // The true parameter indicates recursive search.
            this.raycaster.intersectObject(this.interactive_objects[i].object3D, true, this._intersections);

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
            let interactive_match = this.interactive_objects[interactive_index];

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
                this.look_at_currently_looked_at_object(false, false);
                this.floating_cursor.attach(interactive_match);
                this.floating_cursor.update_position(intersection_data.point);
            }
        }
    };

    this.look_at_currently_looked_at_object = function(have_player_camera_look_at, set_cursor) {
        if (is_defined(this.currently_looked_at_object.tab_parent)) {
            MANAGER_WORLD.current_world.set_default_tab_target(this.currently_looked_at_object.tab_parent);
        }
        if (have_player_camera_look_at) {
            CURRENT_PLAYER.look_at(this.currently_looked_at_object.object3D.position);
        }
        if (set_cursor) {
            this.floating_cursor.attach(this.currently_looked_at_object);
        }
        this.currently_looked_at_object.look_at();
    };

    this.add_to_scene = function(object) {
        this.scene.add(object);
    };

    /*__   __   ___      ___  ___     __     __  ___       __   ___
     /  ` |__) |__   /\   |  |__     |__) | /  `  |  |  | |__) |__
     \__, |  \ |___ /~~\  |  |___    |    | \__,  |  \__/ |  \ |___ */
    this.create_new_floating_picture = function(image_file) {
        let floating_picture = new FloatingPicture(image_file, this, false);
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
        let index_to_remove = -1;
        let i;
        for (i = 0; i < this.interactive_objects.length; i++) {
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
