'use strict';

$_QE.prototype.FloatingElement = function() {

    $_QE.prototype.Element.call(this);

    this.refresh_for_render = function() {
        l('TODO: refresh for render!');
    };

    this.create_floating_element = function(world) {

    };

    this.set_position = function(x, y, z) {
        if (this.root_element) {
            this.group.position.set(x, y, z);
        } else {
            this.element.position.set(x, y, z);
            this.element.updateMatrix();
        }
    };

};
