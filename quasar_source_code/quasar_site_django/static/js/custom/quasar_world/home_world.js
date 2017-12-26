'use strict';

function HomeWorld() {
    this.__init__();
}

const MONTH_VIEW_RADIUS = 3000;

HomeWorld.prototype = {

    entity_walls: null,
    loaded_entities: null,

    __init__: function() {
        World.call(this, 'HomeWorld');

        this.loaded_entities = false;
        this.entity_walls = [];

        this.schedule_loaded = false;
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event);
    },

    prepare_for_save: function() {
        for (var i = 0; i < this.entity_walls.length; i++) {
            this.entity_walls[i].prepare_for_save();
        }
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

            //var save_data = wall_entities[w].get_all_properties();

            // Get the matching entity from the Entity Manager.

            //l(save_data);
            //var entity_wall_entity = new Entity(save_data);

            // TODO : Optimize later.
            //MANAGER_ENTITY.link_entities();

            //var entity_wall = new EntityWall(this, entity_wall_entity);
            this.entity_walls.push(new EntityWall(this, wall_entities[w]));
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

            // TODO : Fix this system so only one floating wall at a time gets grabbed.

            // Update all the FloatingWalls.
            for (var i = 0; i < this.entity_walls.length; i++) {
                this.entity_walls[i].update();
            }

            // Now that all the entity walls have been updated check for the closest intersection point if any.
            for (i = 0; i < this.entity_walls.length; i++) {
                // TODO : This!!
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
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);

        if (!this.schedule_loaded) {
            this.load_schedule();
        }
    },

    exit_world: function() {
    },

    create_entity_wall_command_entered: function() {
        // The wall will be generated 100 units away from the player and looking at the player (while perpendicular to the y-axis).
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal = CURRENT_PLAYER.get_direction();
        var wall_normal = new THREE.Vector3(-player_normal.x, 0, -player_normal.z);
        var wall_position = new THREE.Vector3(player_position.x + player_normal.x * 100, player_position.y, player_position.z + player_normal.z * 100);
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
        save_data[ENTITY_PROPERTY_NAME] = 'generic entity group';
        save_data[ENTITY_DEFAULT_PROPERTY_TYPE] = ENTITY_TYPE_WALL;
        var entity_wall_entity = new Entity(save_data);

        var entity_wall = new EntityWall(this, entity_wall_entity);
        this.entity_walls.push(entity_wall);
    },

    /*__   __        ___  __             ___            ___
     /__` /  ` |__| |__  |  \ |  | |    |__     \  / | |__  |  |
     .__/ \__, |  | |___ |__/ \__/ |___ |___     \/  | |___ |/\| */

    create_month_day_wall: function(day, index, total_number_of_days, color, present) {
        var w = 500;
        var h = 1000;

        var percentage = index / total_number_of_days;
        var x_position = cos(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;
        var z_position = sin(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;

        var p = new THREE.Vector3(x_position, 1000, z_position);
        var n = new THREE.Vector3(-x_position, 0, -z_position);

        var month_day_wall = new FloatingWall(w, h, p, n, this, false);

        month_day_wall.add_3D_title(day.get_day_number_as_string(), TYPE_SUPER_TITLE, color);

        if (present) {
            month_day_wall.add_3D_title_above('Today', TYPE_SUPER_TITLE, color);
        }

        return month_day_wall;
    },

    load_schedule: function() {
        // The 360 schedule view.
        this.month_day_walls = [];
        this.month_days = new MyDates(THIS_MONTH);

        var dates_in_past = this.month_days.get_dates_in_past();
        var dates_in_present = this.month_days.get_dates_in_present();
        var dates_in_future = this.month_days.get_dates_in_future();

        var dates_in_past_colors = get_color_range_list(COLOR_SCHEDULE_PAST, COLOR_SCHEDULE_PRESENT, dates_in_past.length + 1);
        var dates_in_future_colors = get_color_range_list(COLOR_SCHEDULE_PRESENT, COLOR_SCHEDULE_FUTURE, dates_in_past.length + 1);

        var day_index = 0;
        var d;
        for (d = 0; d < dates_in_past.length; d++) {
            this.month_day_walls.push(this.create_month_day_wall(dates_in_past[d], day_index, this.month_days.dates.length, dates_in_past_colors[d], false));
            day_index += 1;
        }
        this.month_day_walls.push(this.create_month_day_wall(dates_in_present[0], day_index, this.month_days.dates.length, COLOR_SCHEDULE_PRESENT, true));
        day_index += 1;
        for (d = 0; d < dates_in_future.length; d++) {
            this.month_day_walls.push(this.create_month_day_wall(dates_in_future[d], day_index, this.month_days.dates.length, dates_in_future_colors[d + 1], false));
            day_index += 1;
        }
    }
};

