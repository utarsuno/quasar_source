'use strict';

Object.assign($_QE.prototype.World.prototype, {
    elements_root: [],

    update_elements_root: function(delta) {
        let e;
        for (e = 0; e < this.elements_root.length; e++) {
            //this.elements_root[e].update(delta);
            this.elements_root[e].update_element();
        }
    },

    remove_from_elements_root: function(element) {
        let i;
        for (i = 0; i < this.elements_root.length; i++) {
            if (this.elements_root[i] == element) {
                this.elements_root[i].set_flag(EFLAG_IN_ELEMENTS_ROOT, false);
                this.elements_root.splice(i, 1);
                return;
            }
        }
    },

    add_element_root: function(element) {
        this.elements_root.push(element);
        element.set_flag(EFLAG_IN_ELEMENTS_ROOT, true);
    },
});

