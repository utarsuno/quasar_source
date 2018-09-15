'use strict';

$_QE.prototype.FloatingElement = function() {

    $_QE.prototype.Element.call(this);
    //$_QE.prototype.FeatureRecycle.call(this);

    this.in_world_list_elements_root = false;

    this.refresh = function() {
        if (this.group != null) {
            this.group.updateMatrix();
            //TEMP
            //this.mesh.updateMatrix();
        } else {
            this.mesh.updateMatrix();
        }
    };

    this.update = function() {
        if (
            (this.update_needed_for_position != null && this.update_needed_for_position) ||
            (this.update_needed_for_normal   != null && this.update_needed_for_normal)
        ) {
            l('UPDATING FLOATING ELEMENT!!!');
            this.refresh();

            this.update_needed_for_position = false;
            this.re_cache_normal();
        }
    };

    this.add_to_world = function(world, create=false, set_to_group=true, add_to_scene=false) {
        this.world = world;

        if (set_to_group) {
            this.set_to_root_element();
        }

        if (create) {
            this.create();
        }

        if (add_to_scene) {
            if (set_to_group) {
                world.add_to_scene(this.group);
            } else {
                world.add_to_scene(this.mesh);
            }
        }

        //world.add_to_scene(this.mesh);

        // TODO: Check that this doesn't add twice!!
        world.add_element_root(this);
        if (this.feature_interactive && !this.in_world_list_elements_interactive) {
            world.add_element_interactive(this);
        }
    };

    this.recycle = function(remove_from_scene, remove_from_root, remove_from_interactive) {
        if (remove_from_scene) {
            //this.world.remove_from_scene(this.mesh);
            //this.world.remove_from_scene(this.group);
            if (this.group != null) {
                this.group.remove(this.mesh);
            } else {
                this.world.remove_from_scene(this.mesh);
            }
        }
        if (remove_from_root) {
            if (this.in_world_list_elements_root) {
                this.world.remove_from_elements_root(this);
            }
        }
        if (remove_from_interactive) {
            if (this.in_world_list_elements_interactive) {
                this.remove_from_elements_interactive(this);
            }
        }
    };

};
