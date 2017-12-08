'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    delete_entity_wall_button_pressed: function() {
        this.wall_are_you_sure.show();
    },

    create_new_entity: function() {
        l('TODO: !!! Create this new entity');
        l(this.create_entity_dictionary);

        this.create_entity_wall.hide();
    },

    create_entity_button_pressed: function() {
        this.entity_type_selector_wall.show();
    },

    add_new_attribute_pressed: function() {
        this.wall_select_attribute.show();
    },

    attribute_selected: function(attribute) {
        this.wall_select_attribute.hide();

        // TODO : Make sure to only list attributes that are not already added.

        this._add_label_and_input_for_create_entity_wall(attribute);
    },

    _add_label_and_input_for_create_entity_wall: function(label) {
        this.create_entity_wall.add_floating_2d_text(0, 1 / 3, label, TYPE_CONSTANT_TEXT, this.current_create_entity_wall_row_index);
        // TODO : Make the first click clear the value here text.
        this.create_entity_dictionary[label] = this.create_entity_wall.add_floating_2d_text(1 / 3, 1, 'value here', TYPE_INPUT_REGULAR, this.current_create_entity_wall_row_index);
        this.current_create_entity_wall_row_index += 1;
    },

    entity_type_selected: function(selected_type) {
        this.entity_type_selector_wall.hide();

        this.create_entity_wall.clear_floating_2d_texts();

        this.create_entity_wall.add_floating_2d_text(.05, .95, 'Create New ' + selected_type, TYPE_TITLE, 0);

        // Select new attribute.
        this.current_add_new_attribute_button = this.create_entity_wall.add_floating_2d_text(.05, .95, 'add new attribute', TYPE_BUTTON, 3);
        if (!is_defined(this.wall_select_attribute)) {
            this.init_select_new_attribute_wall();
        } else {
            this.wall_select_attribute.pfw_button = this.current_add_new_attribute_button;
        }
        this.current_add_new_attribute_button.set_engage_function(this.add_new_attribute_pressed.bind(this));

        // Entity data.
        this.current_create_entity_wall_row_index = 5;
        this.create_entity_dictionary = {};
        this._add_label_and_input_for_create_entity_wall(ENTITY_PROPERTY_NAME);

        // Create new entity button.
        this.create_new_entity_button = this.create_entity_wall.add_floating_2d_text(.05, .95, 'create entity', TYPE_BUTTON, -1);
        this.create_new_entity_button.set_engage_function(this.create_new_entity.bind(this));

        this.create_entity_wall.add_close_button();
        this.create_entity_wall.show();
    },

    no_button_pressed: function() {
        this.wall_are_you_sure.hide();
    },

    yes_button_pressed: function() {
        this.wall_are_you_sure.hide();
        // TODO : Not everything is getting fully removed!
        this.wall.remove_from_scene();

        var all_walls = MANAGER_WORLD.world_home.entity_walls;
        var index_to_remove = -1;
        for (var i = 0; i < all_walls.length; i++) {
            if (all_walls[i].entity === this.entity) {
                index_to_remove = i;
            }
        }
        // TODO : Test if this was the solution.
        if (index_to_remove !== NOT_FOUND) {
            MANAGER_WORLD.world_home.entity_walls.splice(index_to_remove, 1);
        }
        // Now also delete the entity!
        MANAGER_ENTITY.delete_entity(this.entity);
    },

    __init__: function(world, entity) {
        this.world = world;
        this.entity = entity;

        this.position = this.get_value(ENTITY_PROPERTY_POSITION);
        this.normal = this.get_value(ENTITY_PROPERTY_NORMAL);
        this.width = this.get_value(ENTITY_PROPERTY_WIDTH);
        this.height = this.get_value(ENTITY_PROPERTY_HEIGHT);

        this.entities = [];

        this.init_base_wall();
        this.init_are_you_sure_wall();
        this.init_create_entity_wall();
        this.init_select_entity_type_wall();
        this.wall_select_attribute = null;
    },

    add_entity: function(entity) {

    },

    update: function() {
        this.wall.update();
    },

    /*                        __   __   ___      ___    __
      |  |  /\  |    |       /  ` |__) |__   /\   |  | /  \ |\ |
      |/\| /~~\ |___ |___    \__, |  \ |___ /~~\  |  | \__/ | \| */
    init_are_you_sure_wall: function() {
        this.wall_are_you_sure = this.wall.add_floating_wall_off_of_button(200, 70, this.delete_entity_wall_button, false);
        this.wall_are_you_sure.add_floating_2d_text(0, 1, 'Are you sure?', TYPE_CONSTANT_TEXT, 0);
        this.no_button = this.wall_are_you_sure.add_floating_2d_text(0, .5, 'No', TYPE_BUTTON, 2);
        this.no_button.set_engage_function(this.no_button_pressed.bind(this));
        this.no_button.set_color(COLOR_RED);
        this.yes_button = this.wall_are_you_sure.add_floating_2d_text(.5, 1, 'Yes', TYPE_BUTTON, 2);
        this.yes_button.set_engage_function(this.yes_button_pressed.bind(this));
        this.yes_button.set_color(COLOR_GREEN);
        this.wall_are_you_sure.hide();
    },

    init_create_entity_wall: function() {
        this.create_entity_wall = this.wall.add_floating_wall_off_of_button(400, 500, this.create_entity_button, false);
        this.create_entity_wall.add_close_button();
        this.create_entity_wall.hide();
    },

    init_base_wall: function() {
        this.wall = new FloatingWall(this.width, this.height, this.position, this.normal, this.world, true, this.normal_depth);

        this.wall.entity_to_update = this.entity;

        this.title = this.wall.add_floating_2d_text(.25, .75, 'Default Entity Wall Name', TYPE_INPUT_REGULAR, 0);
        this.create_entity_button = this.wall.add_floating_2d_text(.25, .75, 'Create New Entity', TYPE_BUTTON, 1);
        this.create_entity_button.set_engage_function(this.create_entity_button_pressed.bind(this));

        this.delete_entity_wall_button = this.wall.add_floating_2d_text(.05, .95, 'Delete Entity Wall', TYPE_BUTTON, -1);
        this.delete_entity_wall_button.set_engage_function(this.delete_entity_wall_button_pressed.bind(this));
        this.delete_entity_wall_button.set_color(COLOR_RED);
    },

    init_select_entity_type_wall: function() {
        this.entity_type_selector_wall = this.wall.add_floating_wall_off_of_button(400, 250, this.create_entity_button, false);
        this.entity_type_selector_wall.add_floating_2d_text(0, 1, 'Select Entity Type', TYPE_TITLE, 0);
        var entity_type_row_index = 3;
        for (var et = 0; et < ENTITY_TYPE_ALL.length; et++) {
            if (ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_TIME && ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_OWNER && ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_WALL) {
                var entity_type_row = this.entity_type_selector_wall.add_floating_2d_text(0, 1, ENTITY_TYPE_ALL[et], TYPE_BUTTON, entity_type_row_index, 0);
                entity_type_row_index += 1;
                entity_type_row.set_engage_function(this.entity_type_selected.bind(this, ENTITY_TYPE_ALL[et]));
            }
        }
        this.entity_type_selector_wall.add_close_button();
        this.entity_type_selector_wall.hide();
    },

    init_select_new_attribute_wall: function() {
        this.wall_select_attribute = this.wall.add_floating_wall_off_of_button(400, 250, this.current_add_new_attribute_button, false);

        this.wall_select_attribute.add_floating_2d_text(.05, .95, 'Select Entity Attribute', TYPE_TITLE, 0);

        var a0 = this.wall_select_attribute.add_floating_2d_text(0, 1, ENTITY_PROPERTY_DUE_DATE, TYPE_BUTTON, 3);
        var a1 = this.wall_select_attribute.add_floating_2d_text(0, 1, ENTITY_PROPERTY_DUE_TIME, TYPE_BUTTON, 4);
        var a2 = this.wall_select_attribute.add_floating_2d_text(0, 1, ENTITY_PROPERTY_COMPLETED, TYPE_BUTTON, 5);

        a0.set_engage_function(this.attribute_selected.bind(this, ENTITY_PROPERTY_DUE_DATE));
        a1.set_engage_function(this.attribute_selected.bind(this, ENTITY_PROPERTY_DUE_TIME));
        a2.set_engage_function(this.attribute_selected.bind(this, ENTITY_PROPERTY_COMPLETED));

        this.wall_select_attribute.add_close_button();
        this.wall_select_attribute.hide();
    },

    /* ___      ___   ___                             ___  __
      |__  |\ |  |  |  |  \ /    \  /  /\  |    |  | |__  /__`
      |___ | \|  |  |  |   |      \/  /~~\ |___ \__/ |___ .__/ */

    update_value: function(value_name, value) {
        if (value_name === ENTITY_PROPERTY_POSITION) {
            value = '[' + value.x + ',' + value.y + ',' + value.z + ']';
        }
        this.entity.set_property(value_name, value);
    },

    get_value: function(value_name) {
        var value;
        switch(value_name) {
        case ENTITY_PROPERTY_HORIZONTAL_OFFSET:
        case ENTITY_PROPERTY_VERTICAL_OFFSET:
        case ENTITY_PROPERTY_WIDTH:
        case ENTITY_PROPERTY_HEIGHT:
            return parseInt(this.entity.get_value(value_name));
        case ENTITY_PROPERTY_NORMAL:
            value = this.entity.get_value(value_name);
            value = value.replace('[', '').replace(']', '').split(',');
            return new THREE.Vector3(parseFloat(value[0]), parseFloat(value[1]), parseFloat(value[2]));
        case ENTITY_PROPERTY_POSITION:
            value = this.entity.get_value(value_name);
            value = value.replace('[', '').replace(']', '').split(',');
            return new THREE.Vector3(parseInt(value[0]), parseInt(value[1]), parseInt(value[2]));
        }
    }

};
