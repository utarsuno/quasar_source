'use strict';

const LIGHT_CIRCLE_RADIUS = 1000;

function World(planet_name) {

    this.planet_position            = null;
    this.planet_name                = planet_name;

    this.currently_looked_at_object = null;
    this.raycaster                  = null;
    this.current_world              = false;
    this.scene                      = new THREE.Scene();

    this.default_tab_target         = null;
    this.interactive_objects        = [];

    this.player_menu = new PlayerMenu(this);

    this._previously_intersected_plane = null;

    this.provide_cursor_material = function(cursor_material, texture_name) {
        this.floating_cursor.add_cursor_material(cursor_material, texture_name);
    };

    this.add_to_scene = function(object) {
        this.scene.add(object);
    };

    this.remove_from_scene = function(object) {
        this.scene.remove(object);

        if (object.hasOwnProperty('object3D')) {
            this.scene.remove(object.object3D);
        }

        // TODO : check if there is a geometry or material to dispose of.
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

    this.set_player = function() {
        this.raycaster = new THREE.Raycaster(CURRENT_PLAYER.fps_controls.get_position(), CURRENT_PLAYER.fps_controls.get_direction());
        this.currently_looked_at_object = null;
    };

    this.add_interactive_object = function(interactive_object) {
        this.interactive_objects.push(interactive_object);
    };

    this.set_cursor_position = function(position) {
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
    };

    this.parse_mouse_drag = function(movement_x, movement_y) {
        if (this.floating_cursor.engaged) {
            if (is_defined(this.floating_cursor.current_floating_wall)) {
                this.floating_cursor.current_floating_wall.perform_action(this.floating_cursor.current_cursor.userData.name);
            }
        }
    };

    this.parse_mouse_movement = function(movement_x, movement_y) {
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
    };

    this.wheel_event = function(delta) {
        if (this.floating_cursor.engaged) {
            this.floating_cursor.current_floating_wall.wheel_event(delta);
        }
    };

    this.update_interactive_objects = function() {
        // Don't check for an intersection if the cursor is currently engaged or the paused menu is displayed.
        if (this.floating_cursor.engaged || GUI_PAUSED_MENU.currently_displayed) {
            return;
        }

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
            }

            // Now check for for any intersection to custom planes.
            if (is_defined(this.entity_walls)) {
                this._check_for_custom_plane_intersections();
            }
        }

        // If no match was found but 'currently_looked_at_object' is not null then set it to null.
        if (!match_was_found && this.currently_looked_at_object !== null) {
            this.currently_looked_at_object.look_away();
            this.currently_looked_at_object = null;
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
            }
            //else if (MANAGER_WORLD.current_floating_cursor.engaged) {
            //    MANAGER_WORLD.current_floating_cursor.disengage();
            //}
        } else {
            if (MANAGER_WORLD.current_floating_cursor.engaged) {
                MANAGER_WORLD.current_floating_cursor.disengage();
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
        if (GUI_PAUSED_MENU.is_visible()) {
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

    // World defaults.
    var grid = new vg.HexGrid({cellSize: 100});
    grid.generate({size: 10});
    var board = new vg.Board(grid);
    board.generateTilemap({cellSize: 100, tileScale: 0.99});
    this.add_to_scene(board.group);


    // Create the lighting and default ground.
    //var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
    //plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
    //var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true});
    //var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material);
    //this.add_to_scene(plane_mesh)

    var light3 = new THREE.PointLight(0xccffcc, .5, 0);
    light3.position.set(5, 100, 5);
    this.add_to_scene(light3);

    //var color1 = '#b9ffd2'
    //var color2 = '#090920'
    //var light2 = new THREE.HemisphereLight(color1, color2, .5)
    //this.add_to_scene(light2)

    /////////////////
    this.lights = [];

    //var light_0 = new THREE.PointLight(COLOR_WHITE);

    //var light_c0 = new THREE.PointLight(COLOR_RED);


    var lightr = new THREE.PointLight(0xff8579, .5, 0);
    lightr.position.set(1000, 100, 0);
    this.add_to_scene(lightr);

    var lightg = new THREE.PointLight(0xb1ff90, .5, 0);
    lightg.position.set(0, 100, 1000);
    this.add_to_scene(lightg);

    var lightb = new THREE.PointLight(0x84b5ff, .5, 0);
    lightb.position.set(500, 100, 500);
    this.add_to_scene(lightb);
    /////////////////

    var light = new THREE.AmbientLight(0xffffff, .25); // soft white light
    this.add_to_scene(light);

    this.floating_cursor = new FloatingCursor(this);

    // Add the skybox here as well.
    this.add_sky_box = function(skybox_material) {
        var skybox_geometry = new THREE.BoxGeometry(14000, 14000, 14000);
        var skybox_cube = new THREE.Mesh(skybox_geometry, skybox_material);
        skybox_cube.position.set(0, 0, 0);
        this.add_to_scene(skybox_cube);
    };
}
