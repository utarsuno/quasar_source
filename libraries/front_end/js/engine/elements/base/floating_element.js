'use strict';

$_QE.prototype.FloatingElement = function() {

    $_QE.prototype.Element.call(this);

    this.in_world_list_elements_root = false;

    this.refresh = function() {
        this.mesh.updateMatrix();
    };

    this.update = function() {
        if (
            (this.update_needed_for_position != null && this.update_needed_for_position) ||
            (this.update_needed_for_normal   != null && this.update_needed_for_normal)
        ) {
            //l('UPDATING FLOATING ELEMENT!!!');
            this.refresh();

            this.update_needed_for_position = false;
            this.re_cache_normal();
        }
    };

    this.create_floating_element = function(world) {

    };

    this.add_to_world = function(world) {
        world.add_to_scene(this.mesh);
        world.add_element_root(this);
    };

    /*
    this.set_position = function(x, y, z) {
        if (this.root_element) {
            this.group.position.set(x, y, z);
        } else {
            this.element.position.set(x, y, z);
            this.element.updateMatrix();
        }
    };
    */

};
