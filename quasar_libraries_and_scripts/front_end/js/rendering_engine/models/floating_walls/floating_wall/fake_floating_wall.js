'use strict';

function FakeFloatingWall(width, height, position, normal, world) {
    this.__init__(width, height, position, normal, world);
}

FakeFloatingWall.prototype = {

    __init__: function (width, height, position, normal, world) {
        FloatingWallAbstract.call(this, width, height, position, normal, world);
        this.manual_visibility = true;
        this.object3D.userData.manual_visibility = true;
    }
};