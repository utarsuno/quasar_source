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
        this.nexus_local_title = new FloatingText3D(this, 256, 'Quasar Source');
        this.nexus_local_title.set_position(1900, 500, 1000);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.set_to_manual_positioning();
    };

};