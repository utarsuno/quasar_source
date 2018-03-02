'use strict';

function WorldObjectSavingAndLoading() {

    this.prepare_for_save = function() {
        // TODO : Eventually default should be false.
        var save_needed = true;

        // For dynamic worlds.
        if (this.hasOwnProperty('world_name_changed')) {
            if (this.world_name_changed) {
                this.entity.set_property(ENTITY_PROPERTY_NAME, this.world_name);
                save_needed = true;
            }
        }

        for (var r = 0; r < this.root_attachables.length; r++) {
            this.root_attachables[r].update_values_for_entity();
        }
    };


    // TODO : ADD DYNAMIC LOADING!!!
    // TODO : ADD DYNAMIC LOADING!!!
    // TODO : ADD DYNAMIC LOADING!!!

}


