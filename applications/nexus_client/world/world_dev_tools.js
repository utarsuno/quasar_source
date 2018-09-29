'use strict';

$_NL.prototype.WorldDevTools = function(player, manager_world) {

    this.custom_world_enter = function() {
        //this.nexus_local_title.refresh_self_and_all_children_recursively();
        //this.logs.refresh_self_and_all_children_recursively();
        //l('World entered!!!');
        //this.logs.refresh();
    };

    // Inherit.
    $_QE.prototype.World.call(this, player, manager_world);
    $_QE.prototype.WorldInput.call(this);
    $_QE.prototype.WorldState.call(this,
        new THREE.Vector3(
            -34.79899682521624,
            557.3571839639006,
            1802.99541871182)
        ,
        new THREE.Vector3(
            0.005015558927525423,
            -0.16165647877160208,
            -0.9868343463012478
        ),
        this.custom_world_enter.bind(this)
    );

    this.update = function(delta) {
        //this.logs.refresh();
        //this.logs.add_message(delta);
    };

    this._create_world_environment = function() {

    };

    this.create_for_first_render = function() {
        //this.nexus_local_title = new $_QE.prototype.Text3D(true, 256, 'Nexus Local', false);
        //this.nexus_local_title = new $_QE.prototype.Text3D(true, 512, 'Nexus Local', false);
        this.nexus_local_title = new $_QE.prototype.Text3D(true, 512, 'Nexus Local', true);
        this.nexus_local_title.add_to_world(this, true, true, true);
        this.nexus_local_title.set_position_center(0, 1000, -1750, 0, 0, 0, true);

        this.nexus_local_title2 = new $_QE.prototype.Text3D(true, 512, 'Nexus Local', false);
        this.nexus_local_title2.add_to_world(this, true, false, true);
        this.nexus_local_title2.set_position_center(0, 2000, -1750, 0, 0, 0, true);

        this.nexus_local_title3 = new $_QE.prototype.Text3D(true, 512, 'Nexus Local', false);
        this.nexus_local_title3.add_to_world(this, true, false, true);
        this.nexus_local_title3.set_position_center(0, 3000, -1750, 0, 0, 0, true);

        this.nexus_local_title4 = new $_QE.prototype.Text3D(true, 512, 'Nexus Local', false);
        this.nexus_local_title4.add_to_world(this, true, false, true);
        this.nexus_local_title4.set_position_center(0, 4000, -1750, 0, 0, 0, true);

        //this.add_to_scene(this.nexus_local_title);

        //this.nexus_local_title = new $_QE.prototype.Text3D(256, 'Nexus Local');
        //this.nexus_local_title.set_position(-450, 300, -800);
        //this.nexus_local_title.look_at_origin(false);
        //this.nexus_local_title.refresh_for_render();
        //this.nexus_local_title.refresh_self_and_all_children_recursively();

        /*
        this.nexus_local_title = new $_QE.prototype.Text3D(this, 256, 'Nexus Local');
        this.nexus_local_title.set_position(-450, 300, -800);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.refresh_self_and_all_children_recursively();
        */

        this.logs = new $_NL.prototype.FloatingTerminal(true, 32, QE.CANVAS_FONT_SMALLER);
        this.logs.add_to_world(this, true, true, true, true);
        this.logs.set_position_center(-2500, 1000, -1200, 0, 0, 0, true);
        this.logs.add_text_line_to_bottom('Hello World!', QE.COLOR_CANVAS_GREEN);
        this.logs.add_text_line_to_bottom('Second message!', QE.COLOR_CANVAS_GREEN);
        this.logs.add_text_line_to_bottom('Third message!', QE.COLOR_CANVAS_GREEN);

        this.logs.add_title('Floating Terminal', false, 0.0, false);
        this.logs.add_button_close();
        this.logs.add_button_settings();
        this.logs.add_button_help();
        this.logs.add_icon(ASSET_ICON_TERMINAL);

        /*
        this.logs = new $_NL.prototype.FloatingTerminal(this, 32, $_QE.prototype.CANVAS_FONT_SMALLER);
        this.logs.initialize_terminal();
        this.logs.set_position(-450, 200, -800);
        this.logs.look_at_origin(true);
        this.logs.refresh_self_and_all_children_recursively();
        */

        //this.cursor_test = new $_QE.prototype.FloatingIcon(this, ICON_CLICK, 16);
        //this.cursor_test.set_position(100, 100, 100);
        //this.cursor_test.set_normal(0, 0, 0);
        //this.cursor_test.refresh_position_and_look_at();
    };

};
