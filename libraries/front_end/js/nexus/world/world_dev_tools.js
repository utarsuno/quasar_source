'use strict';

$_NL.prototype.WorldDevTools = function(player, manager_world) {
    // Inherit.
    $_QE.prototype.World.call(this, player, manager_world);
    $_QE.prototype.WorldInput.call(this);
    $_QE.prototype.WorldState.call(this, new THREE.Vector3(0, 100, 0), new THREE.Vector3(1, 100, 0));

    this.custom_world_enter = function() {
        this.nexus_local_title.refresh_for_render();
        this.logs.refresh_for_render();

        l('World entered!!!');
    };

    this.update = function(delta) {
        //this.logs.refresh();
        //this.logs.add_message(delta);
    };

    this.create_for_first_render = function() {
        this.nexus_local_title = new $_QE.prototype.Text3D(this, 256, 'Nexus Local');
        this.nexus_local_title.set_position(-450, 300, -800);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.refresh_for_render();


        this.logs = new $_NL.prototype.FloatingTerminal(this, 32, $_QE.prototype.CANVAS_FONT_SMALLER);
        this.logs.initialize_terminal();
        this.logs.set_position(-450, 200, -800);
        this.logs.look_at_origin(true);
        this.logs.refresh_for_render();

        this.logs.add_text_line_to_bottom('Hello World!', QE.COLOR_CANVAS_GREEN);
        this.logs.add_text_line_to_bottom('Second message!', QE.COLOR_CANVAS_GREEN);
        this.logs.add_text_line_to_bottom('Third message!', QE.COLOR_CANVAS_GREEN);


        //this.cursor_test = new $_QE.prototype.FloatingIcon(this, ICON_CLICK, 16);
        //this.cursor_test.set_position(100, 100, 100);
        //this.cursor_test.set_normal(0, 0, 0);
        //this.cursor_test.refresh_position_and_look_at();


        NL.create_gui_2d();
    };

};
