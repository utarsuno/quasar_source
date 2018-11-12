'use strict';

$_QE.prototype.TileCube = function() {
    this.initialize_element_data();

    //this.geometry = new THREE.PlaneGeometry(1024, 1024);

    //let s = 1024 * 2;
    let s = 1024 * 2 * 2 * 2;
    this.geometry = new THREE.BoxGeometry(s, s, s);
    //this.geometry = new THREE.SphereGeometry(1024, 32, 32);

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

};


Object.assign(
    $_QE.prototype.TileCube.prototype,
    $_QE.prototype.Element.prototype
);

