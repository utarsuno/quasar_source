'use strict';

function FloatingCursor(scene) {
    this.__init__(scene);
}

FloatingCursor.prototype = {

    __init__: function(scene) {

        // TODO : Optimize in the future.
        // Load all instances of the cursor needed.
        this.cursors = {};

        // The cursor texture will get set once loaded.
        this.plane_geometry = new THREE.PlaneGeometry(15, 1, 1);
        // TODO : Dispose of this original material later on.
        this.temp_material = new THREE.MeshBasicMaterial({color: 0xa6fff2, transparent: true, opacity: 0.5, side: THREE.DoubleSide});
        this.cursor_temp = new THREE.Mesh(this.plane_geometry, this.temp_material);

        this.previous_cursor = null;
        this.current_cursor = this.cursor_temp;

        this.object3D = new THREE.Object3D();
        this.object3D.add(this.cursor_temp);

        this.scene = scene;
        scene.add(this.object3D);
    },

    add_cursor_material: function(cursor_material, cursor_name) {
        var cursor_plane_geometry = new THREE.PlaneGeometry(15, 1, 1);
        var c = new THREE.Mesh(cursor_plane_geometry, cursor_material);
        //c.userData.name = cursor_name;
        c.visible = false;
        this.object3D.add(c);
        //this.scene.add(c);
        this.cursors[cursor_name] = c;
    },

    set_cursor: function(cursor_type) {
        if (this.cursors.hasOwnProperty(cursor_type)) {
            if (this.cursors[cursor_type] !== this.current_cursor) {
                this.previous_cursor = this.current_cursor;
                //this.previous_cursor.set_to_invisible();
                this.previous_cursor.visible = false;
                this.current_cursor = this.cursors[cursor_type];
                //this.current_cursor.set_to_visible();
                this.current_cursor.visible = true;
            }
        }
    },

    set_position: function(position) {
        var cursor_offset = 2;

        var player_position = CURRENT_PLAYER.get_position();
        var direction_vector_to_player = new THREE.Vector3(player_position.x - position.x, player_position.y - position.y, player_position.z - position.z);
        direction_vector_to_player.normalize();

        var offset_vector = new THREE.Vector3(direction_vector_to_player.x * cursor_offset, direction_vector_to_player.y * cursor_offset, direction_vector_to_player.z * cursor_offset);

        this.object3D.position.set(position.x + offset_vector.x, position.y + offset_vector.y, position.z + offset_vector.z);

        this.object3D.lookAt(player_position);
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

    this.provide_cursor_material = function(cursor_material, cursor_name) {
        this.floating_cursor.add_cursor_material(cursor_material, cursor_name);
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
        this.remove_from_scene(object_to_remove.object3D);
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

                if (this.currently_looked_at_object['type'] == TYPE_BUTTON) {
                    this.floating_cursor.set_cursor(CURSOR_TYPE_HAND);
                } else {
                    this.floating_cursor.set_cursor(CURSOR_TYPE_POINTER);
                }
            }
        }
    };

    this.update_interactive_objects = function() {
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
            this.set_cursor_position(final_point.point);
            // Regardless a match was found and only one intersection can occur so break.
            match_was_found = true;
            //break
        } else {
            // TODO : Eventually just make the cursor not visible.
            this.set_cursor_position(-5000, -5000, -5000);
        }

        // If no match was found but 'currently_looked_at_object' is not null then set it to null.
        if (!match_was_found && this.currently_looked_at_object !== null) {
            this.currently_looked_at_object.look_away();
            this.currently_looked_at_object = null;
        }
    };

    this.scale_command = function() {

        if (this.hasOwnProperty('entity_walls')) {
            var walls = this.entity_walls;
            for (var w = 0; w < walls.length; w++) {
                var intersection_point = walls[w].wall.get_player_look_at_intersection_point();
                l(intersection_point);
                if (intersection_point !== false) {

                    if (walls[w].wall.scalable) {
                        l('Scalable!');
                        l(walls[w].wall.scalable);
                    }

                    if (walls[w].wall.scalable) {
                        walls[w].wall.lock_on_scaling();
                        l(walls[w]);
                    }
                }
            }
        }
        //if (is_defined(this.currently_looked_at_object)) {
        //    l('TODO : THE SCALE COMMAND!!!');
        //}
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

    this.floating_cursor = new FloatingCursor(this.scene);

    // Add the skybox here as well.
    this.add_sky_box = function(skybox_material) {
        var skybox_geometry = new THREE.BoxGeometry(14000, 14000, 14000);
        var skybox_cube = new THREE.Mesh(skybox_geometry, skybox_material);
        skybox_cube.position.set(0, 0, 0);
        this.add_to_scene(skybox_cube);
    };
}
