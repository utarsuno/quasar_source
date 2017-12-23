'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    // TODO : Abstract away the Entity Attribute Selector

    delete_entity_wall_button_pressed: function() {
        this.wall_are_you_sure.show();
    },

    create_new_entity: function() {
        var entity_data = {};
        for (var key in this.create_entity_dictionary) {
            if (this.create_entity_dictionary.hasOwnProperty(key)) {
                entity_data[key] = this.create_entity_dictionary[key].get_text();
            }
        }

        var new_entity = new Entity(entity_data);
        this.entity.add_child(new_entity);
        this.create_entity_wall.hide();

        this.reload_entity_rows();
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

    _add_label_and_input_for_create_entity_wall: function(label, default_value) {
        this.create_entity_wall.add_floating_2d_text(0, 1 / 3, label, TYPE_CONSTANT_TEXT, this.current_create_entity_wall_row_index);
        // TODO : Make the first click clear the value here text.

        var value;
        if (is_defined(default_value)) {
            value = default_value;
        } else {
            value = 'default_value';
        }

        this.create_entity_dictionary[label] = this.create_entity_wall.add_floating_2d_text(1 / 3, 1, value, TYPE_INPUT_REGULAR, this.current_create_entity_wall_row_index);
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

        if (selected_type === ENTITY_TYPE_TASK) {
            this._add_label_and_input_for_create_entity_wall(ENTITY_PROPERTY_DUE_DATE, 'tbd');
            this._add_label_and_input_for_create_entity_wall(ENTITY_PROPERTY_COMPLETED, 'no');
            this._add_label_and_input_for_create_entity_wall(ENTITY_PROPERTY_IMPORTANCE, '-1');
        }

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

        this.entity_rows = [];

        this.init_base_wall();
        this.init_are_you_sure_wall();
        this.init_create_entity_wall();
        this.init_select_entity_type_wall();
        this.wall_select_attribute = null;
        this.wall_edit_entity = null;
        this.wall_edit_entity_add_attribute = null;

        this.reload_entity_rows();
    },

    edit_entity_save_changes_button_pressed: function() {
        var values = {};
        for (var key in this._current_properties) {
            if (this._current_properties.hasOwnProperty(key)) {
                values[key] = this._current_properties[key].get_text();
            }
        }
        this._current_entity.update_values(values);
        this.wall_edit_entity.hide();
        this.reload_entity_rows();
    },

    prepare_for_save: function() {
        this.update_value(ENTITY_PROPERTY_NAME, this.title.get_text());
        this.update_value(ENTITY_PROPERTY_POSITION, new THREE.Vector3(this.wall.x_without_normal, this.wall.y_without_normal, this.wall.z_without_normal));
        this.update_value(ENTITY_PROPERTY_NORMAL, this.wall.normal);
        this.update_value(ENTITY_PROPERTY_WIDTH, this.wall.width);
        this.update_value(ENTITY_PROPERTY_HEIGHT, this.wall.height);

        var all_entity_walls = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_WALL);
        var wall_entity = null;
        for (var i = 0; i < all_entity_walls.length; i++) {
            if (all_entity_walls[i].get_value(ENTITY_PROPERTY_NAME) === this.title.get_text()) {
                wall_entity = all_entity_walls[i];
                break;
            }
        }

        if (is_defined(wall_entity)) {
            this.update_value(ENTITY_PROPERTY_NAME, this.title.get_text());
            this.update_value(ENTITY_PROPERTY_POSITION, new THREE.Vector3(this.wall.x_without_normal, this.wall.y_without_normal, this.wall.z_without_normal));
            this.update_value(ENTITY_PROPERTY_NORMAL, this.wall.normal);
            this.update_value(ENTITY_PROPERTY_WIDTH, this.wall.width);
            this.update_value(ENTITY_PROPERTY_HEIGHT, this.wall.height);
        }
    },

    /*
            if (this.title.get_text() !== this.get_value(ENTITY_PROPERTY_NAME)) {
            this.update_value(ENTITY_PROPERTY_NAME, this.title.get_text());
        }
     */

    attribute_selected_for_edit_entity: function(attribute_name, button, entity) {
        this.wall_edit_entity_add_attribute.hide();
        entity.set_property(attribute_name, 'no value');
        this.edit_this_entity(button, entity);
    },

    edit_entity_add_attribute_button_pressed: function(button, entity) {
        if (!is_defined(this.wall_edit_entity_add_attribute)) {
            this.init_edit_entity_attribute_wall(button);
        } else {
            this.wall_edit_entity_add_attribute['pfw_button'] = button;
        }
        this.wall_edit_entity_add_attribute.clear_floating_2d_texts();

        this.wall_edit_entity_add_attribute.add_floating_2d_text(.10, .90, 'Select Entity Attribute', TYPE_TITLE, 0);

        var a0 = this.wall_edit_entity_add_attribute.add_floating_2d_text(0, 1, ENTITY_PROPERTY_DUE_DATE, TYPE_BUTTON, 3);
        var a1 = this.wall_edit_entity_add_attribute.add_floating_2d_text(0, 1, ENTITY_PROPERTY_DUE_TIME, TYPE_BUTTON, 4);
        var a2 = this.wall_edit_entity_add_attribute.add_floating_2d_text(0, 1, ENTITY_PROPERTY_COMPLETED, TYPE_BUTTON, 5);

        a0.set_engage_function(this.attribute_selected_for_edit_entity.bind(this, ENTITY_PROPERTY_DUE_DATE, button, entity));
        a1.set_engage_function(this.attribute_selected_for_edit_entity.bind(this, ENTITY_PROPERTY_DUE_TIME, button, entity));
        a2.set_engage_function(this.attribute_selected_for_edit_entity.bind(this, ENTITY_PROPERTY_COMPLETED, button, entity));

        this.wall_edit_entity_add_attribute.add_close_button();
        this.wall_edit_entity_add_attribute.show();
    },

    edit_entity_delete_entity_button_pressed: function(entity_row, entity) {
        var index_to_remove = -1;
        for (var i = 0; i < this.entity_rows.length; i++) {
            if (this.entity_rows[i][1] === entity) {
                index_to_remove = i;
            }
        }
        if (index_to_remove !== NOT_FOUND) {

            this.entity_rows.splice(index_to_remove, 1);
        }
        this.entity.remove_child(entity);
        MANAGER_ENTITY.delete_entity(entity);
        this.wall_edit_entity.hide();
        this.reload_entity_rows();
    },

    edit_this_entity: function(new_floating_row, entity) {
        if (!is_defined(this.wall_edit_entity)) {
            this.init_edit_entity_wall(new_floating_row);
        } else {
            this.wall_edit_entity['pfw_button'] = new_floating_row;
        }
        this.wall_edit_entity.clear_floating_2d_texts();

        this.wall_edit_entity.add_floating_2d_text(0.25, 0.75, 'Editing Entity', TYPE_TITLE, 0);

        var edit_entity_add_attribute_button = this.wall_edit_entity.add_floating_2d_text(0.25, 0.75, 'Add Attribute', TYPE_BUTTON, 3);
        edit_entity_add_attribute_button.set_engage_function(this.edit_entity_add_attribute_button_pressed.bind(this, edit_entity_add_attribute_button, entity));


        this._current_properties = {};
        this._current_entity = entity;

        var row_index = 5;
        var entity_properties = entity.get_all_non_default_properties();
        for (var key in entity_properties) {
            if (entity_properties.hasOwnProperty(key)) {
                if (key !== ENTITY_DEFAULT_PROPERTY_CHILD_IDS && key !== ENTITY_DEFAULT_PROPERTY_RELATIVE_ID && key !== ENTITY_DEFAULT_PROPERTY_PARENT_IDS) {
                    this.wall_edit_entity.add_floating_2d_text(0, 1 / 3, key, TYPE_CONSTANT_TEXT, row_index);
                    this._current_properties[key] = this.wall_edit_entity.add_floating_2d_text(1 / 3, 1, entity_properties[key], TYPE_INPUT_REGULAR, row_index);
                    row_index += 1;
                }
            }
        }

        // Now add 1 to the row index to give space to the save_changes button.
        row_index += 2;

        // TODO : Make the save changes button only appear after a change has been made (and go away as well if the changes dont change default values).
        var edit_entity_save_changes_button = this.wall_edit_entity.add_floating_2d_text(0.25, 0.75, 'Save Changes', TYPE_BUTTON, row_index - 1);
        edit_entity_save_changes_button.set_default_color(COLOR_GREEN);
        edit_entity_save_changes_button.set_engage_function(this.edit_entity_save_changes_button_pressed.bind(this));

        var edit_entity_delete_entity_button = this.wall_edit_entity.add_floating_2d_text(0.25, 0.75, 'Delete Entity', TYPE_BUTTON, row_index);
        edit_entity_delete_entity_button.set_default_color(COLOR_RED);
        edit_entity_delete_entity_button.set_engage_function(this.edit_entity_delete_entity_button_pressed.bind(this, new_floating_row, entity));

        //var percent_change_needed = desired_height / this.wall_edit_entity_default_height;
        //this.wall_edit_entity._update_height(percent_change_needed);
        var desired_height = row_index * edit_entity_save_changes_button.height;
        this.wall_edit_entity._set_height(desired_height);

        this.wall_edit_entity.add_close_button();
        this.wall_edit_entity.show();
    },

    reload_entity_rows: function() {
        this.entity_rows.length = 0;
        this.wall.remove_floating_2d_texts_with_property('remove_on_reload');

        var entity_row_order = MANAGER_ENTITY.get_entities_sorted_by_priority(this.entity.children);

        for (var e = 0; e < entity_row_order.length; e++) {
            var current_child = entity_row_order[e];

            var new_floating_row = this.wall.add_floating_2d_text(.1, .9, current_child.get_value(ENTITY_PROPERTY_NAME), TYPE_BUTTON, 6 + this.entity_rows.length);
            new_floating_row.remove_on_reload = true;
            new_floating_row.set_engage_function(this.edit_this_entity.bind(this, new_floating_row, current_child));

            if (current_child.has_property(ENTITY_PROPERTY_COMPLETED)) {
                if (current_child.get_value(ENTITY_PROPERTY_COMPLETED) === 'no') {
                    new_floating_row.set_default_color(COLOR_RED);
                } else {
                    new_floating_row.set_default_color(COLOR_GREEN);
                }
            }

            this.entity_rows.push([new_floating_row, this.entity.children[e]]);
        }
    },

    load_entity: function(entity) {
        this.entity.add_child(entity);
        // TODO : Optimize this routine.
        this.reload_entity_rows();
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

    init_edit_entity_wall: function(button) {
        this.wall_edit_entity_default_height = 350;
        this.wall_edit_entity = this.wall.add_floating_wall_off_of_button(600, this.wall_edit_entity_default_height, button, false);
    },

    init_create_entity_wall: function() {
        this.create_entity_wall = this.wall.add_floating_wall_off_of_button(600, 250, this.create_entity_button, false);
        this.create_entity_wall.add_close_button();
        this.create_entity_wall.hide();
    },

    init_edit_entity_attribute_wall: function(button) {
        this.wall_edit_entity_add_attribute = this.wall.add_floating_wall_off_of_button(400, 400, button, false);
    },

    init_base_wall: function() {
        this.wall = new FloatingWall(this.width, this.height, this.position, this.normal, this.world, true);

        this.title = this.wall.add_floating_2d_text(.1, .9, this.get_value(ENTITY_PROPERTY_NAME), TYPE_TITLE, 0);
        this.create_entity_button = this.wall.add_floating_2d_text(.25, .75, 'Create New Entity', TYPE_BUTTON, 3);
        this.create_entity_button.set_engage_function(this.create_entity_button_pressed.bind(this));

        this.delete_entity_wall_button = this.wall.add_floating_2d_text(.05, .95, 'Delete Entity Wall', TYPE_BUTTON, -1);
        this.delete_entity_wall_button.set_engage_function(this.delete_entity_wall_button_pressed.bind(this));
        this.delete_entity_wall_button.set_default_color(COLOR_RED);
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

        this.wall_select_attribute.add_floating_2d_text(.10, .90, 'Select Entity Attribute', TYPE_TITLE, 0);

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
        } else if (value_name === ENTITY_PROPERTY_NORMAL) {
            value = '[' + value.x + ',' + value.y + ',' + value.z + ']';
        }
        this.entity.set_property(value_name, value);
        if (value_name === ENTITY_PROPERTY_HEIGHT) {
            l(this.entity);
            l(value);
        }
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
            l(this.entity);
            value = this.entity.get_value(value_name);
            value = value.replace('[', '').replace(']', '').split(',');
            return new THREE.Vector3(parseInt(value[0]), parseInt(value[1]), parseInt(value[2]));
        default:
            return this.entity.get_value(value_name);
        }
    }

};
