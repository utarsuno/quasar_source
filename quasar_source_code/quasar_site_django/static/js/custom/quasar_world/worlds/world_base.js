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

    // TODO : Logically abstract the YouTube video creater!

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

        this.group.add(new Element( 'xBOqwRRj82A', 0, 0, 240, 0 ) );
        this.group.add(new Element( 'x4q86IjJFag', 240, 0, 0, Math.PI / 2 ) );
        this.group.add(new Element( 'JhngfOK_2-0', 0, 0, - 240, Math.PI ) );
        this.group.add(new Element( 'Grg3461lAPg', - 240, 0, 0, - Math.PI / 2 ) );

        this.css_scene.add(this.group);

        this.container.appendChild(MANAGER_RENDERER.css_renderer.domElement);
    };

    this.add_to_scene = function(object) {
        this.scene.add(object);
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

    this.look_away_from_currently_looked_at_object = function() {
        this.currently_looked_at_object.look_away();
        if (this.currently_looked_at_object.uses_cursor) {
            this.floating_cursor.detach();
        }
        this.currently_looked_at_object = null;
    };

    this._match_found = function(object_to_match) {
        for (var i = 0; i < this.interactive_objects.length; i++) {
            // OLD : this.interactive_objects[i].geometry.uuid === object_to_match.uuid
            if (this.interactive_objects[i].mesh.uuid === object_to_match.uuid) {
                return i;
            }
        }
        return -1;
    };

    this.update_interactive_objects = function() {
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
        if (event.keyCode === KEY_CODE_TAB) {
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
        if (event.keyCode === KEY_CODE_ENTER) {
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

    this.create_new_floating_picture = function(image_file) {
        var floating_picture = new FloatingPicture(image_file, this);
        this.root_attachables.push(floating_picture);
    };

    /*
                            MANAGER_WORLD.world_home.create_new_floating_picture(files[0]);
                        this.material = new THREE.MeshBasicMaterial({map : MANAGER_LOADING.get_texture(TEXTURE_GROUP_ICONS, this.text)});

     */

    /*

    this.cancel_picture_prompt = function(picture_prompt_wall) {
        picture_prompt_wall.fully_remove_self_and_all_sub_attachments();
    };

    this.create_picture = function(picture_prompt_wall, image_url_input) {
        var image_url = image_url_input.get_text();

        picture_prompt_wall.fully_remove_self_and_all_sub_attachments();

        // TODO : Create the picture wall!
        l('TODO : Create the picture wall!');

        MANAGER_LOADING.get_texture_dynamically(image_url, this._picture_ready_to_be_created.bind(this));
    };

    this._picture_ready_to_be_created = function(loaded_texture) {
        l('CREATE THE FOLLOWING TEXTURE : ');
        l(loaded_texture);
    };

    this.create_picture_prompt = function(position, normal) {
        var picture_prompt_wall = new FloatingWall(500, 100, position, normal, this, true);

        picture_prompt_wall.add_row_3D_text(false, -1, 'Create New Picture', TYPE_TITLE);

        picture_prompt_wall.add_row_2D_text([0, ONE_THIRD], 0, 'Image URL:', TYPE_CONSTANT);
        var image_url_input = picture_prompt_wall.add_row_2D_text([ONE_THIRD, 1], 0, '', TYPE_INPUT);

        var cancel_button = picture_prompt_wall.add_row_2D_text([0, HALF], 2, 'Cancel', TYPE_BUTTON);
        cancel_button.set_engage_function(this.cancel_picture_prompt.bind(this, picture_prompt_wall));
        cancel_button.set_default_color(COLOR_RED);
        cancel_button.set_color(COLOR_RED, true);

        var create_button = picture_prompt_wall.add_row_2D_text([HALF, 1], 2, 'Create', TYPE_BUTTON);
        create_button.set_engage_function(this.create_picture.bind(this, picture_prompt_wall, image_url_input));
        create_button.set_default_color(COLOR_GREEN);
        create_button.set_color(COLOR_GREEN, true);

        this.root_attachables.push(picture_prompt_wall);

        picture_prompt_wall.refresh_position_and_look_at();
    };

    */

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
