Object.assign(
    $_QE.prototype.DemoRoom.prototype,
    // DemoRoom --> ceiling features
    {

        _initialize_cache_ceiling: function() {
            this._cache_material_ceiling = new THREE.MeshPhongMaterial({
                color        : QE.COLOR_WHITE,
                side         : THREE.FrontSide,
                reflectivity : 0.55,
                lights       : true,
                // Test
                flatShading  : true,
            });
            this._cache_mesh_ceiling = new THREE.Mesh(this._cache_geometry_tile, this._cache_material_ceiling);

            this._ceiling_mesh       = null;
            this._ceiling_geometry   = new THREE.Geometry();
            this._ceiling_materails  = [];
        },

        _finalize_cache_ceiling: function() {
            this._ceiling_mesh = new THREE.Mesh(this._ceiling_geometry, this._ceiling_materails);
            this._ceiling_mesh.lookAt(0, -1, 0);
            this._ceiling_mesh.position.y += this.tile_size;
            this._ceiling_mesh.updateMatrix();

            this._ceiling_geometry.computeVertexNormals();

            this.group.add(this._ceiling_mesh);
        },

        _cache_add_ceiling: function(x, y) {
            let mesh = this._cache_mesh_ceiling.clone();

            let m = new THREE.Matrix4();
            m.makeTranslation(x * this.tile_size, y * this.tile_size, 0);

            this._ceiling_geometry.merge(mesh.geometry, m, this._ceiling_materails.length);
            this._ceiling_materails.push(mesh.material);
        },

    }
);
