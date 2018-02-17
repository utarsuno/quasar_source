'use strict';

function Entity(properties) {
    this.__init__(properties);
}

Entity.prototype = {

    // Default properties.
    ep_relative_id: null,
    ep_child_ids  : null,
    ep_parent_ids : null,
    ep_parents    : null,
    ep_children   : null,
    ep_type       : null,

    // State booleans.
    needs_to_be_saved : null,

    __init__: function(properties) {

        if (!is_defined(properties)) {
            properties = {};
        }

        var value = null;
        // Handling the default property of relative ID.
        if (properties.hasOwnProperty(ENTITY_DEFAULT_PROPERTY_RELATIVE_ID)) {
            // If the property is a string convert it to an integer.
            value = properties[ENTITY_DEFAULT_PROPERTY_RELATIVE_ID];
            if (is_string(value)) {
                this.ep_relative_id = parseInt(value);
            } else {
                this.ep_relative_id = value;
            }
            // Raise an exception if there is already an entity with that relative id.
            if (is_defined(MANAGER_ENTITY.get_entity_by_id(this.ep_relative_id))) {
                raise_exception_with_full_logging('Can\'t add/create entity with duplicate ID of ' + this.ep_relative_id + '!');
            }
        } else {
            this.ep_relative_id = MANAGER_ENTITY.get_new_entity_id();
        }

        // Handling the default property of child IDs.
        if (properties.hasOwnProperty(ENTITY_DEFAULT_PROPERTY_CHILD_IDS)) {
            // Make sure that any strings get converted into a list of integers.
            value = properties[ENTITY_DEFAULT_PROPERTY_CHILD_IDS];
            if (is_string(value)) {
                this.ep_child_ids = eval(value);
            } else {
                this.ep_child_ids = value;
            }
        } else {
            this.ep_child_ids = [];
        }

        // Handling the default property of parent IDs.
        if (properties.hasOwnProperty(ENTITY_DEFAULT_PROPERTY_PARENT_IDS)) {
            // Make sure that any strings get converted into a list of integers.
            value = properties[ENTITY_DEFAULT_PROPERTY_PARENT_IDS];
            if (is_string(value)) {
                this.ep_parent_ids = eval(value);
            } else {
                this.ep_parent_ids = value;
            }
        } else {
            this.ep_parent_ids = [];
        }

        // Handling the default property of (entity) type.
        if (properties.hasOwnProperty(ENTITY_DEFAULT_PROPERTY_TYPE)) {
            this.ep_type = properties[ENTITY_DEFAULT_PROPERTY_TYPE];
        } else {
            this.ep_type = ENTITY_TYPE_BASE;
        }

        // Handling all other properties that begin with the token 'ep_'.
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key !== ENTITY_DEFAULT_PROPERTY_RELATIVE_ID && key !== ENTITY_DEFAULT_PROPERTY_CHILD_IDS && key !== ENTITY_DEFAULT_PROPERTY_PARENT_IDS && ENTITY_DEFAULT_PROPERTY_TYPE) {
                    if (key.startsWith(ENTITY_PROPERTY_START_TOKEN)) {
                        this.set_property(key, properties[key]);
                    }
                }
            }
        }

        // JavaScript Entity object specific fields. (These do not get saved, only used for client side logic).
        this.parents  = [];
        this.children = [];

        // Anytime an entity is created make sure to double check that the ENTITY_MANAGER object has a reference to it.
        MANAGER_ENTITY.add_entity_if_not_already_added(this);
    },

    delete_property: function(property_name) {
        if (this.hasOwnProperty(property_name)) {
            delete this[property_name];
            this.needs_to_be_saved = true;
        }
    },

    set_property: function(property_name, property_value) {
        var property_was_set = false;
        if (this.hasOwnProperty(property_name)) {
            if (this[property_name] !== property_value) {
                this[property_name] = property_value;
                property_was_set = true;
            }
        } else {
            this[property_name] = property_value;
            property_was_set = true;
        }
        if (property_was_set) {
            this.needs_to_be_saved = true;
        }
    },

    update_values: function(new_keys_and_values) {
        var update_occurred = false;
        for (var key in new_keys_and_values) {
            if (new_keys_and_values.hasOwnProperty(key)) {
                if (new_keys_and_values[key] !== this[key]) {
                    this[key] = new_keys_and_values[key];
                    update_occurred = true;
                }
            }
        }
        if (update_occurred) {
            this.needs_to_be_saved = true;
        }
    },

    has_property: function(property_name) {
        return this.hasOwnProperty(property_name);
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    is_owned_by_user: function() {
        return this.get_value(ENTITY_PROPERTY_OWNER) === ENTITY_OWNER.get_username();
    },

    get_all_non_default_editable_fields: function() {
        var all_editable_fields = [];
        var all_keys = Object.keys(this);
        for (var f = 0; f < all_keys.length; f++) {
            if (all_keys[f].startsWith(ENTITY_PROPERTY_START_TOKEN)) {
                var field_name = all_keys[f];
                if (field_name !== 'ep_child_ids' && field_name !== 'ep_parent_ids' && field_name !== 'ep_relative_id' && field_name !== 'ep_parents' && field_name !== 'ep_children' && field_name !== ENTITY_DEFAULT_PROPERTY_TYPE && field_name !== ENTITY_PROPERTY_NAME && field_name !== ENTITY_PROPERTY_GROUP_NAME) {
                    all_editable_fields.push([field_name, this[field_name]]);
                }
            }
        }
        return all_editable_fields;
    },

    get_all_editable_fields: function() {
        var all_editable_fields = [];
        var all_keys = Object.keys(this);
        for (var f = 0; f < all_keys.length; f++) {
            if (all_keys[f].startsWith(ENTITY_PROPERTY_START_TOKEN)) {
                var field_name = all_keys[f];
                if (field_name !== 'ep_child_ids' && field_name !== 'ep_parent_ids' && field_name !== 'ep_relative_id' && field_name !== 'ep_parents' && field_name !== 'ep_children') {
                    all_editable_fields.push([field_name, this[field_name]]);
                }
            }
        }
        return all_editable_fields;
    },

    get_relative_id: function() {
        return this[ENTITY_DEFAULT_PROPERTY_RELATIVE_ID];
    },

    get_type: function() {
        return this[ENTITY_DEFAULT_PROPERTY_TYPE];
    },

    get_value: function(property_name) {
        if (this.hasOwnProperty(property_name)) {
            return this[property_name];
        }
        return null;
    },

    get_name: function() {
        return this.name;
    },

    get_all_non_default_properties: function() {
        var properties = {};
        var all_keys = Object.keys(this);
        for (var i = 0; i < all_keys.length; i++) {
            if (all_keys[i].startsWith(ENTITY_PROPERTY_START_TOKEN)) {
                properties[all_keys[i]] = this.get_value(all_keys[i]);
            }
        }
        return properties;
    },

    get_all_properties: function() {
        var properties = this.get_all_non_default_properties();
        // Make sure to also add the default properties.
        properties[ENTITY_DEFAULT_PROPERTY_TYPE] = this.get_type();
        properties[ENTITY_DEFAULT_PROPERTY_CHILD_IDS] = this.get_child_ids();
        properties[ENTITY_DEFAULT_PROPERTY_PARENT_IDS] = this.get_parent_ids();
        properties[ENTITY_DEFAULT_PROPERTY_RELATIVE_ID] = this.get_relative_id();
        return properties;
    },

    /* __               __       /     __        __   ___      ___           ___      ___   ___    ___  __
      /  ` |__| | |    |  \     /     |__)  /\  |__) |__  |\ |  |     __    |__  |\ |  |  |  |  | |__  /__`
      \__, |  | | |___ |__/    /      |    /~~\ |  \ |___ | \|  |           |___ | \|  |  |  |  | |___ .__/ */
    get_parent: function() {
        return this.parents[0];
    },

    get_child: function() {
        return this.children[0];
    },

    get_parents: function() {
        return this.parents;
    },

    get_children: function() {
        return this.children;
    },

    get_child_ids: function() {
        return this[ENTITY_DEFAULT_PROPERTY_CHILD_IDS];
    },

    get_parent_ids: function() {
        return this[ENTITY_DEFAULT_PROPERTY_PARENT_IDS];
    },

    number_of_parents: function() {
        return this.parents.length;
    },

    number_of_children: function() {
        return this.children.length;
    },

    add_child: function(child_entity) {
        if (!is_defined(child_entity)) {
            var error_message = 'Error can\'t add a not defined object as a child entity!';
            // FOR_DEV_START
            l(error_message);
            // FOR_DEV_END
            GUI_TYPING_INTERFACE.add_server_message(error_message);
            raise_exception(error_message);
        }

        var action_occurred = false;
        // First make sure this entity hasn't already been marked the provided entity as a child.
        if (this.children.indexOf(child_entity) === NOT_FOUND) {
            this.children.push(child_entity);
            action_occurred = true;
        }
        // Same as above (but cover both id list and object list).
        var child_entity_id = child_entity.get_relative_id();
        if (this.get_child_ids().indexOf(child_entity_id) === NOT_FOUND) {
            this[ENTITY_DEFAULT_PROPERTY_CHILD_IDS].push(child_entity_id);
            action_occurred = true;
        }
        if (action_occurred) {
            this.needs_to_be_saved = true;
            // Since the child reference was added also do a redundant check to make sure that the child has this entity marked as a parent entity.
            child_entity.add_parent(this);
        }
    },

    remove_child: function(child_entity) {
        if (!is_defined(child_entity)) {
            var error_message = 'Error can\'t remove a not defined object as a child entity!';
            // FOR_DEV_START
            l(error_message);
            // FOR_DEV_END
            GUI_TYPING_INTERFACE.add_server_message(error_message);
            raise_exception(error_message);
        }

        var index_of_child_id = this.get_child_ids().indexOf(child_entity.get_relative_id());
        var index_of_child_object = this.children.indexOf(child_entity);
        var action_occurred = false;
        // Check if this entity actually contains the child entity.
        if (index_of_child_id !== NOT_FOUND) {
            this[ENTITY_DEFAULT_PROPERTY_CHILD_IDS].splice(index_of_child_id, 1);
            action_occurred = true;
        }
        // Same as above (but cover both id list and object list).
        if (index_of_child_object !== NOT_FOUND) {
            this.children.splice(index_of_child_object, 1);
            action_occurred = true;
        }
        if (action_occurred) {
            this.needs_to_be_saved = true;
            // Since the child reference was removed also do a redundant check to make sure that the child has the parent reference to this entity, removed.
            child_entity.remove_parent(this);
        }
    },

    add_parent: function(parent_entity) {
        if (!is_defined(parent_entity)) {
            var error_message = 'Error can\'t add a not defined object as a parent entity!';
            // FOR_DEV_START
            l(error_message);
            // FOR_DEV_END
            GUI_TYPING_INTERFACE.add_server_message(error_message);
            raise_exception(error_message);
        }

        var action_occurred = false;
        // First make sure this entity hasn't already marked the provided entity as a parent.
        if (this.parents.indexOf(parent_entity) === NOT_FOUND) {
            this.parents.push(parent_entity);
            action_occurred = true;
        }
        // Same as above (but cover both id list and object list).
        var parent_entity_id = parent_entity.get_relative_id();
        if (this.get_parent_ids().indexOf(parent_entity_id) === NOT_FOUND) {
            this[ENTITY_DEFAULT_PROPERTY_PARENT_IDS].push(parent_entity_id);
            action_occurred = true;
        }
        if (action_occurred) {
            this.needs_to_be_saved = true;
            // Since the parent reference was added also do a redundant check to make sure that the parent has this entity marked as a child entity.
            parent_entity.add_child(this);
        }
    },

    remove_parent: function(parent_entity) {
        if (!is_defined(parent_entity)) {
            var error_message = 'Error can\'t remove a not defined object as a parent entity!';
            // FOR_DEV_START
            l(error_message);
            // FOR_DEV_END
            GUI_TYPING_INTERFACE.add_server_message(error_message);
            raise_exception(error_message);
        }

        var action_occurred = false;
        var index_of_parent_id = this.get_parent_ids().indexOf(parent_entity.get_relative_id());
        var index_of_parent_object = this.parents.indexOf(parent_entity);
        // Check if this entity actually contains the parent entity.
        if (index_of_parent_id !== NOT_FOUND) {
            this[ENTITY_DEFAULT_PROPERTY_PARENT_IDS].splice(index_of_parent_id, 1);
            action_occurred = true;
        }
        // Same as above (but cover both id list and object list).
        if (index_of_parent_object !== NOT_FOUND) {
            this.parents.splice(index_of_parent_object, 1);
            action_occurred = true;
        }
        if (action_occurred) {
            this.needs_to_be_saved = true;
            // Since the parent reference was removed also do a redundant check to make sure that the parent has the child reference to this entity, removed.
            parent_entity.remove_child(this);
        }
    }
};
