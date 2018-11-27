'use strict';

$_QE.prototype.DemoRoomTile = function(x, y, home_tile, demo_room) {
    this.room         = demo_room;
    this.is_home_tile = home_tile;
    this.x            = x;
    this.y            = y;
    this.has_left     = false;
    this.has_right    = false;
    this.has_up       = false;
    this.has_down     = false;

    this.group        = new THREE.Group();
    this.group.position.set(this.x * this.get_size(), 0, this.y * this.get_size());
    this.group.updateMatrix();
};

$_QE.prototype.DemoRoomTile.prototype = {

    get_world_x: function() {
        return this.x * this.get_size();
    },

    get_world_z: function() {
        return this.z * this.get_size();
    },

    get_size: function() {
        return this.room.tile_size;
    },

    is_matched: function(x, y) {
        return this.x == x && this.y == y;
    },

    initialize_neighbors: function() {
        this.has_left  = this.room._has_tile(this.x - 1, this.y);
        this.has_right = this.room._has_tile(this.x + 1, this.y);
        this.has_up    = this.room._has_tile(this.x, this.y + 1);
        this.has_down  = this.room._has_tile(this.x, this.y - 1);
    },

};
