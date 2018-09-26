'use strict';

$_QE.prototype.FeatureRelativePosition = function() {

    this.update_needed_for_position = false;

    this.set_offset_vertical_percentage = function(parent_percentage, self_percentage=0) {
        this.mesh.position.y             = this.parent.height * (parent_percentage - 0.5) + this.height * self_percentage;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    this.set_offset_horizontal_percentage = function(parent_percentage, self_percentage) {
        this.mesh.position.x             = this.parent.width * (parent_percentage - 0.5) + this.width * self_percentage;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    this.set_offset_horizontal = function(distance) {
        this.mesh.position.x             = distance;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    this.set_offset_depth = function(distance) {
        this.mesh.position.z += distance;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

};
