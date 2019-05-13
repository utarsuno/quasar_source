$_QE.prototype.LightPoint = function(color, intensity, distance, decay, x, y, z, alias) {
    this.create_singleton(color, intensity, distance, decay, x, y, z);
    this.set_alias(alias);
};

Object.assign(
    $_QE.prototype.LightPoint.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function(color, intensity, distance, decay, x, y, z) {
            this.group = new THREE.PointLight(color, intensity, distance, decay);
            this.group.position.set(x, y, z);
            this.group.updateMatrix();
        },
    }
);
