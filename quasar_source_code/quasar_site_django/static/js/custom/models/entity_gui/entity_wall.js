'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    __init__: function(world, entity) {
        if (!is_defined(entity)) {
            /*__   __   ___      ___         __           ___          ___      ___   ___
             /  ` |__) |__   /\   |  | |\ | / _`    |\ | |__  |  |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
             \__, |  \ |___ /~~\  |  | | \| \__>    | \| |___ |/\|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
            var pp = CURRENT_PLAYER.get_position();
            var pn = CURRENT_PLAYER.get_direction();
            var p = new THREE.Vector3(pp.x + pn.x * 200, pp.y + pn.y * 200, pp.z + pn.z * 200);
            var n = new THREE.Vector3(-pn.x, 0, -pn.z);

            this.base_wall = new FloatingWall(400, 600, p, n, world, true);
            this.base_wall.add_full_row_3D(-1, 'Entity Wall', TYPE_INPUT);

            this.base_wall.set_to_saveable();
        } else {
            /*     __        __          __      ___      ___   ___
             |    /  \  /\  |  \ | |\ | / _`    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
             |___ \__/ /~~\ |__/ | | \| \__>    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
            this.base_wall = new FloatingWall(400, 600, null, null, world, true);

            this.base_wall.set_entity(entity);

            var width = this.base_wall.get_value(ENTITY_PROPERTY_WIDTH);
            var height = this.base_wall.get_value(ENTITY_PROPERTY_HEIGHT);
            var position = this.base_wall.get_value(ENTITY_PROPERTY_POSITION);
            var normal = this.base_wall.get_value(ENTITY_PROPERTY_NORMAL);

            this.base_wall.width = width;
            this.base_wall.height = height;
            this.base_wall.set_position(position.x, position.y, position.z);
            this.base_wall.set_normal(normal.x, normal.y, normal.z);

            this.base_wall.dimensions_changed();

            var rows_3D = this.base_wall.get_value(ENTITY_PROPERTY_3D_ROWS);
            // INDEX --> 0 - row_number, 1 - text, 2 - type
            if (rows_3D !== 'none') {

            }

            // TODO : ADD ROWS!!!!
            // TODO : ADD ROWS!!!!

            this.base_wall.refresh_position_and_look_at();
        }

        // Create the standard functionality of the entity wall.
        this.create_new_entity_button = this.base_wall.add_row(0).add_2D_button([0, 1], 'create new entity', COLOR_GREEN, null);


        // TODO : Create a button for deleting the entity wall!!


        // Regardless if created or loaded the following operations must be taken.
        // TODO : This should be automatic? Remove the need to explicitly need to write this code.
        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();
        this._create_entity_wall();

        // Wall used for creating new entities.
        this.wall_create_new_entity = new EntityCreator(this.base_wall, this.entity_wall);
        this.wall_create_new_entity.set_display_button(this.create_new_entity_button);


        this.base_wall.refresh_position_and_look_at();
    },

    _create_entity_wall: function() {
        this.entity_wall = this.base_wall.add_floating_wall_attachment(this.base_wall.width * .8, this.base_wall.height * .8, 0, 0, 5, false);
        this.entity_wall.set_background_color(COLOR_BLACK, true);
        this.entity_wall.set_to_saveable();
        this.entity_wall._entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_ENTITY_WALL);
        this.entity_wall._entity.add_parent(this.base_wall._entity);



        //this.entity_wall = new FloatingWall(this.base_wall.width * .8, this.base_wall.height * .8, null, null, this.base_wall.normal, false, COLOR_BLACK);
        //this.entity_wall.attach_to(this.base_wall);
        //this.entity_wall.set_attachment_depth_offset(5);
    }

};