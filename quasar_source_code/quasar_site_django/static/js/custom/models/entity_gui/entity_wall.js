'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    __init__: function(world, entity) {
        if (!is_defined(entity)) {
            this.base_wall = new FloatingWall(400, 600, null, null, world, true);
            this.base_wall.add_row_3D_text(false, -1, 'Entity Wall', TYPE_INPUT);

            this.base_wall.set_to_saveable();
        } else {
            this.base_wall = new FloatingWall(400, 600, null, null, world, true);
            
            // -1+Second wall to save as a test....;D?+input+rgba(255, 255, 255, 0.0)@

            this.base_wall.set_entity(entity);

            var width = this.base_wall.get_value(ENTITY_PROPERTY_WIDTH);
            var height = this.base_wall.get_value(ENTITY_PROPERTY_HEIGHT);
            var position = this.base_wall.get_value(ENTITY_PROPERTY_POSITION);
            var normal = this.base_wall.get_value(ENTITY_PROPERTY_NORMAL);

            var rows_2D = this.base_wall.get_value(ENTITY_PROPERTY_2D_ROWS);
            var rows_3D = this.base_wall.get_value(ENTITY_PROPERTY_3D_ROWS);


            // Parse the 2D rows.
            if (is_defined(rows_2D)) {
                rows_2D = rows_2D.split('@');
                for (var r2 = 0; r2 < rows_2D.length; r2++) {
                    l('PARSE THE FOLLOWING 2D ROW!!!');
                    l(rows_2D[r2]);
                }
            }

            // Parse the 3D rows.
            if (is_defined(rows_3D)) {
                rows_3D = rows_3D.split('@');
                for (var r3 = 0; r3 < rows_3D.length; r3++) {
                    l('PARSE THE FOLLOWING 3D ROW!!!');
                    l(rows_3D[r3]);
                }
            }

        }
    }

};