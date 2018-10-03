'use strict';

$_QE.prototype.FeatureRecycle = function() {

    this.remove_from_world_elements_root = function() {
        if (this.get_flag(EFLAG_IN_ELEMENTS_ROOT)) {
            this.world.remove_from_elements_root(this);
        }
    };

    this.remove_from_world_elements_interactive = function() {
        if (this.get_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            this.world.remove_from_elements_interactive(this);
        }
    };

    this.recycle_material = function() {
        if (!this.get_flag(EFLAG_CACHEABLE_MATERIAL)) {
            if (this.material != null) {
                if (this.material.map != null) {
                    this.material.map.dispose();
                    this.material.map = undefined;
                }
                this.material.dispose();
            }
        }
        this.material = undefined;
    };

    this.recycle_mesh = function() {
        if (!this.get_flag(EFLAG_CACHEABLE_MESH)) {
            if (this.mesh != null) {
                // TODO: Refactor this
                this.object3D.remove(this.mesh);
            }
        }
        this.mesh = undefined;
    };

    this.recycle_geometry = function() {
        if (!this.get_flag(EFLAG_CACHEABLE_GEOMETERY)) {
            if (this.geometry != null) {
                this.geometry.dispose();
            }
        }
        this.geometry = undefined;
    };

    this.full_remove = function() {
        this.remove_from_world_elements_root();
        this.remove_from_world_elements_interactive();
        this.recycle_material();
        this.recycle_geometry();
        this.recycle_mesh();
    };

    this.full_remove_self_and_all_children_recursively = function() {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].full_remove_self_and_all_children_recursively();
        }
        this.full_remove();
    };
};