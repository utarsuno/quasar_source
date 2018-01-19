'use strict';

const LIGHT_CIRCLE_RADIUS = 1000;

function World() {

    this.currently_looked_at_object = null;
    this.raycaster                  = new THREE.Raycaster();
    this.scene                      = new THREE.Scene();
    this.player_menu                = new PlayerMenu(this);
    this.floating_cursor            = new FloatingCursor(this);

    this.root_attachables = [];

    this.default_tab_target         = null;
    this.interactive_objects        = [];

    this._previously_intersected_plane = null;

    // Base code from : https://codepen.io/asjas/pen/pWawPm
    var Element = function ( id, x, y, z, ry ) {

        l('Creating element!');

        var div = document.createElement( 'div' );
        div.style.width = '480px'; // was 480
        div.style.height = '360px'; // was 360
        div.style.backgroundColor = '#000';
        var iframe = document.createElement( 'iframe' );
        iframe.style.width = '480px';
        iframe.style.height = '360px';
        iframe.style.border = '0px';
        iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0'   ].join( '' );
        div.appendChild( iframe );
        var object = new THREE.CSS3DObject(div);
        object.position.set( x, y, z );
        object.rotation.y = ry;
        return object;
    };

    this.add_css_scene = function() {
        this.css_scene = new THREE.Scene();

        this.container = document.getElementById('container');

        this.group = new THREE.Group();

        this.group.add( new Element( 'xBOqwRRj82A', 0, 0, 240, 0 ) );
        this.group.add( new Element( 'x4q86IjJFag', 240, 0, 0, Math.PI / 2 ) );
        this.group.add( new Element( 'JhngfOK_2-0', 0, 0, - 240, Math.PI ) );
        this.group.add( new Element( 'Grg3461lAPg', - 240, 0, 0, - Math.PI / 2 ) );

        this.css_scene.add(this.group);

        this.container.appendChild(MANAGER_RENDERER.css_renderer.domElement);
    };

    this.add_to_scene = function(object) {
        this.scene.add(object);
    };

    this.set_cursor_position = function(position) {
        /*
        this.floating_cursor.set_position(position);

        // Check if we need to change cursor texture type.
        if (is_defined(this.currently_looked_at_object)) {
            if (this.currently_looked_at_object.hasOwnProperty('type')) {

                // TODO : Complete all the case scenarios!!!

                if (!this.currently_looked_at_object.hasOwnProperty('normal')) {
                    l('WARNING! NO NORMAL TO USE!!');
                    l('This is for the following object.');
                    raise_exception('no normal to use!');
                }

                if (this.currently_looked_at_object['type'] === TYPE_BUTTON || this.currently_looked_at_object['type'] === TYPE_CHECK_BOX) {
                    this.floating_cursor.set_cursor(CURSOR_TYPE_HAND);
                } else {
                    this.floating_cursor.set_cursor(CURSOR_TYPE_POINTER);
                }
            }
        }
        */
    };

    this.parse_mouse_drag = function(movement_x, movement_y) {
        /*
        if (this.floating_cursor.engaged) {
            if (is_defined(this.floating_cursor.current_floating_wall)) {
                this.floating_cursor.current_floating_wall.perform_action(this.floating_cursor.current_cursor.userData.name);
            }
        }
        */
    };

    this.parse_mouse_movement = function(movement_x, movement_y) {
        /*
        if (CURRENT_PLAYER.is_engaged()) {
            var c = MANAGER_WORLD.current_world.currently_looked_at_object;
            if (is_defined(c)) {
                if (c.requires_mouse_x_movement) {
                    c.provide_mouse_x_movement(movement_x);
                }
                if (c.requires_mouse_y_movement) {
                    c.provide_mouse_y_movement(movement_y);
                }
            }
        }
        */
    };

    this.wheel_event = function(delta) {
        if (this.floating_cursor.engaged) {
            this.floating_cursor.current_floating_wall.wheel_event(delta);
        }
    };

    this.update_interactive_objects = function() {
        // Don't check for an intersection if the cursor is currently engaged or the paused menu is displayed.
        //if (this.floating_cursor.engaged || GUI_PAUSED_MENU.currently_displayed) {
        //    return;
        //}



        /*
        if (is_defined(MANAGER_WORLD.current_floating_cursor.current_cursor.userData.name)) {
            if (MANAGER_WORLD.current_floating_cursor.engaged) {
                var current_cursor = MANAGER_WORLD.current_floating_cursor.current_cursor.userData.name;
                if (current_cursor === CURSOR_TYPE_MOUSE || current_cursor === CURSOR_TYPE_VERTICAL || current_cursor === CURSOR_TYPE_HORIZONTAL) {
                    return;
                }
            }
        }
        */

        this.raycaster.set(CURRENT_PLAYER.fps_controls.get_position(), CURRENT_PLAYER.fps_controls.get_direction());

        var match_was_found = false;

        var closest_object = null;
        var closest_data_thing = null;
        var final_point = null;

        var smallest_distance = 99999;

        var interactive_index = -1;

        // Find out what's currently being looked at if anything.
        for (var i = 0; i < this.interactive_objects.length; i++) {
            // The true parameter indicates recursive search.
            var current_smallest_distance = 9999;
            var intersections = this.raycaster.intersectObject(this.interactive_objects[i].object3D, true);

            if (intersections.length > 0) {
                for (var d = 0; d < intersections.length; d++) {
                    if (intersections[d].distance < current_smallest_distance) {
                        current_smallest_distance = intersections[d].distance;
                        closest_object = intersections[d].object;
                        closest_data_thing = intersections[d];
                    }
                }
                // Now get the interactive_object match of the found intersections object.
                for (var m = 0; m < this.interactive_objects.length; m++) {

                    var has_match = false;

                    // TODO : Check if the mesh or geometry is used. Both probably don't need to check both.
                    if (this.interactive_objects[m].mesh.uuid === closest_object.uuid || this.interactive_objects[m].geometry.uuid === closest_object.uuid) {
                        has_match = true;
                    }

                    if (has_match) {
                        if (current_smallest_distance < smallest_distance) {
                            smallest_distance = current_smallest_distance;
                            interactive_index = m;
                            final_point = closest_data_thing;
                        }
                    }
                }
            }
        }

        // A match was found.
        if (interactive_index !== NOT_FOUND) {
            // A new object is being looked at, so look away from the old one and look at new one.
            if (this.currently_looked_at_object !== this.interactive_objects[interactive_index]) {
                if (this.currently_looked_at_object !== null) {
                    this.currently_looked_at_object.look_away();
                }
                this.currently_looked_at_object = this.interactive_objects[interactive_index];
                this.currently_looked_at_object.look_at();
            }
            // FOR_DEV_START
            if (!is_defined(this.currently_looked_at_object)) {
                raise_exception('hodl IOTA');
            }
            // FOR_DEV_END
            if (this.currently_looked_at_object.uses_cursor) {
                this.floating_cursor.cursor_needed_from_interactive_objects = true;
                this.set_cursor_position(final_point.point);
            }
            match_was_found = true;
        }

        if (!match_was_found) {
            // If the 'currently_looked_at_object' is not null then set it to null.
            if (this.currently_looked_at_object !== null) {
                this.currently_looked_at_object.look_away();
                this.currently_looked_at_object = null;

                if (MANAGER_WORLD.current_floating_cursor.engaged) {
                    l('Another disengage fix test.');
                    MANAGER_WORLD.current_floating_cursor.disengage();
                }
            }

            // Now check for for any intersection to custom planes.
            if (is_defined(this.entity_walls)) {
                this._check_for_custom_plane_intersections();
            }
        } else {
            // Since a match was found check if we need to look away from the any previous floating wall.
            if (is_defined(this._previously_intersected_plane)) {
                this._previously_intersected_plane.look_away();
                this._previously_intersected_plane.currently_engaged_with_cursor = false;
                this._previously_intersected_plane = null;
            }
        }
    };

    this._check_for_custom_plane_intersections = function() {
        var player_parametric_equation = CURRENT_PLAYER.get_parametric_equation();
        var player_position = CURRENT_PLAYER.get_position();

        // Eventually just keep track of a persisting list.
        var all_walls = [];

        for (var w = 0; w < this.entity_walls.length; w++) {
            if (this.entity_walls[w].wall.scalable) {
                all_walls.push(this.entity_walls[w].wall);
            }
            // TODO : Refactor this..
            var all_children = this.entity_walls[w].wall.get_all_floating_wall_children_recursively();
            for (var c = 0; c < all_children.length; c++) {
                if (all_children[c].scalable) {
                    all_walls.push(all_children[c]);
                }
            }
        }

        var smallest_distance = 999999;
        var smallest_index = NOT_FOUND;
        var best_result = null;
        for (w = 0; w < all_walls.length; w++) {
            var result = all_walls[w].get_player_look_at_intersection_point(player_parametric_equation);
            if (result !== false) {
                // Intersection position.
                var ip = result[0];
                var distance = sqrt(squared(player_position.x - ip.x) + squared(player_position.y - ip.y) + squared(player_position.z - ip.z));
                if (distance < smallest_distance) {
                    distance = smallest_distance;
                    smallest_index = w;
                    best_result = result;
                }
            }
        }

        if (smallest_index !== NOT_FOUND) {
            if (!all_walls[smallest_index].currently_engaged_with_cursor) {
                all_walls[smallest_index].look_at();
                all_walls[smallest_index].currently_engaged_with_cursor = true;
            }
            this._previously_intersected_plane = all_walls[smallest_index];
            MANAGER_WORLD.current_floating_cursor.set_data([best_result[0], best_result[1], all_walls[smallest_index]]);
            //MANAGER_WORLD.current_world.floating_cursor.
        } else {

            /*
            if (is_defined(MANAGER_WORLD.current_floating_cursor.current_cursor.userData.name)) {
                if (MANAGER_WORLD.current_floating_cursor.current_cursor.userData.name === CURSOR_TYPE_MOUSE) {
                    return;
                }
            }*/

            if (is_defined(this._previously_intersected_plane)) {
                this._previously_intersected_plane.look_away();
                this._previously_intersected_plane.currently_engaged_with_cursor = false;
                this._previously_intersected_plane = null;
            }
        }

    };

    this.tab_to_next_interactive_object = function() {
        if (MANAGER_WORLD.current_floating_cursor.engaged) {
            MANAGER_WORLD.current_floating_cursor.disengage();
        }

        if (is_defined(this.currently_looked_at_object)) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage();
                this.currently_looked_at_object.look_away();
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target;
                this.currently_looked_at_object.look_at();
                if (this.currently_looked_at_object.maintain_engage_when_tabbed_to) {
                    this.currently_looked_at_object.engage();
                } else {
                    CURRENT_PLAYER.enable_controls();
                }
            } else {
                this.currently_looked_at_object.look_away();
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target;
                this.currently_looked_at_object.look_at();
            }
            CURRENT_PLAYER.look_at(this.currently_looked_at_object.object3D.position);
        } else if (is_defined(this.default_tab_target)) {
            this.currently_looked_at_object = this.default_tab_target;
            CURRENT_PLAYER.look_at(this.currently_looked_at_object.object3D.position);
            this.currently_looked_at_object.look_at();
        }
    };

    this.single_left_click = function() {
        if (this.currently_looked_at_object !== null) {
            if (!this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.engage();
            } else if (MANAGER_WORLD.current_floating_cursor.engaged) {
                MANAGER_WORLD.current_floating_cursor.disengage();
            }
        } else {
            if (MANAGER_WORLD.current_floating_cursor.engaged) {
                MANAGER_WORLD.current_floating_cursor.disengage();
                l('Bug fix test 0x1');
                CURRENT_PLAYER.enable_controls();
            }
        }
    };

    // For now a middle click will act like a left click.
    this.single_middle_click = function() {
        this.single_left_click();
    };

    this.single_right_click = function() {
        if (!GUI_PAUSED_MENU.is_visible()) {
            if (this.currently_looked_at_object !== null) {
                if (this.currently_looked_at_object.is_engaged()) {
                    this.currently_looked_at_object.disengage();
                    CURRENT_PLAYER.enable_controls();
                }
            }

            if (MANAGER_WORLD.current_floating_cursor.engaged) {
                MANAGER_WORLD.current_floating_cursor.disengage();
            }
        }
    };

    this.multi_left_click = function() {
        //l('Multi left click!');
        //l(GUI_PAUSED_MENU.is_visible());
        //l(!MANAGER_LOADING.currently_loading());
        if (GUI_PAUSED_MENU.is_visible() && !MANAGER_LOADING.currently_loading()) {
            //l('Requesting pointer lock!');

            if (this.currently_looked_at_object !== null) {
                if (this.currently_looked_at_object.is_engaged()) {
                    this.currently_looked_at_object.disengage();
                }
            }

            GUI_PAUSED_MENU.make_invisible();
            MANAGER_POINTER_LOCK.request_pointer_lock();
        } else {
            // For now just perform a regular left click action.
            this.single_left_click();
        }
    };

    this.multi_middle_click = function() {
        // Fow now just perform a regular left click action.
        this.single_left_click();
    };

    this.multi_right_click = function() {
        // Fow nbow just perform a regular right click action.
        this.single_right_click();
    };

    this.key_down_event_for_interactive_objects = function(event) {
        if (event.keyCode === KEY_CODE_BACK_SLASH) {
            if (this.currently_looked_at_object !== null) {
                if (this.currently_looked_at_object.is_engaged()) {
                    this.currently_looked_at_object.disengage();
                    CURRENT_PLAYER.enable_controls();
                }
            }
        } else if (event.keyCode === KEY_CODE_TAB) {
            this.tab_to_next_interactive_object();
            //event.preventDefault()
            event.stopPropagation();
        } else if (this.currently_looked_at_object !== null) {
            //this.currently_looked_at_object.parse_keycode(event);
        }

        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.needs_engage_for_parsing_input) {
                this.currently_looked_at_object.parse_keycode(event);
            }
        }
        if (event.keyCode === KEY_CODE_E || event.keyCode === KEY_CODE_ENTER) {
            if (this.currently_looked_at_object !== null) {
                if (!this.currently_looked_at_object.is_engaged()) {
                    if (this.currently_looked_at_object.hasOwnProperty('_disabled')) {
                        if (!this.currently_looked_at_object['_disabled']) {
                            this.currently_looked_at_object.engage();
                        }
                    } else {
                        this.currently_looked_at_object.engage();
                    }
                }
            }
        }

        // No defaults will be useful (for now).
        event.preventDefault();
    };

    this.set_default_tab_target = function(default_tab_target) {
        this.default_tab_target = default_tab_target;
    };

    /*__   __   ___      ___  ___     __     __  ___       __   ___
     /  ` |__) |__   /\   |  |__     |__) | /  `  |  |  | |__) |__
     \__, |  \ |___ /~~\  |  |___    |    | \__,  |  \__/ |  \ |___ */
    this.cancel_picture_prompt = function(picture_prompt_wall) {
        picture_prompt_wall.fully_remove_self_and_all_sub_attachments();
    };

    this.create_picture = function(picture_prompt_wall) {
        picture_prompt_wall.fully_remove_self_and_all_sub_attachments();

        // TODO : Create the picture wall!
        l('TODO : Create the picture wall!');
    };

    this.create_picture_prompt = function(position, normal) {
        var picture_prompt_wall = new FloatingWall(500, 100, position, normal, this, true);

        picture_prompt_wall.add_row_3D_text(false, -1, 'Create New Picture', TYPE_TITLE);

        picture_prompt_wall.add_row_2D_text([0, ONE_THIRD], 0, 'Image URL:', TYPE_CONSTANT);
        picture_prompt_wall.add_row_2D_text([ONE_THIRD, 1], 0, '', TYPE_INPUT);

        var cancel_button = picture_prompt_wall.add_row_2D_text([0, HALF], 2, 'Cancel', TYPE_BUTTON);
        cancel_button.set_engage_function(this.cancel_picture_prompt.bind(this, picture_prompt_wall));
        cancel_button.set_default_color(COLOR_RED);
        cancel_button.set_color(COLOR_RED, true);

        var create_button = picture_prompt_wall.add_row_2D_text([HALF, 1], 2, 'Create', TYPE_BUTTON);
        create_button.set_engage_function(this.create_picture.bind(this, picture_prompt_wall));
        create_button.set_default_color(COLOR_GREEN);
        create_button.set_color(COLOR_GREEN, true);

        this.root_attachables.push(picture_prompt_wall);

        picture_prompt_wall.refresh_position_and_look_at();
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
