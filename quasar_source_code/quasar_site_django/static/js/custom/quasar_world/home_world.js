'use strict';

function HomeWorld() {
    this.__init__();
}

HomeWorld.prototype = {

    //
    entity_walls: null,

    //
    loaded_entities: null,

    __init__: function() {

        World.call(this, 'HomeWorld');

        this.loaded_entities = false;

        this.entity_walls = [];

        this.players = [];

        // Create a seperate class for this!

        /*   __   __        ___  __             ___            ___
            /__` /  ` |__| |__  |  \ |  | |    |__     \  / | |__  |  |    .
            .__/ \__, |  | |___ |__/ \__/ |___ |___     \/  | |___ |/\|    .*/
        /*
        var schedule_view_height = 1000;

        this.test_positions = [];
        this.schedule_floating_day_titles = [];

        var today = get_today_with_n_days_offset(0);

        for (var i = 0; i < 15; i++) {
            this.test_positions.push([cos((i / 15) * TWO_PIE), sin((i / 15) * TWO_PIE)]);

            var magnitude_value = 2500;

            var p = new THREE.Vector3(cos((i / 15) * TWO_PIE) * magnitude_value, schedule_view_height, sin((i / 15) * TWO_PIE) * magnitude_value);
            var p2 = new THREE.Vector3(cos((i / 15) * TWO_PIE) * magnitude_value, schedule_view_height - 200, sin((i / 15) * TWO_PIE) * magnitude_value);
            var p3 = new THREE.Vector3(cos((i / 15) * TWO_PIE) * magnitude_value, schedule_view_height - 400, sin((i / 15) * TWO_PIE) * magnitude_value);
            var look_at = new THREE.Vector3(0, schedule_view_height, 0);
            var look_at2 = new THREE.Vector3(0, schedule_view_height - 200, 0);
            var look_at3 = new THREE.Vector3(0, schedule_view_height - 400, 0);

            //this.make_entity_wall_public_button = new Floating2DText(this.width, 'Make Entity Wall Public', TYPE_BUTTON, this.scene);

            var color = null;

            switch(i-7) {
            case -7:
                color = COLOR_DAY_PAST_SEVEN;
                break;
            case -6:
                color = COLOR_DAY_PAST_SIX;
                break;
            case -5:
                color = COLOR_DAY_PAST_FIVE;
                break;
            case -4:
                color = COLOR_DAY_PAST_FOUR;
                break;
            case -3:
                color = COLOR_DAY_PAST_THREE;
                break;
            case -2:
                color = COLOR_DAY_PAST_TWO;
                break;
            case -1:
                color = COLOR_DAY_PAST_ONE;
                break;
            case 0:
                color = COLOR_DAY_PRESENT;
                break;
            case 1:
                color = COLOR_DAY_FUTURE_ONE;
                break;
            case 2:
                color = COLOR_DAY_FUTURE_TWO;
                break;
            case 3:
                color = COLOR_DAY_FUTURE_THREE;
                break;
            case 4:
                color = COLOR_DAY_FUTURE_FOUR;
                break;
            case 5:
                color = COLOR_DAY_FUTURE_FIVE;
                break;
            case 6:
                color = COLOR_DAY_FUTURE_SIX;
                break;
            case 7:
                color = COLOR_DAY_FUTURE_SEVEN;
                break;
            }

            var day_of_week_word = get_day_of_week_as_word(get_just_date_object_of_date_of_n_days_offset(i - 7));
            var full_date_of_day = get_today_with_n_days_offset(i - 7);

            if (get_day_of_week_as_word(today) === get_day_of_week_as_word(full_date_of_day)) {
                var floating_3d_subtitle_2 = new Floating3DText(schedule_view_height - 400, 'Today', TYPE_TITLE, this.scene, color);
                floating_3d_subtitle_2.update_position_and_look_at(p3, look_at3);
            }

            var floating_3d_text = new Floating3DText(schedule_view_height, day_of_week_word, TYPE_SUPER_TITLE, this.scene, color);
            floating_3d_text.update_position_and_look_at(p, look_at);

            var floating_3d_subtitle = new Floating3DText(schedule_view_height - 200, full_date_of_day, TYPE_TITLE, this.scene, color);
            floating_3d_subtitle.update_position_and_look_at(p2, look_at2);


            this.schedule_floating_day_titles.push(floating_3d_text);
        }
        */
    },

    control_key_down: null,

    //remove_entity: function()

    create_entity_wall_command_entered: function() {
        // The wall will be generated 100 units away from the player and looking at the player (while perpendicular to the y-axis).
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal = CURRENT_PLAYER.get_direction();
        var wall_normal = new THREE.Vector3(-player_normal.x, 0, -player_normal.z);
        var wall_position = new THREE.Vector3(player_position + player_normal.x * 100, player_position.y, player_position.z + player_normal.z * 100);
        var wall_width = 512;
        var wall_height = 512;
        var wall_normal_depth = 2;

        // Create the entity wall entity.
        var save_data = {};
        save_data[ENTITY_PROPERTY_POSITION] = '[' + wall_position.x + ',' + wall_position.y + ',' + wall_position.z + ']';
        save_data[ENTITY_PROPERTY_NORMAL] = '[' + wall_normal.x + ',' + wall_normal.y + ',' + wall_normal.z + ']';
        save_data[ENTITY_PROPERTY_WIDTH] = wall_width;
        save_data[ENTITY_PROPERTY_HEIGHT] = wall_height;
        save_data[ENTITY_PROPERTY_NORMAL_DEPTH] = wall_normal_depth;
        save_data[ENTITY_DEFAULT_PROPERTY_TYPE] = ENTITY_TYPE_WALL;
        var entity_wall_entity = new Entity(save_data);

        var entity_wall = new EntityWall(this, entity_wall_entity);
        this.entity_walls.push(entity_wall);
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event);
    },

    create_entity_wall: function(position, wall_text, entity) {
        // The wall will be generated 100 units away from the player and looking at the player (while perpendicular to the y-axis).
        var player_normal = CURRENT_PLAYER.get_direction();
        var wall_normal = new THREE.Vector3(-player_normal.x, 0, -player_normal.z);
        var entity_wall = new EntityWall(position, this, entity);
        entity_wall.update_title(wall_text);
        if (is_defined(entity)) {
            entity_wall.set_entity(entity);
            for (var ce = 0; ce < entity.children.length; ce++) {
                entity_wall.add_entity(entity.children[ce]);
            }
        }
        this.entity_walls.push(entity_wall);
    },

    load_entity_walls: function() {
        var wall_entities = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_WALL);
        for (var w = 0; w < wall_entities.length; w++) {

            // FOR_DEV_START
            if (!is_defined(wall_entities[w])) {
                GUI_PAUSED_MENU.add_server_message('Entity wall is not defined? Investigate.');
                l('There is non-defined entity wall being processed! Investigate!');
            }
            // FOR_DEV_END

            var position = wall_entities[w].get_value(ENTITY_PROPERTY_POSITION);

            position = position.replace('[', '').replace(']', '');
            position = position.split(',');

            // TODO : shouldn't this be parseFloat?
            var wall_position = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]));
            //var wall_look_at = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]))

            // FOR_DEV_START
            l('Creating entity wall at the position');
            l(wall_position);
            // FOR_DEV_END

            var title = wall_entities[w].get_value(ENTITY_PROPERTY_NAME);

            this.create_entity_wall(wall_position, title, wall_entities[w]);
        }
    },

    update: function() {
        // Get the task entities once all entities have been loaded.
        if (!this.loaded_entities) {
            if (!MANAGER_ENTITY.currently_loading()) {
                // Now create the entity walls from the entities.
                this.load_entity_walls();

                this.loaded_entities = true;
            }
        } else {
            // Update all the FloatingWalls.
            for (var i = 0; i < this.entity_walls.length; i++) {
                this.entity_walls[i].update();
            }
        }

        // World function.
        this.update_interactive_objects();
    },

    enter_world: function() {
        CURRENT_PLAYER.disengage();
        if (!GUI_PAUSED_MENU.currently_displayed) {
            CURRENT_PLAYER.enable_controls();
        }

        CURRENT_PLAYER.set_position(new THREE.Vector3(0, 100, 0));
    },

    exit_world: function() {
    }

};

