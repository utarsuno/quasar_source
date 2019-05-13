$_QE.prototype.SkyBox = function(alias) {
    this.create_singleton();
    this.set_alias(alias);
};


Object.assign(
    $_QE.prototype.SkyBox.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function() {
            this.geometry           = new THREE.PlaneGeometry(2, 2, 1);

            this.shader             = QE.manager_assets.get_asset(ASSET_SHADER_MATERIAL_BACKGROUND);
            this.material           = this.shader.get_shader_material();

            this.mesh               = new THREE.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
        },
    }
);
