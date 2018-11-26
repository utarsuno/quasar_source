'use strict';

$_QE.prototype.DemoRoom = function(tiles, home_tile, world, alias) {
    this.tiles     = [];
    this.home_tile = null;
    this.world     = world;
    this.tile_size = 2048;
    let t;
    for (t = 0; t < tiles.length; t++) {
        this.add_tile(tiles[t][0], tiles[t][1], home_tile);
    }
    for (t = 0; t < this.tiles.length; t++) {
        this.tiles[t].initialize_neighbors();
    }
    this.create_singleton();
    this.set_alias(alias);
};

Object.assign(
    $_QE.prototype.DemoRoom.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        _has_tile: function(x, y) {
            let t;
            for (t = 0; t < this.tiles.length; t++) {
                if (this.tiles[t].is_matched(x, y)) {
                    return true;
                }
            }
            return false;
        },

        add_tile: function(x, y, home_tile_coordinates) {
            if (home_tile_coordinates[0] == x && home_tile_coordinates[0] == y) {
                this.home_tile = new $_QE.prototype.DemoRoomTile(x, y, true, this);
                this.tiles.push(this.home_tile);
            } else {
                this.tiles.push(new $_QE.prototype.DemoRoomTile(x, y, false, this));
            }
        },

        __init__: function() {
            this.group = new THREE.Group();
            let t;
            for (t = 0; t < this.tiles.length; t++) {
                this.tiles[t]._create_tile();
                this.group.add(this.tiles[t].group);
            }
            this.group.updateMatrix();
            for (t = 0; t < this.tiles.length; t++) {
                this.tiles[t]._update_lights();
            }
        },

    }
);
