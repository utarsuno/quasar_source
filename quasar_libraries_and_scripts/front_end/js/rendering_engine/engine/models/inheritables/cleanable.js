'use strict';

$_QE.prototype.Cleanable = function() {


    // TODO : Refactor the design of this (resource cleanup needs to be cleaned up in general).
    this.remove_from_root_attachmentables_if_needed = function(object_to_check) {
        let index_to_remove = -1;
        let i;
        for (i = 0; i < this.world.root_attachables.length; i++) {
            if (this.world.root_attachables[i] === object_to_check) {
                index_to_remove = i;
                break;
            }
        }
        if (index_to_remove !== NOT_FOUND) {
            this.world.root_attachables.splice(index_to_remove, 1);
        }
    };

    this.fully_remove_self_and_all_sub_attachments = function() {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].fully_remove_self_and_all_sub_attachments();
        }

        this.remove_from_root_attachmentables_if_needed(this);
        this.world.remove_from_interactive_then_scene(this);
        this.full_remove();
    };

    this.delete_mesh = function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
        this.mesh = undefined;
    };

    this.delete_material = function() {
        if (is_defined(this.material)) {
            if (is_defined(this.material.map)) {
                this.material.map.dispose();
                this.material.map = undefined;
            }
            this.material.dispose();
            this.material = undefined;
        }
    };

    this.full_remove = function() {
        this.delete_mesh();
        this.delete_material();

        // TODO : !!!!!
        /*
        // Specific to FloatingText2D.
        if (is_defined(this.dynamic_texture)) {
            // TODO : Eventually double check this.
            if (is_defined(this.dynamic_texture.dispose)) {
                this.dynamic_texture.dispose();
            }
            if (is_defined(this.dynamic_texture.texture)) {
                if (is_defined(this.dynamic_texture.texture.dispose)) {
                    this.dynamic_texture.texture.dispose();
                }
            }
        }
        */
    };


};