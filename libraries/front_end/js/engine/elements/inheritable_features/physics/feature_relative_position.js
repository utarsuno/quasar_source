'use strict';

$_QE.prototype.FeatureRelativePosition = function() {

    this.update_needed_for_position = false;
    this.horizontal_offsets         = new Float64Array(3);
    this.vertical_offsets           = new Float64Array(3);

    this.set_offset_vertical_percentage = function(parent_percentage, self_percentage=null, distance=null) {
        this.vertical_offsets[0] = parent_percentage;
        if (self_percentage != null) {
            this.vertical_offsets[1] = self_percentage;
        }
        if (distance != null) {
            this.vertical_offsets[2] = distance;
        }
        this.mesh.position.y             = this.parent.height * (this.vertical_offsets[0] - 0.5) + this.height * this.vertical_offsets[1];
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    this.set_offset_horizontal_percentage = function(parent_percentage, self_percentage=null, distance=null) {
        this.horizontal_offsets[0] = parent_percentage;
        if (self_percentage != null) {
            this.horizontal_offsets[1] = self_percentage;
        }
        if (distance != null) {
            this.horizontal_offsets[2] = distance;
        }
        this.mesh.position.x             = this.parent.width * (this.horizontal_offsets[0] - 0.5) + this.width * this.horizontal_offsets[1] + this.horizontal_offsets[2];
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

    this.set_offset_depth = function(distance) {
        this.mesh.position.z += distance;
        this.update_needed_for_position  = true;
        this.parent.a_child_needs_update = true;
    };

};
