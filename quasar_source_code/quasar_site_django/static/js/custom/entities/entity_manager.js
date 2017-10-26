'use strict'


EntityManager.prototype = {

    entities        : null,
    entities_loaded : null,

    // POST calls.
    post_delete_entity: null,

    __init__: function() {
        this.entities = []
        this.entities_loaded = false

        this.post_delete_entity = new PostHelper('/delete_entity')
    },

    add_entity_if_not_already_added: function(entity) {
        if (this.entities.indexOf(entity) === NOT_FOUND) {
            this.entities.push(entity)
        }
    },

    loaded: function() {
        return this.entities_loaded
    },

    entity_deleted_response: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            console.log('Entity deleted!')
        } else {
            console.log('Entity did not get deleted : ' + data)
        }
    },

    delete_entity: function(entity) {

        var entity_to_delete = null
        var index_to_splice = null

        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_value(ENTITY_PROPERTY_ID) === entity.get_value(ENTITY_PROPERTY_ID)) {
                entity_to_delete = this.entities[i]
                index_to_splice = i
            }
        }

        if (entity_to_delete !== null) {
            this.post_delete_entity.perform_post({
                'username': WORLD_MANAGER.player.get_username(),
                'password': WORLD_MANAGER.player.get_password(),
                'ENTITY_PROPERTY_ID': entity_to_delete.get_value(ENTITY_PROPERTY_ID)
            }, this.entity_deleted_response.bind(this))
        }

        if (index_to_splice !== null) {
            this.entities.splice(index_to_splice, 1)
        }
    },

    add_entity: function(entity) {
        //this.entities.push(entity)
        this.add_entity_if_not_already_added(entity)
    },

    add_new_entity: function(entity_name, entity_data) {
        var new_entity = new Entity(entity_name, entity_data)
        this.add_entity_if_not_already_added(new_entity)
        //this.entities.push(new_entity)
        return new_entity
    },

    load_entity_from_data: function(entity_data) {

    },

    get_new_entity_id: function() {
        var max_id = -1
        for (var i = 0; i < this.entities.length; i++) {
            var entity_id = parseInt(this.entities[i].get_value(ENTITY_PROPERTY_ID))
            if (entity_id > max_id) {
                max_id = entity_id
            }
        }
        return max_id + 1
    },

    link_entities: function() {
        for (var e = 0; e < this.entities.length; e++) {

            console.log('Currently looking at entity :')
            console.log(this.entities[e])

            var children_list = this.entities[e].get_value(ENTITY_PROPERTY_CHILDREN)
            var parent_list   = this.entities[e].get_value(ENTITY_PROPERTY_PARENTS)

            console.log('Children list is :')
            console.log(children_list)

            console.log('Parent list is :')
            console.log(parent_list)

            for (var c = 0; c < children_list.length; c++) {

                var entity_to_add = this.get_entity_by_id(children_list[c])

                if (entity_to_add !== null || entity_to_add !== undefined) {
                    this.entities[e].add_child(entity_to_add)
                } else {
                    console.log('THERE WAS AN ERROR YOU NEED TO FIX.')
                    //this.entities[e].add_child(this.get_entity_by_id(children_list[c]))
                }

                this.entities[e].add_child(this.get_entity_by_id(children_list[c]))
            }
            for (var p = 0; p < parent_list.length; p++) {
                this.entities[e].add_parent(this.get_entity_by_id(parent_list[p]))
            }
        }
        this.entities_loaded = true
    },

    get_all_entities: function() {
        return this.entities
    },

    get_entity_by_id: function(entity_id) {
        //console.log('Trying to get entity by id match : Looking for ' + entity_id)

        var match_found_ONLY_FOR_DEBUGGING = false
        for (var i = 0; i < this.entities.length; i++) {
            //console.log(this.entities[i].get_value(ENTITY_PROPERTY_ID))
            //console.log(entity_id)

            if (this.entities[i].get_value(ENTITY_PROPERTY_ID) === entity_id) {
                console.log('MATCH FOUND FOR :')
                console.log(entity_id)
                match_found_ONLY_FOR_DEBUGGING = true
                return this.entities[i]
            }
        }
        if (!match_found_ONLY_FOR_DEBUGGING) {
            console.log('MATCH NOT FOUND FOR :')
            console.log(entity_id)
        }
    },

    get_all_entities_of_type: function(entity_type) {
        var type_entities = []
        var number_of_entities = this.entities.length
        for (var i = 0; i < number_of_entities; i++) {
            if (this.entities[i].get_value(ENTITY_PROPERTY_TYPE) === entity_type) {
                type_entities.push(this.entities[i])
            }
        }
        return type_entities
    },

    is_property_user_modifiable: function(property) {
        console.log('is_property_user_modifiable ')
        console.log(property)
        switch(property) {
        case ENTITY_PROPERTY_ID:
        case ENTITY_PROPERTY_PARENTS:
        case ENTITY_PROPERTY_CHILDREN:
            return false
        default:
            return true
        }
    }
}