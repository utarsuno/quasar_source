'use strict';

$_QE.prototype.FeatureRelativePosition = function() {

    this.update_needed_for_position = false;

    this.set_offset_vertical_percentage = function(percentage, centered=false) {
        this.mesh.position.y = this.mesh.position.y + this.parent.height * (percentage - 0.5);
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    // TODO: Refactor
    this.set_offset_vertical_value = function(distance) {
        this.mesh.position.y             = this.mesh.position.y + distance;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    this.set_offset_horizontal_percentage = function(percentage, centered=false) {

    };

    this.set_offset_horizontal = function(distance) {
        this.mesh.position.x             = this.mesh.position.x + distance;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

};
