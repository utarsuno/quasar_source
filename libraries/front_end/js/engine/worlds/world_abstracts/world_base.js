'use strict';

$_QE.prototype.World = function(player, manager_world) {
    this.player = player;
    this.manager_world = manager_world;

    $_QE.prototype.WorldElements.call(this);
    $_QE.prototype.WorldElementsRoot.call(this);
    $_QE.prototype.WorldElementsInteractive.call(this);

    this.scene = new THREE.Scene();

    this.add_to_scene = function(object) {
        this.scene.add(object);
    };

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    this.remove_from_scene = function(object) {
        this.scene.remove(object);

        // TODO : Refactor this
        if (object.hasOwnProperty('object3D')) {
            this.scene.remove(object.object3D);
        }
    };
};
