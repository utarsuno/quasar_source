'use strict';

$_QE.prototype.FeatureRowElement = function(relative_index, horizontal_go_right) {

    this.horizontal_go_right     = horizontal_go_right;
    this.next                    = null;
    this.previous                = null;
    this.relative_index          = relative_index;

    this.update_horizontal_position = function() {
        if (this.horizontal_go_right) {
            this.set_offset_horizontal_percentage(0, 0.5, this.previous.horizontal_offsets[2] + this.previous.width);
        } else {
            this.set_offset_horizontal_percentage(1, -0.5, this.previous.horizontal_offsets[2] - this.previous.width);
        }
    };
};