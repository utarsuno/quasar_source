'use strict';

$_QE.prototype.FeatureMesh = function(cacheable, type, on_mesh_created) {

    this.mesh_type         = type;
    this.is_mesh_cacheable = cacheable;
    this.on_mesh_created   = on_mesh_created;

    this._create_mesh_cached = function() {
        l('TODO:!');
    };

    this._create_mesh_new = function() {
        switch(this.mesh_type) {
        case FEATURE_MESH_TYPE_DEFAULT:
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            //this.object3D.add(this.mesh);
            break;
        }
    };

    this.create_mesh = function() {
        this.is_mesh_cacheable ? this._create_mesh_cached() : this._create_mesh_new();

        if (this.on_mesh_created != null) {
            this.on_mesh_created();
        }
    };

};