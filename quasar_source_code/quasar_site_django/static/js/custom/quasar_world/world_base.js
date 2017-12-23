'use strict';

function FloatingCursor(world) {
    this.__init__(world);
}

FloatingCursor.prototype = {

    __init__: function(world) {

        // TODO : Optimize in the future.
        // Load all instances of the cursor needed.
        this.cursors = {};

        // The cursor texture will get set once loaded.
        this.width = 7;
        this.height = 10;
        this.plane_geometry = new THREE.PlaneGeometry(7, 10, 1);
        // TODO : Dispose of this original material later on.
        this.temp_material = new THREE.MeshBasicMaterial({color: 0xa6fff2, transparent: true, opacity: 0.95, side: THREE.DoubleSide});
        this.cursor_temp = new THREE.Mesh(this.plane_geometry, this.temp_material);

        this.previous_cursor = null;
        this.current_cursor = this.cursor_temp;

        this.object3D = new THREE.Object3D();
        this.object3D.add(this.cursor_temp);

        this.world = world;
        this.scene = this.world.scene;
        this.scene.add(this.object3D);

        this.cursor_needed_from_interactive_objects = false;
        this.cursor_needed_from_floating_walls = false;
        this.current_normal = null;
        this.engaged = false;
    },

    add_cursor_material: function(cursor_material, texture_name) {
        var cursor_name = '';

        if (texture_name.includes(CURSOR_TYPE_HORIZONTAL)) {
            cursor_name = CURSOR_TYPE_HORIZONTAL;
        } else if (texture_name.includes(CURSOR_TYPE_VERTICAL)) {
            cursor_name = CURSOR_TYPE_VERTICAL;
        } else if (texture_name.includes(CURSOR_TYPE_HAND)) {
            cursor_name = CURSOR_TYPE_HAND;
        } else if (texture_name.includes(CURSOR_TYPE_POINTER)) {
            cursor_name = CURSOR_TYPE_POINTER;
        } else if (texture_name.includes(CURSOR_TYPE_LARGER)) {
            cursor_name = CURSOR_TYPE_LARGER;
        } else if (texture_name.includes(CURSOR_TYPE_MOUSE)) {
            cursor_name = CURSOR_TYPE_MOUSE;
        }

        var cursor_plane_geometry = new THREE.PlaneGeometry(7, 10, 1);
        var c = new THREE.Mesh(cursor_plane_geometry, cursor_material);
        c.userData.name = cursor_name;
        c.visible = false;
        this.object3D.add(c);
        //this.scene.add(c);
        this.cursors[cursor_name] = c;
    },

    is_currently_visible: function() {
        return this.current_cursor.visible;
    },

    set_data: function(data) {
        this.set_cursor(data[1]);
        this.set_position(data[0]);
        this.current_floating_wall = data[2];
        this.cursor_needed_from_floating_walls = true;
    },

    update: function() {
        if (this.cursor_needed_from_floating_walls || this.cursor_needed_from_interactive_objects) {
            this.current_cursor.visible = true;
            this.cursor_needed_from_floating_walls = false;
            this.cursor_needed_from_interactive_objects = false;
        } else {
            if (!this.engaged) {
                this.current_cursor.visible = false;
            }
        }
    },

    set_cursor: function(cursor_type) {
        if (this.cursors.hasOwnProperty(cursor_type)) {
            if (this.cursors[cursor_type] !== this.current_cursor) {
                this.previous_cursor = this.current_cursor;
                this.previous_cursor.visible = false;
                this.current_cursor = this.cursors[cursor_type];
            }
        }
    },

    get_position: function() {
        return this.object3D.position;
    },

    set_position: function(position) {
        var cursor_offset = 2;

        var normal;
        if (is_defined(this.world.currently_looked_at_object)) {
            normal = this.world.currently_looked_at_object.normal;
        } else {
            normal = this.current_normal;
        }

        // TODO : determine if there needs to be a horizontal shift as well.

        // TODO : The cursor position needs to be fixed (x-y offset)
        var cursor_look_at = new THREE.Vector3(position.x + normal.x * 4, position.y - this.height, position.z + normal.z * 4);
        this.object3D.position.set(position.x + normal.x * cursor_offset, position.y - this.height, position.z + normal.z * cursor_offset);
        this.object3D.lookAt(cursor_look_at);
    }
};

function World(planet_name) {

    this.planet_position            = null;
    this.planet_name                = planet_name;

    this.currently_looked_at_object = null;
    this.raycaster                  = null;
    this.current_world              = false;
    this.scene                      = new THREE.Scene();

    this.default_tab_target         = null;
    this.interactive_objects        = [];

    // Player menu.
    // TODO : The player menu needs heavy re-factorizations.
    this.player_menu = new FloatingWall(100, 50, new THREE.Vector3(-5000, -5000, -5000), new THREE.Vector3(0, 0, 0), this, false);
    this.player_menu.add_floating_2d_text(0, 1, 'Create Entity Wall', TYPE_BUTTON, 0);
    this.player_menu.add_floating_2d_text(0, 1, 'Create Image', TYPE_BUTTON, 1);
    this.player_menu.add_floating_2d_text(0, 1, 'Save', TYPE_BUTTON, 2);
    this.player_menu.set_to_invisible();

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

    this.parse_mouse_drag = function() {
        if (this.floating_cursor.engaged) {
            if (this.floating_cursor.current_cursor.userData.name !== CURSOR_TYPE_MOUSE) {
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

    this.update_interactive_objects = function() {
        // TODO : Eventually optimize this function.

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

                    if (this.interactive_objects[m].mesh.hasOwnProperty('wireframe')) {
                        if (this.interactive_objects[m].wireframe.uuid === closest_object.uuid) {
                            has_match = true;
                        }
                    }

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

        // If no match was found but 'currently_looked_at_object' is not null then set it to null.
        if (!match_was_found && this.currently_looked_at_object !== null) {
            this.currently_looked_at_object.look_away();
            this.currently_looked_at_object = null;
        }
    };

    this.tab_to_next_interactive_object = function() {
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
        }
    };

    this.single_middle_click = function() {

    };

    this.single_right_click = function() {
        if (this.currently_looked_at_object !== null) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage();
                CURRENT_PLAYER.enable_controls();
            }
        }
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
                    this.currently_looked_at_object.engage();
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
