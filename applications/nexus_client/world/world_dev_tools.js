'use strict';

$_NL.prototype.WorldDevTools = function(player) {
    this.init_world(player);
    this.set_world_enter_default_position(new THREE.Vector3(-34.79899682521624, 557.3571839639006, 1802.99541871182));
    this.set_world_enter_default_normal(new THREE.Vector3(0.005015558927525423, -0.16165647877160208, -0.9868343463012478));
};

Object.assign(
    $_NL.prototype.WorldDevTools.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
            //this.logs.refresh();
            //this.logs.add_message(delta);
        },

        create_for_first_render: function() {
            this.nexus_local_title = new $_QE.prototype.Text3D(512, 'Nexus Local', true);
            this.create_and_add_element_to_root(this.nexus_local_title);
            this.nexus_local_title.set_position_center(0, 1000, -1750, 0, 0, 0, true);
            //this.nexus_local_title.add_to_world(this, true, true, true);

            /*
            this.nexus_local_title2 = new $_QE.prototype.Text3D(512, 'Nexus Local', false);
            this.nexus_local_title2.add_to_world(this, true, false, true);
            this.nexus_local_title2.set_position_center(0, 2000, -1750, 0, 0, 0, true);

            this.nexus_local_title3 = new $_QE.prototype.Text3D(512, 'Nexus Local', false);
            this.nexus_local_title3.add_to_world(this, true, false, true);
            this.nexus_local_title3.set_position_center(0, 3000, -1750, 0, 0, 0, true);

            this.nexus_local_title4 = new $_QE.prototype.Text3D(512, 'Nexus Local', false);
            this.nexus_local_title4.add_to_world(this, true, false, true);
            this.nexus_local_title4.set_position_center(0, 4000, -1750, 0, 0, 0, true);
            */

            /*
            this.logs = new $_NL.prototype.FloatingTerminal(32, QE.CANVAS_FONT_SMALLER, 'Floating Terminal');
            this.create_and_add_element_to_root(this.logs);
            //this.logs.add_to_world(this, true, true, true, true);
            //this.logs.set_position_center(-2500, 1000, -1200, 0, 1000, 0, true);
            this.logs.set_position_center(-2500, 1000, -1200, 0, 0, 0, true);
            this.logs.add_text_line_to_bottom('Hello World!', COLOR_CANVAS_GREEN);
            this.logs.add_text_line_to_bottom('Second message!', COLOR_CANVAS_GREEN);
            this.logs.add_text_line_to_bottom('Third message!', COLOR_CANVAS_GREEN);
            */
        },
    }
);


