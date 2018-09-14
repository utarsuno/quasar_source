'use strict';

$_QE.prototype.WorldElementsRoot = function() {

    this.elements_root = [];

    this.update_elements_root = function(delta) {
        let e;
        for (e = 0; e < this.elements_root.length; e++) {
            this.elements_root[e].update(delta);
        }
    };

    /*
    this.remove_from_elements_root = function(element) {
        let i;
        for (i = 0; i < this.elements_root.length; i++) {
            if (this.elements_root[i] === element) {
                if (is_defined(element.is_singleton)) {
                    if (!element.is_singleton) {
                        element._in_world_elements_root = false;
                    }
                } else {
                    element._in_world_elements_root = false;
                }
                this.elements_root.splice(i, 1);
                return;
            }
        }
    };
    */

    this.add_element_root = function(element) {
        this.elements_root.push(element);
        element.in_world_list_elements_root = true;
        //this.elements_root.push(element);
        //element._in_world_elements_root = true;
    };
};
