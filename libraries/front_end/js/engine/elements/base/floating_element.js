'use strict';

$_QE.prototype.FloatingElement = function(is_base) {

    $_QE.prototype.Element.call(this, is_base);
    //$_QE.prototype.FeatureRecycle.call(this);

    if (is_base) {
        $_QE.prototype.FeaturePosition.call(this);
        $_QE.prototype.FeatureNormal.call(this);
    } else {
        $_QE.prototype.FeatureRelativePosition.call(this);
        $_QE.prototype.FeatureRelativeNormal.call(this);
    }
    $_QE.prototype.FeatureAttachment.call(this);

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

    this.update_element = function() {

        if (this.update_needed_for_position || this.update_needed_for_normal) {
            this.refresh();

            this.update_needed_for_position = false;
            if (this.is_base) {
                this.re_cache_normal();
            }
        }

        if (this.update != null) {
            this.update();
        }

        if (this.a_child_needs_update) {
            let c;
            for (c = 0; c < this.attachments.length; c++) {
                this.attachments[c].update_element();
            }
            this.a_child_needs_update = false;
        }
    };

    this.add_to_world = function(world, create=false, set_to_group=true, add_to_scene=false, refresh=false) {
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

        if (refresh) {
            this.refresh();
            this.re_cache_normal();
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
