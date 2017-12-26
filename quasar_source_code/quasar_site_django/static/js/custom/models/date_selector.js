'use strict';

// Each world (that needs it) will contain a single instance of DateSelector to re-use.
function DateSelector(world) {
    this.__init__(world);
}

DateSelector.prototype = {

    __init__: function(world) {
        this.world = world;

        var w = 600;
        var h = 700;
        var p = new THREE.Vector3(-5000, -5000, -5000);
        var n = new THREE.Vector3(0, 0, 0);

        this.wall = new FloatingWall(w, h, p, n, this.world, false);


    }

};