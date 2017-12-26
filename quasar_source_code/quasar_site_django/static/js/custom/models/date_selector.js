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
        this.wall.add_3D_title('Select Date');
        this.wall.add_close_button();
    },

    show_at: function(floating_2D_text) {
        this.wall.show();

        var bp = floating_2D_text.get_position();
        var bnd = floating_2D_text.parent_floating_wall.normal_depth;
        var bn = floating_2D_text.parent_floating_wall.normal;

        this.wall.normal = bn;
        this.wall.normal_depth = bnd;

        //this.wall.object3D.position.set(bp.x + bn.x * bnd, bp.y + bn.y * bnd, bp.z + bn.z * bnd);
        //this.wall.object3D.lookAt(new THREE.Vector3(bp.x + bn.x * bnd * 2, bp.y + bn.y * bnd * 2, bp.z + bn.z * bnd * 2));

        this.wall.pfw_button = floating_2D_text;
        this.wall.update_position_with_offset_xyz(0, 0, 0);
        this.wall.update_position_and_normal_for_all_floating_text();
    },

    // TODO:
    hide: function() {

    }

};
