'use strict';

$_QE.prototype.DemoRoom = function(tiles, home_tile, alias) {
    this.tiles     = [];
    this.home_tile = null;
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

            this.floor   = new THREE.Group();
            this.ceiling = new THREE.Group();
            this.lights  = new THREE.Group();
            this.walls   = new THREE.Group();

            this._walls_north = new THREE.Group();
            this._walls_south = new THREE.Group();
            this._walls_east  = new THREE.Group();
            this._walls_west  = new THREE.Group();

            let t;
            for (t = 0; t < this.tiles.length; t++) {
                this.floor.add(this.tiles[t]._create_floor());
                this.ceiling.add(this.tiles[t]._create_ceiling());
                this.lights.add(this.tiles[t]._create_light());
                let walls = this.tiles[t]._create_walls();
                if (walls[0] != null) {
                    this._walls_west.add(walls[0]);
                }
                if (walls[1] != null) {
                    this._walls_east.add(walls[1]);
                }
                if (walls[2] != null) {
                    this._walls_south.add(walls[2]);
                }
                if (walls[3] != null) {
                    this._walls_north.add(walls[3]);
                }
            }
            this.walls.add(this._walls_north);
            this.walls.add(this._walls_east);
            this.walls.add(this._walls_south);
            this.walls.add(this._walls_west);

            this.group.add(this.floor);
            this.group.add(this.ceiling);
            this.group.add(this.walls);
            this.group.add(this.lights);
            this.group.lookAt(new THREE.Vector3(0, 1, 0));
            this.group.updateMatrix();

            this._set_walls_rotation(this._walls_north.children, 0);
            this._set_walls_rotation(this._walls_south.children, 1);
            this._set_walls_rotation(this._walls_west.children, 2);
            this._set_walls_rotation(this._walls_east.children, 3);
        },

        _set_walls_rotation: function(walls, direction) {
            let n;
            for (n = 0; n < walls.length; n++) {
                if (direction == 0) {
                    walls[n].rotation.x = -Math.PI / 2;
                    walls[n].position.y -= 512;
                } else if (direction == 1) {
                    walls[n].rotation.x = Math.PI / 2;
                    walls[n].position.y += 512;
                } else if (direction == 2) {
                    walls[n].rotation.y = Math.PI / 2;
                    walls[n].position.x -= 512;
                } else {
                    walls[n].rotation.y = -Math.PI / 2;
                    walls[n].position.x += 512;
                }
                walls[n].updateMatrix();
            }
        },

    }
);
