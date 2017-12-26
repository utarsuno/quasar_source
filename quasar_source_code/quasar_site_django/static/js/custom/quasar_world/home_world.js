'use strict';

function HomeWorld() {
    this.__init__();
}

const MONTH_VIEW_RADIUS = 3000;

HomeWorld.prototype = {

    //
    entity_walls: null,

    //
    loaded_entities: null,

    create_month_day_wall: function(day, index, total_number_of_days, color) {
        var w = 500;
        var h = 1000;

        var percentage = index / total_number_of_days;
        var x_position = cos(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;
        var z_position = sin(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;

        var p = new THREE.Vector3(x_position, 1000, z_position);
        var n = new THREE.Vector3(-x_position, 0, -z_position);

        var month_day_wall = new FloatingWall(w, h, p, n, this, false);

        l('Created ' + day.to_string_without_year());

        month_day_wall.add_3D_title(day.to_string_without_year(), color);

        return month_day_wall;
    },

    __init__: function() {
        World.call(this, 'HomeWorld');

        this.loaded_entities = false;

        this.entity_walls = [];

        // TODO : What is this for?
        this.players = [];

        // The 360 schedule view.
        this.month_day_walls = [];
        this.month_days = new MyDates(THIS_MONTH);
        this.month_day_colors = get_color_range_list(COLOR_SCHEDULE_START, COLOR_SCHEDULE_END, this.month_days.dates.length);

        for (var md = 0; md < this.month_days.dates.length; md++) {
            this.month_day_walls.push(this.create_month_day_wall(this.month_days.dates[md], md, this.month_days.dates.length, this.month_day_colors[md]));
        }
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
    },

    exit_world: function() {
    }

};

