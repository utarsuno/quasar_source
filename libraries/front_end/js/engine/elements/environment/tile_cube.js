'use strict';

$_QE.prototype.TileCube = function(alias) {
    this.create_singleton();
    this.set_alias(alias);
};


Object.assign(
    $_QE.prototype.TileCube.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function() {
            //let s = 1024 * 2 * 2 * 2;
            let s = 1024 * 2;
            this.geometry = new THREE.BoxGeometry(s, s, s);

            this.material = new THREE.MeshStandardMaterial({
                displacementMap: QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_DISPLACMENT),
                map            : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_COLOR),
                normalMap      : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_NORMAL),
                aoMap          : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_OCCULANT),

                specularMap    : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_SPEC), // specular

                //color          : 0x939393,
                color          : 0xb2dde6,
                side           : THREE.BackSide
            });
            let a = '#939393';
            let b = '#b2dde6';
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            //this.mesh.lookAt(0, 1, 0);
            //this.mesh.updateMatrix();
        }
    }
);

