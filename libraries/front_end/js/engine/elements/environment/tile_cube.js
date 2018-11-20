'use strict';

$_QE.prototype.TileCube = function() {
    this.create_singleton();
    this.set_alias(SINGLETON_BACKGROUND);
};


Object.assign(
    $_QE.prototype.TileCube.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function() {
            //let s = 1024 * 2 * 2 * 2;
            let s = 1024 * 2 * 2;
            this.geometry = new THREE.BoxGeometry(s, s, s);

            this.material = new THREE.MeshStandardMaterial({
                displacementMap: QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_DISPLACMENT),
                map            : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_COLOR),
                normalMap      : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_NORMAL),
                aoMap          : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_OCCULANT),

                //envMap         : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_ROUGH),
                specularMap    : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_ROUGH), // specular

                color          : 0x939393,
                side           : THREE.BackSide
            });
            let a = '#939393';
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            //this.mesh.lookAt(0, 1, 0);
            //this.mesh.updateMatrix();
        }
    }
);

