'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    create_entity_button_pressed: function() {
        this.select_entity_type.show();
    },

    entity_row_type_selected: function(selected_type) {
        this.select_entity_type.hide();

        this.create_entity_wall.clear_floating_2d_texts();

        this.create_entity_wall.add_floating_2d_text(.05, .95, 'Create New ' + selected_type, TYPE_TITLE, 0);

        this.create_entity_wall.add_floating_2d_text(.05, .95, 'add new attribute', TYPE_BUTTON, 3);

        this.create_entity_wall.add_floating_2d_text(0, 1 / 3, ENTITY_PROPERTY_NAME, TYPE_CONSTANT_TEXT, 5);
        this.create_entity_wall.add_floating_2d_text(1 / 3, 1, ENTITY_PROPERTY_NAME, TYPE_CONSTANT_TEXT, 5);

        this.create_entity_wall.add_floating_2d_text(.05, .95, 'create entity', TYPE_BUTTON, -1);
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
        this.select_entity_type = this.wall.add_floating_wall_off_of_button(350, 250, this.create_entity_button, false);
        this.select_entity_type.add_floating_2d_text(0, 1, 'Select Entity Type', TYPE_TITLE, 0);
        var entity_type_row_index = 3;
        for (var et = 0; et < ENTITY_TYPE_ALL.length; et++) {
            if (ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_TIME && ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_OWNER && ENTITY_TYPE_ALL[et] !== ENTITY_TYPE_WALL) {
                var entity_type_row = this.entity_type_selector.add_floating_2d_text(0, 1, ENTITY_TYPE_ALL[et], TYPE_BUTTON, entity_type_row_index, 0);
                entity_type_row_index += 1;
                entity_type_row.set_engage_function(this.entity_row_type_selected.bind(this, ENTITY_TYPE_ALL[et]));
            }
        }
        this.select_entity_type.add_close_button();
        this.select_entity_type.hide();
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
