'use strict';

$_QE.prototype.FeatureMesh = function(cacheable, type, on_mesh_created) {

    this.mesh_type = type;
    this.set_flag(EFLAG_CACHEABLE_MESH, cacheable);
    if (on_mesh_created != null) {
        this.set_event(ELEMENT_EVENT_ON_MESH_CREATED, on_mesh_created);
    }

    this.recycle_mesh = function() {
        if (this.group != null) {
            this.group.remove(this.mesh);
        }

        if (!this.get_flag(EFLAG_CACHEABLE_MESH)) {
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

    this.set_user_data = function() {
        if (this.get_flag(EFLAG_INTERACTIVE)) {
            this.mesh.userData[USER_DATA_KEY_PARENT_OBJECT] = this;
        }
    };

    this.create_mesh = function() {
        this.get_flag(EFLAG_CACHEABLE_MESH) ? this._create_mesh_cached() : this._create_mesh_new();

        this.set_user_data();

        if (this.group != null) {
            this.group.add(this.mesh);
        }

        this.trigger_event(ELEMENT_EVENT_ON_MESH_CREATED);
    };

};