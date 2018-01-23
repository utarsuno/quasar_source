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

                    // INDEX {ROW}          - 0
                    // INDEX {X_START}      - 1
                    // INDEX {X_END}        - 2
                    // INDEX {TEXT}         - 3
                    // INDEX {TYPE}         - 4
                    // INDEX {COLOR}        - 5
                    // INDEX {SYNTAX_RULES} - 6

                    var d = rows_2D.split('+');

                    this.base_wall.add_row_2D_text([d[1], d[2]], d[0], d[3], d[4], d[6], d[5]);
                }
            }

            // Parse the 3D rows.
            if (is_defined(rows_3D)) {
                rows_3D = rows_3D.split('@');
                for (var r3 = 0; r3 < rows_3D.length; r3++) {
                    l('PARSE THE FOLLOWING 3D ROW!!!');
                    l(rows_3D[r3]);

                    // INDEX {ROW}      - 0
                    // INDEX {CENTERED} - 1
                    // INDEX {TEXT}     - 2
                    // INDEX {TYPE}     - 3
                    // INDEX {COLOR}    - 4

                    var d = rows_3D.split('+');

                    this.base_wall.add_row_3D_text(d[1], d[0], d[2], d[3], d[4]);

                }
            }

            this.base_wall.refresh_position_and_look_at();
        }

        // Regardless if created or loaded the following operations must be taken.
        this.base_wall.world.interactive_objects.push(this.base_wall);
        this.base_wall.world.root_attachables.push(this.base_wall);
    }

};