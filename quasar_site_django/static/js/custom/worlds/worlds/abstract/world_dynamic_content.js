'use strict';

function WorldDynamicContent() {

    this.floating_pictures = [];
    this.entity_walls      = [];

    this.dynamic_content_loaded = false;

    this.prepare_for_save = function() {
        // TODO : Eventually default should be false.
        var save_needed = true;

        // For dynamic worlds.
        if (this.hasOwnProperty('world_name_changed')) {
            if (this.world_name_changed) {
                this.entity.set_property(ENTITY_PROPERTY_NAME, this.world_name);
                save_needed = true;
            }
        }

        for (var r = 0; r < this.root_attachables.length; r++) {
            this.root_attachables[r].update_values_for_entity();
        }
    };

    this.load_dynamic_content = function() {
        // Load all entity walls.
        var entity_wall_entities = this.entity.get_children_of_type(ENTITY_TYPE_ENTITY_WALL);
        for (var ew = 0; ew < entity_wall_entities.length; ew++) {
            var entity_wall = new EntityWall(this, entity_wall_entities[ew]);
            this.entity_walls.push(entity_wall);
        }

        this.dynamic_content_loaded = true;

        // TODO : Load all floating pictures.
    };


    /*___      ___   ___
     |__  |\ |  |  |  |  \ /    |  |  /\  |    |
     |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
    this.create_new_entity_wall = function(this_context) {
        var entity_wall = new EntityWall(this_context);
        this_context.entity_walls.push(entity_wall);
    };

}


