'use strict';

Object.assign($_QE.prototype.World.prototype, {

    __init__world_feature_elements_css: function() {
        this.elements_css = [];
    },

    has_css_element: function(css_element) {
        let e;
        let num_elements_css = this.elements_css.length;
        for (e = 0; e < num_elements_css; e++) {
            if (this.elements_css[e].matches_css_object(css_element)) {
                return true;
            }
        }
        return false;
    },

    css_on_pause_state: function() {
        let e;
        let num_elements_css = this.elements_css.length;
        for (e = 0; e < num_elements_css; e++) {
            this.elements_css[e].on_pause_state();
        }
    },

    css_on_running_state: function() {
        let e;
        let num_elements_css = this.elements_css.length;
        for (e = 0; e < num_elements_css; e++) {
            this.elements_css[e].on_resume_state();
        }
    },

    remove_from_elements_css: function(element) {
        let i;
        let num_elements_css = this.elements_css.length;
        for (i = 0; i < num_elements_css; i++) {
            if (this.elements_css[i] === element) {
                this.elements_css[i].flag_set_off(EFLAG_IS_IN_ELEMENTS_ROOT);
                this.elements_css.splice(i, 1);
                return;
            }
        }
        QE.warning('WARNING: remove_from_elements_css did not find match for:', element);
    },

    _add_element_to_css_if_needed: function(element) {
        let e;
        let num_elements_css = this.elements_css.length;
        for (e = 0; e < num_elements_css; e++) {
            if (this.elements_css[e] === element) {
                return;
            }
        }
        this.elements_css.push(element);
    },

    add_element_css: function(element) {
        this.elements_css.push(element);
        element.flag_set_on(EFLAG_IS_ROOT);
        element.flag_set_on(EFLAG_IS_IN_ELEMENTS_ROOT);
        element.set_to_absolute_normal();
        element.set_to_absolute_position();
    },

    check_if_element_needs_css: function(element) {
        if (element.flags_are_on_and_off(EFLAG_IS_CSS, EFLAG_IS_IN_ELEMENTS_CSS)) {
            this.add_element_css(element);
        } else if (element.flags_are_on(EFLAG_IS_CSS, EFLAG_IS_IN_ELEMENTS_CSS)) {
            this._add_element_to_css_if_needed(element);
        }
    },
});




