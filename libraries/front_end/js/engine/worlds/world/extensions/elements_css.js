'use strict';

Object.assign($_QE.prototype.World.prototype, {

    __init__world_feature_elements_css: function() {
        this.elements_css = [];
    },

    remove_from_elements_css: function(element) {
        let i;
        for (i = 0; i < this.elements_css.length; i++) {
            if (this.elements_css[i] == element) {
                this.elements_css[i].flag_set_off(EFLAG_IS_IN_ELEMENTS_ROOT);
                this.elements_css.splice(i, 1);
                return;
            }
        }
        QE.log_warning('WARNING: remove_from_elements_css did not find match for:', element);
    },

    _add_element_to_css_if_needed: function(element) {
        let e;
        for (e = 0; e < this.elements_css.length; e++) {
            if (this.elements_css[e] == element) {
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
        } else if (element.flags_are_both_on(EFLAG_IS_CSS, EFLAG_IS_IN_ELEMENTS_CSS)) {
            this._add_element_to_css_if_needed(element);
        }
    },
});




