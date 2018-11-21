'use strict';

$_NL.prototype.WorldDevTools = function(engine) {
    this.init_world('Dev Tools', ASSET_ICON_HOME, engine);
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
            /*
            this.logs.add_text_line_to_bottom('Hello World!', COLOR_CANVAS_GREEN);
            this.logs.add_text_line_to_bottom('Second message!', COLOR_CANVAS_GREEN);
            this.logs.add_text_line_to_bottom('Third message!', COLOR_CANVAS_GREEN);
            */

            //this.test = new $_QE.prototype.Text2D('Test!', 256, QE.FONT_ARIAL_32);
            //this.create_and_add_element_to_root(this.test);
            //this.test.set_position_center(-2000, 1000, -1000, 0, 0, 0, true);

        },

        _load: function() {

            this.grid    = new $_QE.prototype.HexagonGrid(6);
            this.light_w = new $_QE.prototype.LightPoint(0xccffcc, .5, 3500, 2, 750, 450, 750);
            this.light_r = new $_QE.prototype.LightPoint(0xff8579, .5, 3500, 2, 750, 450, -750);
            this.light_g = new $_QE.prototype.LightPoint(0xb1ff90, .5, 3500, 2, -750, 450, 750);
            this.light_b = new $_QE.prototype.LightPoint(0x84b5ff, .5, 3500, 2, -750, 450, -755);
            //this.light_a = new $_QE.prototype.LightAmbient(0xffffff, .60);
            //this.skybox  = new $_QE.prototype.SkyBox();


            this.nexus_local_title = new $_QE.prototype.Text3D({
                ARG_SIZE            : 512,
                ARG_TEXT            : 'Nexus Local',
                ARG_COLOR_FOREGROUND: QE.COLOR_GREEN_LIGHT,
                ARG_INTERACTIVE     : true,
            });
            this.create_and_add_element_to_root(this.nexus_local_title);
            this.nexus_local_title.set_position_center(0, 1000, -1750, 0, 0, 0, true);



            this.logs = new $_NL.prototype.FloatingTerminal(32, QE.FONT_ARIAL_32, 'Floating Terminal');
            this.create_and_add_element_to_root(this.logs);
            this.logs.set_position_center(-2500, 1000, -1200, 0, 0, 0, true);
        },
    }
);


