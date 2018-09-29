'use strict';

$_QE.prototype.FeatureButton = function(engage_function) {

    $_QE.prototype.FeatureInteractive.call(this, true, null, null, engage_function, null);
    $_QE.prototype.FeatureClickable.call(this, false);

    if (this.mesh != null) {
        if (this.feature_interactive && !this.in_world_list_elements_interactive) {
            if (this.is_root_attachment()) {
                this.world.add_element_interactive(this);
            } else {
                this.parent.world.add_element_interactive(this);
            }
            this.set_user_data();
        }
    }
};
