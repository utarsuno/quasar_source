$_QE.prototype.SkyBoxSpace = function(alias) {
    this.create_singleton();
    this.set_alias(alias);
};


Object.assign(
    $_QE.prototype.SkyBoxSpace.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function() {
            let materials = [
                QE.manager_assets.get_asset(ASSET_TEXTURE_SKYBOX_FRONT),
                QE.manager_assets.get_asset(ASSET_TEXTURE_SKYBOX_BACK),
                QE.manager_assets.get_asset(ASSET_TEXTURE_SKYBOX_TOP),
                QE.manager_assets.get_asset(ASSET_TEXTURE_SKYBOX_BOTTOM),
                QE.manager_assets.get_asset(ASSET_TEXTURE_SKYBOX_RIGHT),
                QE.manager_assets.get_asset(ASSET_TEXTURE_SKYBOX_LEFT),
            ];

            let m;
            for (m = 0; m < materials.length; m++) {
                materials[m] = new THREE.MeshBasicMaterial({
                    map : materials[m],
                    side: THREE.BackSide
                });
            }

            let s = 2048 * 16;
            this.geometry           = new THREE.CubeGeometry(s, s, s);
            this.mesh               = new THREE.Mesh(this.geometry, materials);
            //this.mesh.frustumCulled = false;
        },
    }
);
