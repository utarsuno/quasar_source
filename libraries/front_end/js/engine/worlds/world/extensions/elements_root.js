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
        QE.log_warning('WARNING: remove_from_elements_root did not find match for:', element);
    },

    add_element_root: function(element) {
        this.elements_root.push(element);
        element.set_flag(EFLAG_IS_ROOT         , true);
        element.set_flag(EFLAG_IN_ELEMENTS_ROOT, true);
        element.set_to_absolute_normal();
        element.set_to_absolute_position();
    },

    check_if_element_needs_root: function(element) {
        if (element.are_flags_on_and_off_respectively(EFLAG_IS_ROOT, EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            this.add_element_root(element);
        }
    },
});




