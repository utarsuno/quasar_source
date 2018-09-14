'use strict';

$_QE.prototype.FeatureRecycle = function() {

    this.recycle = function() {

    };

    /*
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
    */
};