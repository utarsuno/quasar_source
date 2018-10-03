'use strict';

$_QE.prototype.FeatureRelativeNormal = function() {

    this.get_normal = function() {
        // To get relative forward:
        // e = this.<mesh>.matrixWorld.elements;
        // <Vector3>.set(e[8], e[9], e[10]).normalize()
        return this.parent.get_normal();
    };

    this.get_up = function() {
        // To get relative up: relative_forward.cross(absolute_up).cross(relative_forward)
        return this.parent.get_up();
    };

    this.get_left_right = function() {
        // To get left right: relative_forward.cross(relative_up)
        return this.parent.get_left_right();
    };

};
