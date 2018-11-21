'use strict';

$_QE.prototype.DemoWorld = function(engine) {
    this.init_world('Demo', ASSET_ICON_PLANET, engine);
    this.set_world_enter_default_position(new THREE.Vector3(0, -500, 0));
    this.set_world_enter_default_normal(new THREE.Vector3(0.005015558927525423, -0.16165647877160208, -0.9868343463012478));
    this.set_on_world_enter(function() {
        QE.player.is_walking    = true;
        QE.player._has_boundary = true;
    }.bind(this));
    this.set_on_world_exit(function() {
        QE.player.is_walking    = false;
        QE.player._has_boundary = false;
    }.bind(this));
};

// TODO: Ensure both singleton backgrounds arnt in scene!

Object.assign(
    $_QE.prototype.DemoWorld.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
            //this.logs.refresh();
            //this.logs.add_message(delta);
        },

        _load: function() {
            //QE.tile_cube.world_include(this);
            this.tile_cube = new $_QE.prototype.TileCube();
            this.tile_cube.world_include(this);


            this.demo_title = new $_QE.prototype.Text3D({
                ARG_SIZE            : 128,
                ARG_TEXT            : 'Demo Cube =)',
                ARG_COLOR_FOREGROUND: QE.COLOR_GREEN_LIGHT,
                ARG_INTERACTIVE     : true,
                //ARG_TEXT_ALIGNMENT  : TEXT_ALIGNMENT_CENTER
            });

            this.create_and_add_element_to_root(this.demo_title);
            this.demo_title.set_position_center(1150, -150, -450, 0, -150, 0, true);


            this.logs = new $_NL.prototype.FloatingTerminal(16, QE.FONT_ARIAL_32, 'Text Wall');
            this.create_and_add_element_to_root(this.logs);
            this.logs.set_position_center(0, 0, -980, 0, -512, 0, true);
            this.logs.add_message('click - teleport in front');
            this.logs.add_message('double click - engage');
            this.logs.add_message('standard text editor');
            this.logs.add_message('😒 emoji support too');

        },
    }
);

