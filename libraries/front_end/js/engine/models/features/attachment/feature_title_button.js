'use strict';

$_QE.prototype.FeatureTitle = function(text) {
    this.title = new $_QE.prototype.Text3D(this.world, 64, text);
    this.title.offset_vertical_percentage   = HALF;
    this.title.offset_horizontal_percentage = -HALF;
    this.title.offset_depth_distance        = 1;
    this.add_attachment(this.title);
};