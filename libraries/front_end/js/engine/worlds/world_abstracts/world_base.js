'use strict';

$_QE.prototype.World = function(player) {
    this.player = player;
};

Object.assign($_QE.prototype.World.prototype, {
    scene: new THREE.Scene(),

    add_to_scene: function(object) {
        this.scene.add(object);
    },

    add_mesh_to_scene: function(mesh) {

    },

    add_group_to_scene: function(group) {

    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    remove_from_scene: function(object) {
        this.scene.remove(object);

        // TODO : Refactor this
        //if (object.hasOwnProperty('object3D')) {
        //    this.scene.remove(object.object3D);
        //}
    },
});
