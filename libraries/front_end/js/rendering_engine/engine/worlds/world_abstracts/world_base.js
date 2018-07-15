'use strict';

$_QE.prototype.World = function(player, manager_world) {
    this.player = player;
    this.manager_world = manager_world;

    $_QE.prototype.WorldElements.call(this);
    $_QE.prototype.WorldElementsRoot.call(this);
    $_QE.prototype.WorldElementsInteractive.call(this);

    this.raycaster                  = new THREE.Raycaster();
    this.scene                      = new THREE.Scene();

    // For cache optimizations.
    this._intersections = [];

    this.look_at_currently_looked_at_object = function(have_player_camera_look_at, set_cursor) {
        if (is_defined(this.currently_looked_at_object.tab_parent)) {
            this.manager_world.current_world.set_default_tab_target(this.currently_looked_at_object.tab_parent);
        }
        if (have_player_camera_look_at) {
            this.player.look_at(this.currently_looked_at_object.object3D.position);
        }
        if (set_cursor) {
            this.floating_cursor.attach(this.currently_looked_at_object);
        }
        this.currently_looked_at_object.look_at();
    };

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
