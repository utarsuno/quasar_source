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
        //this.logs.refresh();
        //this.logs.add_message(delta);
    };

    this.create_for_first_render = function() {
        this.nexus_local_title = new $_QE.prototype.FloatingText3D(this, 256, 'Nexus Local');
        this.nexus_local_title.set_position(-450, 300, -800);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.set_to_manual_positioning();
        this.nexus_local_title.refresh_position_and_look_at();



        this.logs = new $_NL.prototype.FloatingTerminal(this, 32, $_QE.prototype.CanvasFontPresets['console_font_smaller']);
        this.logs.initialize();
        this.nexus_local_title.set_position(-450, 300, -800);
        this.nexus_local_title.look_at_origin(true);
        this.nexus_local_title.set_to_manual_positioning();
        this.logs.refresh_position_and_look_at();

        this.logs.add_message('Hello World!');
        this.logs.add_message('Second message!');
        this.logs.add_message('Third message!');

        /*
        //floating_canvas_log.js

        this.logs = new $_QE.prototype.FloatingCanvasLogs(this, 15, 400, 250);
        //this.logs.notify_function = NL.main_logs_loaded;
        this.logs.lock_to_player = true;
        this.logs.initialize();
        //this.logs.set_position(-450, 100, -800);
        //this.logs.look_at_origin(false);
        this.logs.set_to_manual_positioning();
        //this.logs.refresh_position_and_look_at();
        */


        NL.create_gui_2d();
    };

};
