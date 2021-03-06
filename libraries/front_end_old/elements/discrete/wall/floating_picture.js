$_QE.prototype.FloatingPicture = function(image) {
    this.__init__floating_picture(image);
};

Object.assign(
    $_QE.prototype.FloatingPicture.prototype,
    $_QE.prototype.WallFloating.prototype,
    {
        __init__floating_picture: function(image) {
            this.__init__floating_rows();

            this.set_dimensions(image.width, image.height);
            this.texture             = new THREE.Texture(image);
            this.texture.anisotropy  = QE.renderer.capabilities.getMaxAnisotropy();
            this.texture.needsUpdate = true;
            this.material            = new THREE.MeshBasicMaterial({map : this.texture});

            $_QE.prototype.FeatureOnlyMoveable.call(this);
        },

        create: function() {
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);
            this.mesh     = new THREE.Mesh(this.geometry, this.material);

            this.add_title_bar(null, ASSET_ICON_PICTURE, true, true, true);
        },

    }
);


