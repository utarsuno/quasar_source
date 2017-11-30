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



        /*   __   __        ___  __             ___            ___
            /__` /  ` |__| |__  |  \ |  | |    |__     \  / | |__  |  |    .
            .__/ \__, |  | |___ |__/ \__/ |___ |___     \/  | |___ |/\|    .*/

        var schedule_view_height = 1000;

        this.test_positions = [];
        this.schedule_floating_day_titles = [];
        for (var i = 0; i < 15; i++) {
            this.test_positions.push([cos((i / 15) * PIE), sin((i / 15) * PIE)]);

            var magnitude_value = 1500;

            var p = new THREE.Vector3(cos((i / 15) * PIE) * magnitude_value, schedule_view_height, sin((i / 15) * PIE) * magnitude_value);
            var p2 = new THREE.Vector3(cos((i / 15) * PIE) * magnitude_value, schedule_view_height - 200, sin((i / 15) * PIE) * magnitude_value);
            var look_at = new THREE.Vector3(0, schedule_view_height, 0);
            var look_at2 = new THREE.Vector3(0, schedule_view_height - 200, 0);

            //this.make_entity_wall_public_button = new Floating2DText(this.width, 'Make Entity Wall Public', TYPE_BUTTON, this.scene);

            var day_of_week_work = get_day_of_week_as_word(get_just_date_object_of_date_of_n_days_offset(i - 8));
            var full_date_of_day = get_today_with_n_days_offset(i - 8);

            var floating_3d_text = new Floating3DText(schedule_view_height, day_of_week_work, TYPE_TITLE, this.scene);
            floating_3d_text.update_position_and_look_at(p, look_at);

            var floating_3d_subtitle = new Floating3DText(schedule_view_height - 200, full_date_of_day, TYPE_TITLE, this.scene);
            floating_3d_text.update_position_and_look_at(p2, look_at2);


            this.schedule_floating_day_titles.push(floating_3d_text);
        }


    },

    control_key_down: null,

    //remove_entity: function()

    create_entity_wall_command_entered: function() {
        this.create_entity_wall(CURRENT_PLAYER.get_position(), 'Default');
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event);
    },

    create_entity_wall: function(position, wall_text, entity) {
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
            var wall_position = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]) - 512, parseInt(position[2]));
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

