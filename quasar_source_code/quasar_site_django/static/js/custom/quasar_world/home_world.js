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

        l('LOADED THE FOLLOWING DATA:');
        l(wall_entities);
        return;

        var number_of_wall_entities = wall_entities.length;
        for (var w = 0; w < number_of_wall_entities; w++) {

            if (!is_defined(wall_entities[w])) {
                GUI_PAUSED_MENU.add_server_message('Entity wall is not defined? Investigate.');
                l('There is non-defined entity wall being processed! Investigate!');
            }

            //var information = JSON.parse(wall_entities[w]['ENTITY_PROPERTY_INFORMATION'])

            var position = wall_entities[w].get_value('ENTITY_PROPERTY_POSITION');

            position = position.replace('[', '').replace(']', '');
            position = position.split(',');

            // TODO : shouldn't this be parseFloat?
            var wall_position = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]));
            //var wall_look_at = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]))

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

