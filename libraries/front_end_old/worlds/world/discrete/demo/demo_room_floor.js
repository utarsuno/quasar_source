Object.assign(
    $_QE.prototype.DemoRoom.prototype,
    // DemoRoom --> floor features
    {
        _initialize_cache_floor: function() {
            this._cache_material_floor = new THREE.MeshPhongMaterial({
                normalMap      : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_NORMAL),
                map            : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_COLOR),
                displacementMap: QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_GLOSS),
                specularMap    : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_SPEC),

                side           : THREE.FrontSide,
                shininess      : 45,
                specular       : QE.COLOR_BLUE_LIGHT,

                lights         : true,
                //reflectivity : 0.6,
            });

            this._cache_mesh_floor = new THREE.Mesh(this._cache_geometry_tile, this._cache_material_floor);

            this._floor_mesh       = null;
            this._floor_geometry   = new THREE.Geometry();
            this._floor_materails  = [];
        },

        _finalize_cache_floor: function() {
            this._floor_mesh = new THREE.Mesh(this._floor_geometry, this._floor_materails);
            this._floor_mesh.lookAt(0, 1, 0);
            this._floor_mesh.updateMatrix();
            this.group.add(this._floor_mesh);
        },

        _cache_add_floor: function(x, y) {
            let mesh = this._cache_mesh_floor.clone();

            let m = new THREE.Matrix4();
            m.makeTranslation(x * this.tile_size, -y * this.tile_size, 0);

            this._floor_geometry.merge(mesh.geometry, m, this._floor_materails.length);
            this._floor_materails.push(mesh.material);
        },

    }
);
