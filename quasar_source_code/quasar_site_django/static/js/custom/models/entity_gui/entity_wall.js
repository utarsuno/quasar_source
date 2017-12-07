'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    create_entity_button_pressed: function() {
        this.create_entity_wall.set_to_visible();
    },

    __init__: function(world, entity) {
        this.world = world;
        this.entity = entity;

        this.normal_depth = this.get_normal_depth();
        this.position = this.get_position();
        this.normal = this.get_normal();
        this.width = this.get_width();
        this.height = this.get_height();

        // Base wall.
        this.wall = new FloatingWall(this.width, this.height, this.position, this.normal, this.world, true, this.normal_depth);
        this.title = this.wall.add_floating_2d_text(.25, .75, 'Default Entity Wall Name', TYPE_INPUT_REGULAR, 0);
        this.create_entity_button = this.wall.add_floating_2d_text(1 / 3, 2 / 3, 'Create New Entity', TYPE_BUTTON, 1);
        this.create_entity_button.set_engage_function(this.create_entity_button_pressed.bind(this));

        // Create entity floating wall.
        this.create_entity_wall = this.wall.add_floating_wall_off_of_button(400, 500, this.create_entity_button, false, this.normal_depth);
        this.create_entity_wall.hide();
    },

    update: function() {

    },

    // Entity values.

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
