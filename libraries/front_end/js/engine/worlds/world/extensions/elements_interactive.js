'use strict';

Object.assign($_QE.prototype.World.prototype, {

    update_elements_interactive: function() {
        // Don't check for interactive objects if currently engaged with an input field as the camera doesn't move when typing.
        if (this.currently_looked_at_object != null && this.currently_looked_at_object.are_both_flags_on(EFLAG_TYPING, EFLAG_ENGAGED)) {
            return;
        }

        // Faster than '.length = 0'
        if (this._intersections.length != 0) {
            this._intersections = [];
        }

        this.raycaster.set(this.player.get_position(), this.player.get_normal());

        // Max search distance.
        this._nums[0]            = 99999;
        this._nums[1]            = -1;
        this._intersection_data  = null;
        this._intersection_match = null;

        // Find out what's currently being looked at if anything.
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {

            // TODO: There should be objects that are skippable.


            // The true parameter indicates recursive search.
            this.raycaster.intersectObject(this.elements_interactive[i].get_object(), true, this._intersections);

            // Only check the first result returned as they are already sorted by distance.
            if (this._intersections.length != 0) {
                if (this._intersections[0].distance < this._nums[0]) {

                    if (this._intersections[0].object.userData[USER_DATA_KEY_PARENT_OBJECT] != null) {
                        this._nums[0]           = this._intersections[0].distance;
                        this._nums[1]           = i;
                        this._intersection_data = this._intersections[0];

                        this._intersection_match = this._intersection_data.object.userData[USER_DATA_KEY_PARENT_OBJECT];
                    }
                }
            }
        }

        // TODO: User mesh.userData to point to parent object.

        if (this._nums[1] == NOT_FOUND) {
            if (this.currently_looked_at_object != null) {
                this.look_away_from_currently_looked_at_object();
            }
        } else {
            if (this.currently_looked_at_object == null) {
                this.set_new_currently_looked_at_object(this._intersection_match, this._intersection_data.point);
            } else if (this.currently_looked_at_object != this._intersection_match) {
                this.look_away_from_currently_looked_at_object();
                this.set_new_currently_looked_at_object(this._intersection_match, this._intersection_data.point);
            }
        }
    },

    remove_from_elements_interactive: function(element) {
        let i;
        for (i = 0; i < this.elements_interactive.length; i++) {
            if (this.elements_interactive[i] == element) {
                element.set_flag(EFLAG_IN_ELEMENTS_INTERACTIVE, false);
                this.elements_interactive.splice(i, 1);
                return;
            }
        }
    },

    add_element_interactive: function(element) {
        this.elements_interactive.push(element);
        element.set_flag(EFLAG_IN_ELEMENTS_INTERACTIVE, true);
        element.trigger_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE);
    },

    _add_element_to_interactive_if_needed: function(element) {
        if (!(element in this.elements_interactive)) {
            this.elements_interactive.push(element);
        }
        let e;
        for (e = 0; e < this.elements_interactive.length; e++) {
            if (this.elements_interactive[e] == element) {
                return;
            }
        }
        l('no match found for element');
        this.elements_interactive.push(element);
    },

    check_if_element_needs_interactive: function(element) {
        if (element.are_flags_on_and_off_respectively(EFLAG_INTERACTIVE, EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            this.add_element_interactive(element);
        } else if (element.get_flag(EFLAG_INTERACTIVE) && element.get_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            this._add_element_to_interactive_if_needed(element);
        }

        // Temporary location.
        if (element._get_all_attachments_recursively != null) {
            let children = element._get_all_attachments_recursively();
            let c;
            for (c = 0; c < children.length; c++) {
                if (children[c].are_flags_on_and_off_respectively != null) {
                    if (children[c].get_flag(EFLAG_INTERACTIVE) && children[c].get_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
                        this._add_element_to_interactive_if_needed(children[c]);
                    }
                }
            }
        }

        //l(element);
        //l(element.get_flag(EFLAG_INTERACTIVE));
        //l(element.get_flag(EFLAG_IN_ELEMENTS_INTERACTIVE));
    },
});
