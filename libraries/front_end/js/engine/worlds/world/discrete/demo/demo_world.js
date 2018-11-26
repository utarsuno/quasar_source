'use strict';



$_QE.prototype.DemoWorld = function(engine) {
    this.init_world('Demo', ASSET_ICON_PLANET, engine);
    this.set_world_enter_default_position(new THREE.Vector3(1024, 512, 0));
    this.set_world_enter_default_normal(new THREE.Vector3(0, 0, 1));
    this.set_on_world_enter(QE.player.set_to_walking);
    this.set_on_world_exit(QE.player.set_to_flying);

    this.needed_singletons = [
        SINGLETON_AMBIENT_LIGHT, SINGLETON_SKY_BOX_SPACE,
        SINGLETON_DEMO_ROOM,
        //SINGLETON_FLASH_LIGHT, SINGLETON_TARGET_OF_FLASH_LIGHT,
        SINGLETON_PLAYER_MENU, SINGLETON_PLAYER
    ];
};

Object.assign(
    $_QE.prototype.DemoWorld.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
        },

        _load: function() {
            this.demo_title = new $_QE.prototype.Text3D({
                ARG_SIZE            : 128,
                ARG_TEXT            : 'Demo Cube =)',
                ARG_COLOR_FOREGROUND: QE.COLOR_GREEN_LIGHT,
                ARG_INTERACTIVE     : true,
                //ARG_ALIGNMENT_TEXT  : TEXT_ALIGNMENT_CENTER
            });

            this.create_and_add_element_to_root(this.demo_title);
            this.demo_title.set_position_center(1150, -150, -450, 0, -150, 0, true);

            /*
            this.demo_room = new $_QE.prototype.DemoRoom([
                [0, 2],
                [1, 2],
                [2, 2],
                [1, 1],
                [1, 0],
            ], [1, 0], this, SINGLETON_DEMO_ROOM);
            */

            this.demo_room = new $_QE.prototype.DemoRoom([
                [0, 4],
                [1, 4],
                [2, 4],
                [3, 4],
                [4, 4],
                [5, 4],

                [0, 3],
                [1, 3],
                [2, 3],
                [3, 3],
                [4, 3],
                [5, 3],

                [1, 2],
                [1, 1],
                [1, 0],

                [2, 2],
                [2, 1],
                [2, 0],


            ], [1, 0], this, SINGLETON_DEMO_ROOM);

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

