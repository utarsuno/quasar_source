'use strict';

$_QE.prototype.FloatingPicture = function(image) {
    this.__init__floating_picture(image);
};

Object.assign(
    $_QE.prototype.FloatingPicture.prototype,
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.FloatingElement.prototype,
    {
        __init__floating_picture: function(image) {
            this.__init__floating_rows();

            this.set_dimensions(image.width, image.height);
            this.texture = new THREE.Texture(image);
            this.texture.anisotropy  = QE.renderer.capabilities.getMaxAnisotropy();
            this.texture.needsUpdate = true;
            this.material = new THREE.MeshBasicMaterial({map : this.texture});

            $_QE.prototype.FeatureInteractive.call(this);
            this.flag_set_off(EFLAG_IS_ENGABLE);
            this.flag_set_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING);
            this.flag_set_on(EFLAG_IS_MOUSE_MOVABLE);
            this.flag_set_on(EFLAG_IS_MOUSE_SCALABLE);
        },

        create: function() {
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);
            this.mesh     = new THREE.Mesh(this.geometry, this.material);

            this.add_title_bar(null, ASSET_ICON_PICTURE, true, true, true);
        },

    }
);


