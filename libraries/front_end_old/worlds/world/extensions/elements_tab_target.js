Object.assign($_QE.prototype.World.prototype, {

    __init__world_feature_tab_target: function() {
        this.previous_tab_target = null;
    },

    tab_to_next_interactive_object: function() {
        if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_ROW_ELEMENT)) {
            let target = this.currently_looked_at_object._parent_row.get_next_tab_target_from_element(this.currently_looked_at_object);
            if (target != null) {
                this.previous_tab_target = target;
                this.look_at_different_element(target);
            } else {
                l('TARGET RECEIVED IS NULL!');
            }
        }
    },

    tab_to_previous_tab_target: function() {
        if (this.previous_tab_target != null) {
            this.look_at_different_element(this.previous_tab_target);
        } else {
            l('Previous tab target is null!');
        }
    },

});

