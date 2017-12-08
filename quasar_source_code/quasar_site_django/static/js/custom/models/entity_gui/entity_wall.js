'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    create_entity_button_pressed: function() {
        this.entity_type_selector_wall.show();
    },

    add_new_attribute_pressed: function() {
        this.wall_select_attribute.show();
    },

    attribute_selected: function(attribute) {
        this.wall_select_attribute.hide();

        this.create_entity_wall.add_floating_2d_text(0, 1 / 3, attribute, TYPE_CONSTANT_TEXT, this.current_create_entity_wall_row_index);
        this.create_entity_wall.add_floating_2d_text(1 / 3, 1, 'value_here', TYPE_INPUT_REGULAR, this.current_create_entity_wall_row_index);

        this.current_create_entity_wall_row_index += 1;
    },

    entity_row_type_selected: function(selected_type) {
        this.entity_type_selector_wall.hide();


        this.create_entity_wall.clear_floating_2d_texts();

        this.create_entity_wall.add_floating_2d_text(.05, .95, 'Create New ' + selected_type, TYPE_TITLE, 0);

        this.current_add_new_attribute_button = this.create_entity_wall.add_floating_2d_text(.05, .95, 'add new attribute', TYPE_BUTTON, 3);

        if (!is_defined(this.wall_select_attribute)) {
            this.init_select_new_attribute_wall();
        } else {
            this.wall_select_attribute.pfw_button = this.current_add_new_attribute_button;
        }

        this.current_add_new_attribute_button.set_engage_function(this.add_new_attribute_pressed.bind(this));

        this.current_create_entity_wall_row_index = 5;

        this.create_entity_wall.add_floating_2d_text(0, 1 / 3, ENTITY_PROPERTY_NAME, TYPE_CONSTANT_TEXT, this.current_create_entity_wall_row_index);
        // TODO : Make the first click clear the name_here text.
        this.create_entity_wall.add_floating_2d_text(1 / 3, 1, 'name here', TYPE_INPUT_REGULAR, this.current_create_entity_wall_row_index);

        this.current_create_entity_wall_row_index += 1;

        this.create_entity_wall.add_floating_2d_text(.05, .95, 'create entity', TYPE_BUTTON, -1);

        this.create_entity_wall.add_close_button();
        this.create_entity_wall.show();
    },

    __init__: function(world, entity) {
        this.world = world;
        this.entity = entity;

        this.normal_depth = this.get_normal_depth();
        this.position = this.get_position();
        this.normal = this.get_normal();
        this.width = this.get_width();
        this.height = this.get_height();

        this.init_base_wall();
        this.init_create_entity_wall();
        this.init_select_entity_type_wall();
        this.wall_select_attribute = null;

    },

    update: function() {
        this.wall.update();
    },

    /*                        __   __   ___      ___    __
      |  |  /\  |    |       /  ` |__) |__   /\   |  | /  \ |\ |
      |/\| /~~\ |___ |___    \__, |  \ |___ /~~\  |  | \__/ | \| */
    init_create_entity_wall: function() {
        this.create_entity_wall = this.wall.add_floating_wall_off_of_button(400, 500, this.create_entity_button, false);
        this.create_entity_wall.add_close_button();
        this.create_entity_wall.hide();
    },

    init_base_wall: function() {
        this.wall = new FloatingWall(this.width, this.height, this.position, this.normal, this.world, true, this.normal_depth);
        this.title = this.wall.add_floating_2d_text(.25, .75, 'Default Entity Wall Name', TYPE_INPUT_REGULAR, 0);
        this.create_entity_button = this.wall.add_floating_2d_text(.25, .75, 'Create New Entity', TYPE_BUTTON, 1);
        this.create_entity_button.set_engage_function(this.create_entity_button_pressed.bind(this));
    },

    init_select_entity_type_wall: function() {
        this.entity_type_selector_wall = this.wall.add_floating_wall_off_of_button(400, 250, this.create_entity_button, false);
        this.entity_type_selector_wall.add_floating_2d_text(0, 1, 'Select Entity Type', TYPE_TITLE, 0);
        var entity_type_row_index = 3;
        for (var et = 0; et < ENTITY_TYPE_ALL.length; et++) {
            if (ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_TIME && ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_OWNER && ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_WALL) {
                var entity_type_row = this.entity_type_selector_wall.add_floating_2d_text(0, 1, ENTITY_TYPE_ALL[et], TYPE_BUTTON, entity_type_row_index, 0);
                entity_type_row_index += 1;
                entity_type_row.set_engage_function(this.entity_row_type_selected.bind(this, ENTITY_TYPE_ALL[et]));
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

    get_position: function() {
        if (!is_defined(this.position)) {
            var position_value = this.entity.get_value(ENTITY_PROPERTY_POSITION);
            position_value = position_value.replace('[', '').replace(']', '');
            position_value = position_value.split(',');
            this.position = new THREE.Vector3(parseFloat(position_value[0]), parseFloat(position_value[1]), parseFloat(position_value[2]));
        }
        return this.position;
    },

    get_normal: function() {
        if (!is_defined(this.normal)) {
            var position_value = this.entity.get_value(ENTITY_PROPERTY_NORMAL);
            position_value = position_value.replace('[', '').replace(']', '');
            position_value = position_value.split(',');
            this.normal = new THREE.Vector3(parseFloat(position_value[0]), parseFloat(position_value[1]), parseFloat(position_value[2]));
        }
        return this.normal;
    },

    get_width: function() {
        if (!is_defined(this.width)) {
            var width_value = this.entity.get_value(ENTITY_PROPERTY_WIDTH);
            this.width = parseInt(width_value);
        }
        return this.width;
    },

    get_height: function() {
        if (!is_defined(this.height)) {
            var height_value = this.entity.get_value(ENTITY_PROPERTY_HEIGHT);
            this.height = parseInt(height_value);
        }
        return this.height;
    },

    get_normal_depth: function() {
        if (!is_defined(this.normal_depth)) {
            var normal_depth = this.entity.get_value(ENTITY_PROPERTY_NORMAL_DEPTH);
            this.normal_depth = parseInt(normal_depth);
        }
        return this.normal_depth;
    }
};
