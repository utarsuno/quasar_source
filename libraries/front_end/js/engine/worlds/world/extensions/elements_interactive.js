'use strict';

Object.assign($_QE.prototype.World.prototype, {

    _initialize_cache_for_interactive: function() {
        this.elements_interactive = [];
        this._raycaster           = new THREE.Raycaster();
        this._intersections       = [];
    },

    _is_element_skippable: function(element) {
        if (element.flag_is_off(EFLAG_IS_VISIBLE)) {
            return true;
        } else if (element.flag_is_off(EFLAG_IS_CREATED)) {
            return true;
        }

        // Temporary debug.
        if (element.mesh != null && !element.mesh.visible) {
            QE.log_warning('Visibility check should be covered by flags!', element);
        } else if (element.mesh == null && element.group == null) {
            QE.log_warning('Is created check should be covered by flags!', element);
        }
        //

        return false;
    },

    update_elements_interactive: function() {
        // Don't check for interactive objects if currently engaged with an input field as the camera doesn't move when typing.
        if (this.currently_looked_at_object != null && this.currently_looked_at_object.flags_are_both_on(EFLAG_IS_TYPEABLE, EFLAG_IS_ENGAGED)) {
            return;
        }

        // Faster than '.length = 0'
        if (this._intersections.length != 0) {
            this._intersections = [];
        }

        // Position intersection checks from the player's current view point.
        this._raycaster.set(this.player.get_position(), this.player.get_normal());

        // Find out what's currently being looked at if anything.
        let i;
        let max_distance        = 99999;
        let intersection_data   = null;
        let intersected_element = null;
        for (i = 0; i < this.elements_interactive.length; i++) {

            if (this._is_element_skippable(this.elements_interactive[i])) {
                continue;
            }

            // The true parameter indicates recursive search.
            this._raycaster.intersectObject(this.elements_interactive[i].get_object(), true, this._intersections);

            // Only check the first result returned as they are already sorted by distance.
            if (this._intersections.length != 0 &&
                this._intersections[0].distance < max_distance &&
                this._intersections[0].object.userData[USER_DATA_KEY_PARENT_OBJECT] != null
            ) {
                max_distance        = this._intersections[0].distance;
                intersection_data   = this._intersections[0];
                intersected_element = intersection_data.object.userData[USER_DATA_KEY_PARENT_OBJECT];
            }
        }

        if (intersected_element == null) {
            if (this.currently_looked_at_object != null) {
                this.look_away_from_currently_looked_at_object();
            }
        } else {
            if (this.currently_looked_at_object == null) {
                this.set_new_currently_looked_at_object(intersected_element, intersection_data.point);
            } else if (this.currently_looked_at_object != intersected_element) {
                this.look_away_from_currently_looked_at_object();
                this.set_new_currently_looked_at_object(intersected_element, intersection_data.point);
            }
        }
    },

    remove_from_elements_interactive: function(element) {
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {
            if (this.elements_interactive[i] == element) {
                element.flag_set_off(EFLAG_IS_IN_ELEMENTS_INTERACTIVE);
                this.elements_interactive.splice(i, 1);
                return;
            }
        }
    },

    add_element_interactive: function(element) {
        element.set_user_data_if_needed();
        this.elements_interactive.push(element);
        element.flag_set_on(EFLAG_IS_IN_ELEMENTS_INTERACTIVE);
        element.trigger_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE);
    },

    _add_element_to_interactive_if_needed: function(element) {
        let e;
        for (e = 0; e < this.elements_interactive.length; e++) {
            if (this.elements_interactive[e] == element) {
                return;
            }
        }
        this.add_element_interactive(element);
    },

    _check_if_element_needs_interactive: function(element) {
        if (element.flags_are_on_and_off(EFLAG_IS_INTERACTIVE, EFLAG_IS_IN_ELEMENTS_INTERACTIVE)) {
            this.add_element_interactive(element);
        } else if (element.flags_are_both_on(EFLAG_IS_INTERACTIVE, EFLAG_IS_IN_ELEMENTS_INTERACTIVE)) {
            this._add_element_to_interactive_if_needed(element);
        }
    },

    check_if_element_needs_interactive: function(element) {
        this._check_if_element_needs_interactive(element);

        // Temporary location.
        if (element._get_all_attachments_recursively != null) {
            let children = element._get_all_attachments_recursively();
            let c;
            for (c = 0; c < children.length; c++) {
                this._check_if_element_needs_interactive(children[c]);
            }
        }
    },
});
