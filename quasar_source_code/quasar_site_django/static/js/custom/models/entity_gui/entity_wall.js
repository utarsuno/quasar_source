'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    __init__: function(world, entity) {
        this.base_wall = new FloatingWall(400, 600, null, null, world, true);

        if (!is_defined(entity)) {
            this.base_wall.add_row_3D_text(false, -1, 'Entity Wall', TYPE_INPUT);

            this.base_wall.set_to_saveable();
        } else {
            // -1+Second wall to save as a test....;D?+input+rgba(255, 255, 255, 0.0)@

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

            var rows_2D = this.base_wall.get_value(ENTITY_PROPERTY_2D_ROWS);
            var rows_3D = this.base_wall.get_value(ENTITY_PROPERTY_3D_ROWS);


            // Parse the 2D rows.
            if (is_defined(rows_2D)) {
                rows_2D = rows_2D.split('@');
                for (var r2 = 0; r2 < rows_2D.length; r2++) {
                    l('PARSE THE FOLLOWING 2D ROW!!!');
                    l(rows_2D[r2]);
                    if (rows_2D[r2] !== '') {

                        // INDEX {ROW}          - 0
                        // INDEX {X_START}      - 1
                        // INDEX {X_END}        - 2
                        // INDEX {TEXT}         - 3
                        // INDEX {TYPE}         - 4
                        // INDEX {COLOR}        - 5
                        // INDEX {SYNTAX_RULES} - 6

                        var d = rows_2D[r2].split('+');

                        this.base_wall.add_row_2D_text([d[1], d[2]], d[0], d[3], d[4], d[6], d[5]);
                    }
                }
            }

            // Parse the 3D rows.
            if (is_defined(rows_3D)) {
                rows_3D = rows_3D.split('@');
                for (var r3 = 0; r3 < rows_3D.length; r3++) {
                    l('PARSE THE FOLLOWING 3D ROW!!!');
                    l(rows_3D[r3]);
                    if (rows_3D[r3] !== '') {

                        // INDEX {ROW}      - 0
                        // INDEX {CENTERED} - 1
                        // INDEX {TEXT}     - 2
                        // INDEX {TYPE}     - 3
                        // INDEX {COLOR}    - 4

                        var d = rows_3D[r3].split('+');

                        if (d[1] === 'true' || d[1] === 'True') {
                            d[1] = true;
                        } else if (d[1] === 'false' || d[1] === 'False') {
                            d[1] = false;
                        }

                        this.base_wall.add_row_3D_text(d[1], d[0], d[2], d[3], d[4]);
                    }
                }
            }

            this.base_wall.refresh_position_and_look_at();
        }

        // Create the standard functionality of the entity wall.
        this.create_new_entity_button = this.base_wall.add_row_2D_text([0, 1], 0, 'Create New Entity', TYPE_BUTTON, null, COLOR_GREEN);
        this.create_new_entity_button.set_engage_function(this._create_new_entity_button_pressed.bind(this));


        // Regardless if created or loaded the following operations must be taken.
        // TODO : This should be automatic? Remove the need to explicitly need to write this code.
        this.base_wall.world.interactive_objects.push(this.base_wall);
        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();

        /*__   __   ___      ___  ___          ___          ___      ___   ___
         /  ` |__) |__   /\   |  |__     |\ | |__  |  |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
         \__, |  \ |___ /~~\  |  |___    | \| |___ |/\|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
        this.wall_create_new_entity = new FloatingWall(600, 400, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_SUCCESS);
        this.wall_create_new_entity.set_attachment_depth_offset(10);
        this.wall_create_new_entity.add_row_3D_text(false, -1, 'Create New Entity', TYPE_TITLE, COLOR_GREEN);
        this.wall_create_new_entity.add_close_button();
        this.wall_create_new_entity.attach_to(this.create_new_entity_button);
        this.wall_create_new_entity.hide_self_and_all_child_attachments_recursively();
    },

    _create_new_entity_button_pressed: function() {
        this.wall_create_new_entity.display_self_and_all_child_attachments_recursively();
        this.wall_create_new_entity.refresh_position_and_look_at();
    }


};