'use strict';

Object.assign($_QE.prototype.World.prototype, {

    update_elements_root: function(delta) {
        let e;
        for (e = 0; e < this.elements_root.length; e++) {
            //this.elements_root[e].update(delta);
            this.elements_root[e].update_element(delta);
        }
    },

    remove_from_elements_root: function(element) {
        let i;
        for (i = 0; i < this.elements_root.length; i++) {
            if (this.elements_root[i] == element) {
                this.elements_root[i].flag_set_off(EFLAG_IS_IN_ELEMENTS_ROOT);
                this.elements_root.splice(i, 1);
                return;
            }
        }
        QE.log_warning('WARNING: remove_from_elements_root did not find match for:', element);
    },

    _add_element_to_root_if_needed: function(element) {
        let e;
        for (e = 0; e < this.elements_root.length; e++) {
            if (this.elements_root[e] == element) {
                return;
            }
        }
        this.elements_root.push(element);

        //if (!(element in this.elements_root)) {
        //    this.elements_root.push(element);
        //}
    },

    add_element_root: function(element) {
        this.elements_root.push(element);
        element.flag_set_on(EFLAG_IS_ROOT);
        element.flag_set_on(EFLAG_IS_IN_ELEMENTS_ROOT);
        element.set_to_absolute_normal();
        element.set_to_absolute_position();
    },

    check_if_element_needs_root: function(element) {
        if (element.flags_are_on_and_off(EFLAG_IS_ROOT, EFLAG_IS_IN_ELEMENTS_ROOT)) {
            this.add_element_root(element);
        } else if (element.flags_are_both_on(EFLAG_IS_ROOT, EFLAG_IS_IN_ELEMENTS_ROOT)) {
            this._add_element_to_root_if_needed(element);
        }
    },
});




