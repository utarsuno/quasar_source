'use strict';

$_QE.prototype.TextureManager = function(engine) {
    $_QE.prototype.AssetManagerAbstraction.call(this, THREE.TextureLoader, engine);

    this.create_skybox_material = function() {
        this.sky_box_material = [];
        // The order of these matter.
        this.sky_box_material.push(this.get_texture(SKYBOX_FRONT));
        this.sky_box_material.push(this.get_texture(SKYBOX_BACK));
        this.sky_box_material.push(this.get_texture(SKYBOX_TOP));
        this.sky_box_material.push(this.get_texture(SKYBOX_BOTTOM));
        this.sky_box_material.push(this.get_texture(SKYBOX_RIGHT));
        this.sky_box_material.push(this.get_texture(SKYBOX_LEFT));

        let t;
        for (t = 0; t < this.sky_box_material.length; t++) {
            this.sky_box_material[t] = new THREE.MeshBasicMaterial({map: this.sky_box_material[t], side: THREE.BackSide, transparent: false});
        }
    };

    this.get_skybox_material = function() {
        return this.sky_box_material;
    };

};
