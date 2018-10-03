'use strict';

$_QE.prototype.World = function(player) {
    this.player = player;

    $_QE.prototype.WorldElements.call(this);
    $_QE.prototype.WorldElementsRoot.call(this);
    $_QE.prototype.WorldElementsTabTarget.call(this);
    $_QE.prototype.WorldElementsInteractive.call(this);

    this.scene = new THREE.Scene();

    this.add_to_scene = function(object) {
        this.scene.add(object);
    };

    this.add_mesh_to_scene = function(mesh) {

    };

    this.add_group_to_scene = function(group) {

    };

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    this.remove_from_scene = function(object) {
        this.scene.remove(object);

        // TODO : Refactor this
        //if (object.hasOwnProperty('object3D')) {
        //    this.scene.remove(object.object3D);
        //}
    };
};
