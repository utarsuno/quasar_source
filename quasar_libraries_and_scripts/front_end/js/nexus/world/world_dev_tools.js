'use strict';

$_NL.prototype.WorldDevTools = function(player, manager_world) {
    // Inherit.
    $_QE.prototype.World.call(this, player, manager_world);
    $_QE.prototype.WorldInput.call(this);
    $_QE.prototype.WorldState.call(this, new THREE.Vector3(0, 100, 0), new THREE.Vector3(1, 100, 0));

    this.custom_world_enter = function() {
        this.nexus_local_title.refresh_position_and_look_at();

        l('World entered!!!');
    };

    this.update = function(delta) {
        this.logs.refresh();
        //this.logs.add_message(delta);
    };

    this.create_for_first_render = function() {
        this.nexus_local_title = new $_QE.prototype.FloatingText3D(this, 256, 'Nexus Local');
        this.nexus_local_title.set_position(-450, 300, -800);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.set_to_manual_positioning();
        this.nexus_local_title.refresh_position_and_look_at();



        //floating_canvas_log.js

        this.logs = new $_QE.prototype.FloatingCanvasLogs(this, 15, 400, 250);
        this.logs.lock_to_player = true;
        this.logs.initialize();
        //this.logs.set_position(-450, 100, -800);
        //this.logs.look_at_origin(false);
        this.logs.set_to_manual_positioning();
        //this.logs.refresh_position_and_look_at();
    };

};
