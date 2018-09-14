'use strict';

$_QE.prototype.FeatureMesh = function(cacheable, type, on_mesh_created) {

    this.mesh_type         = type;
    this.is_mesh_cacheable = cacheable;
    this.on_mesh_created   = on_mesh_created;

    this.recycle_mesh = function() {
        if (this.group != null) {
            this.group.remove(this.mesh);
        }

        if (!this.is_mesh_cacheable) {
            if (this.mesh != null) {
                this.mesh.userData = undefined;
                this.mesh          = undefined;
            }
        }
        // FROM previous version:
        // this.object3D.remove(this.mesh);
    };

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

        if (this.feature_interactive) {
            this.mesh.userData[USER_DATA_KEY_PARENT_OBJECT] = this;
        }

        l('creating mesh!');
        if (this.group != null) {
            l('adding mesh to group!');
            this.group.add(this.mesh);
        }

        if (this.on_mesh_created != null) {
            this.on_mesh_created();
        }
    };

};