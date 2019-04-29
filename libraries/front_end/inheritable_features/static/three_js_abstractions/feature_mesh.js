'use strict';

$_QE.prototype.FeatureMesh = function() {};

Object.assign($_QE.prototype.FeatureMesh.prototype, {

    set_mesh_type: function(use_cache, type, on_mesh_created) {
        this.flag_set(EFLAG_IS_CACHEABLE_MESH, use_cache);
        this.mesh_type = type;
        if (on_mesh_created != null) {
            this.set_event(ELEMENT_EVENT_ON_MESH_CREATED, on_mesh_created);
        }
    },

    recycle_mesh: function() {
        if (this.group != null) {
            this.group.remove(this.mesh);
        }

        if (this.flag_is_off(EFLAG_IS_CACHEABLE_MESH)) {
            if (this.mesh != null) {
                this.mesh.userData = undefined;
                this.mesh          = undefined;
            }
        } else {
            l('WARNING: recycle_mesh called on cacheable mesh.');
            l(this);
        }
    },

    _create_mesh_cached: function() {
        l('TODO:!');
    },

    _create_mesh_new: function() {
        switch(this.mesh_type) {
        case FEATURE_MESH_TYPE_DEFAULT:
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            break;
        }
    },

    create_mesh: function() {
        this.flag_is_on(EFLAG_IS_CACHEABLE_MESH) ? this._create_mesh_cached() : this._create_mesh_new();

        this.set_user_data_if_needed();

        if (this.group != null) {
            this.group.add(this.mesh);
        }

        this.trigger_event(ELEMENT_EVENT_ON_MESH_CREATED);
    },

    set_user_data_if_needed: function() {
        if (this.flag_is_on(EFLAG_IS_INTERACTIVE) && this.mesh != null && this.mesh.userData[USER_DATA_KEY_PARENT_OBJECT] == null) {
            this.mesh.userData[USER_DATA_KEY_PARENT_OBJECT] = this;
        }
    },

    _set_user_data_looked_at: function(looked_at) {
        if (this.mesh != null) {
            this.mesh.userData[IS_CURRENTLY_LOOKED_AT] = looked_at;
        }
    },
});
