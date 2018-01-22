'use strict';

function EntityWall(world) {
    this.__init__(world);
}

EntityWall.prototype = {

    __init__: function(world) {
        /*
        // Inherit from Saveable.
        Saveable.call(this, ENTITY_TYPE_WALL);
        this.add_save_field(ENTITY_PROPERTY_WIDTH);
        this.add_save_field(ENTITY_PROPERTY_HEIGHT);
        this.add_save_field(ENTITY_PROPERTY_POSITION);
        this.add_save_field(ENTITY_PROPERTY_NORMAL);
        this.add_save_field(ENTITY_PROPERTY_IS_ROOT_ATTACHABLE);
        */

        this.base_wall = new FloatingWall();
    }

};