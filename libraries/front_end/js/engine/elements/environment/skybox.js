'use strict';

$_QE.prototype.SkyBox = function() {
    this.initialize_element_data();

    this.geometry           = new THREE.PlaneGeometry(2, 2, 1);

    this.shader             = QE.manager_assets.get_asset(ASSET_SHADER_MATERIAL_BACKGROUND);
    this.material           = this.shader.get_shader_material();

    this.mesh               = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
};


Object.assign(
    $_QE.prototype.SkyBox.prototype,
    $_QE.prototype.Element.prototype
);
