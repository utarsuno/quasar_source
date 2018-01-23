'use strict';

function EntityWall(world) {
    this.__init__(world);
}

EntityWall.prototype = {

    __init__: function(world) {
        this.base_wall = new FloatingWall(400, 600, null, null, world, true);
        this.base_wall.add_row_3D_text(false, -1, 'Entity Wall', TYPE_INPUT);

        this.base_wall.saveable = true;
    }

};