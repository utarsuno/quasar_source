'use strict';

$_QE.prototype.FeatureRecycle = function() {

    this.remove_from_world_elements_root = function() {
        if (is_defined(this._in_world_elements_root)) {
            this.world.remove_from_elements_root(this);
        }
    };

    this.remove_from_world_elements_interactive = function() {
        if (is_defined(this._in_world_elements_interactive)) {
            this.world.remove_from_elements_interactive(this);
        }
    };

    this.recycle_material = function() {
        if (is_defined(this.material)) {
            if (is_defined(this.material.map)) {
                this.material.map.dispose();
                this.material.map = undefined;
            }
            this.material.dispose();
            this.material = undefined;
        }
    };

    this.recycle_mesh = function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        this.mesh = undefined;
    };

    this.recycle_geometry = function() {
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
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