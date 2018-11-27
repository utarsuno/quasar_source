'use strict';

Object.assign(
    $_QE.prototype.DemoRoom.prototype,
    // DemoRoom --> walls features
    {
        _initialize_cache_walls: function() {
            //let refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
            //this.group.add(refractSphereCamera);
            //refractSphereCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();
            //refractSphereCamera.renderTarget.texture.mapping = new THREE.CubeRefractionMapping();
            this._cache_material_wall = new THREE.MeshPhongMaterial({
                color          : 0xacc2ff,
                //envMap         : refractSphereCamera.renderTarget,
                //refractionRatio: 0.985,
                //reflectivity   : 0.9,
                side           : THREE.FrontSide,
                transparent    : true,
                //opacity        : .75,
                opacity        : .65,
                lights         : true

            });

            //let a = '#acc2ff';

            /*
            mesh.castShadow    = true;
            mesh.receiveShadow = true;
            //refractSphereCamera.position = mesh.position;
             */

            this._cache_mesh_wall = new THREE.Mesh(this._cache_geometry_tile, this._cache_material_wall);
            //
            //mesh.position.y += this.get_size() / 2;
            //this._cache_mesh_wall.position.y += this.tile_size;
            //this._cache_mesh_wall.updateMatrix();
            //

            this._walls_mesh       = null;
            this._walls_geometry   = new THREE.Geometry();
            this._walls_materails  = [];
        },

        _finalize_cache_walls: function() {
            this._walls_mesh = new THREE.Mesh(this._walls_geometry, this._walls_materails);
            //this._walls_mesh.lookAt(0, 1, 0);
            this._walls_mesh.updateMatrix();
            this.group.add(this._walls_mesh);
        },

        _add_wall: function(x, y, direction) {
            let mesh = this._cache_mesh_wall.clone();
            let m    = null;
            if (direction == 'left') {
                mesh.lookAt(1, 0, 0);
                mesh.position.set(x * this.tile_size - this.tile_size / 2, this.tile_size / 2, y * this.tile_size);
                mesh.updateMatrix();
                mesh.updateMatrixWorld();
                m = mesh.matrix;
            } else if (direction == 'right') {
                mesh.lookAt(-1, 0, 0);
                mesh.position.set(x * this.tile_size + this.tile_size / 2, this.tile_size / 2, y * this.tile_size);
                mesh.updateMatrix();
                mesh.updateMatrixWorld();
                m = mesh.matrix;
            } else if (direction == 'forward') {
                mesh.lookAt(0, 0, -1);
                mesh.position.set(x * this.tile_size, this.tile_size / 2, y * this.tile_size + this.tile_size / 2);
                mesh.updateMatrix();
                mesh.updateMatrixWorld();
                m = mesh.matrix;
            } else if (direction == 'backward') {
                mesh.lookAt(0, 0, 1);
                mesh.position.set(x * this.tile_size, this.tile_size / 2, y * this.tile_size - this.tile_size / 2);
                mesh.updateMatrix();
                mesh.updateMatrixWorld();
                m = mesh.matrix;
            }
            this._walls_geometry.merge(mesh.geometry, m, this._walls_materails.length);
            this._walls_materails.push(mesh.material);
        },

        _cache_add_walls: function(tile) {
            if (!tile.has_left) {
                this._add_wall(tile.x, tile.y, 'left');
            }
            if (!tile.has_right) {
                this._add_wall(tile.x, tile.y, 'right');
            }
            if (!tile.has_up) {
                this._add_wall(tile.x, tile.y, 'forward');
            }
            if (!tile.has_down) {
                this._add_wall(tile.x, tile.y, 'backward');
            }
        },

    }
);
