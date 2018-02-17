'use strict';

function CreatedWorldsManager() {
    this.__init__();
}

CreatedWorldsManager.prototype = {

    __init__: function() {
        this.created_worlds = [];
    },

    create_new_created_world: function() {
        // Create a new created world Entity.
        var created_world_entity = new Entity();
        created_world_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_CREATED_WORLD);

        this.entity.add_child(created_world_entity);

        var created_world = new CreatedWorld();
        MANAGER_WORLD.set_current_world(created_world);
    },

    load: function() {
        l('TODO : Load shared worlds!');
        // TODO : USE THIS POST!!!
        //this.post_get_shared_worlds = new PostHelper(POST_URL_GET_SHARED_WORLDS);

        this.entity = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_CREATED_WORLDS_MANAGER)[0];

        // Iterate through the children of this manager. They each are a created world.
        var created_worlds = this.entity.get_children();
        for (var c = 0; c < created_worlds.length; c++) {

            // There are no shared worlds for now so cant test yet.
            var created_world = created_worlds[c];

        }
    }

};