'use strict';

$_QE.prototype.DemoRoom = function(tiles, home_tile, world, alias) {
    this._initialize_cache(2048);

    this.tiles     = [];
    this.home_tile = null;
    this.world     = world;
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

        _initialize_cache: function(tile_size) {
            this.tile_size            = tile_size;

            this._cache_geometry_tile = new THREE.PlaneGeometry(this.tile_size, this.tile_size);
            this._cache_geometry_tile.computeFaceNormals();
            this._cache_geometry_tile.computeVertexNormals();

            this._room_geometry  = new THREE.Geometry();
            this._room_materials = [];
            this._room_mesh      = null;

            this._initialize_cache_ceiling();
            this._initialize_cache_floor();
            this._initialize_cache_walls();
            this._initialize_cache_light();
        },

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
                this.group.add(this.tiles[t].group);
            }
            this.group.updateMatrix();
            this.group.updateMatrixWorld(true);

            for (t = 0; t < this.tiles.length; t++) {
                this._cache_add_ceiling(this.tiles[t].x, this.tiles[t].y);
                this._cache_add_floor(this.tiles[t].x, this.tiles[t].y);
                this._cache_add_walls(this.tiles[t]);
                this._cache_add_lights(this.tiles[t].x, this.tiles[t].y);
            }

            this._finalize_cache_ceiling();
            this._finalize_cache_floor();
            this._finalize_cache_walls();
            this._finalize_cache_lights();

            this._room_geometry.merge(this._floor_geometry, this._floor_mesh.matrix, 0);
            this._room_geometry.merge(this._ceiling_geometry, this._ceiling_mesh.matrix, 1);
            this._room_geometry.merge(this._walls_geometry, this._walls_mesh.matrix, 2);
            /*
            let m;
            for (m = 0; m < this._floor_materails.length; m++) {
                this._room_materials.push(m);
            }
            for (m = 0; m < this._ceiling_materails.length; m++) {
                this._ceiling_materails.push(m);
            }
            for (m = 0; m < this._walls_materails.length; m++) {
                this._walls_materails.push(m);
            }
            this._room_mesh = new THREE.Mesh(this._room_geometry, this._room_materials);
            */
            this._room_mesh = new THREE.Mesh(this._room_geometry, [this._floor_materails, this._ceiling_materails, this._walls_materails]);
            this.group.add(this._room_mesh);
        },

    }
);
