'use strict';

$_NL.prototype.WorldDevTools = function(player, manager_world) {
    // Inherit.
    $_QE.prototype.World.call(this, player, manager_world);
    $_QE.prototype.WorldInput.call(this);
    $_QE.prototype.WorldState.call(this, new THREE.Vector3(0, 100, 0), new THREE.Vector3(1, 100, 0));

    this.custom_world_enter = function() {
        this.nexus_local_title.refresh_position_and_look_at();
    };

    this.create_for_first_render = function() {
        this.nexus_local_title = new $_QE.prototype.FloatingText3D(this, 256, 'Nexus Local');
        this.nexus_local_title.set_position(400, 200, -400);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.set_to_manual_positioning();

    };

};
