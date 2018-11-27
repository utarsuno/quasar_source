'use strict';

$_NL.prototype.WorldDevTools = function(engine) {
    this.init_world('Dev Tools', ASSET_ICON_HOME, engine);
    this.set_world_enter_default_position(new THREE.Vector3(-34.79899682521624, 557.3571839639006, 1802.99541871182));
    this.set_world_enter_default_normal(new THREE.Vector3(0.005015558927525423, -0.16165647877160208, -0.9868343463012478));

    this.needed_singletons = [
        SINGLETON_HEXAGON_GRID, SINGLETON_AMBIENT_LIGHT, SINGLETON_SKY_BOX_GRAY,
        SINGLETON_HEXAGON_LIGHT_0, SINGLETON_HEXAGON_LIGHT_1, SINGLETON_HEXAGON_LIGHT_2, SINGLETON_HEXAGON_LIGHT_3,
        SINGLETON_PLAYER_MENU, SINGLETON_PLAYER
    ];
};

Object.assign(
    $_NL.prototype.WorldDevTools.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
            //this.logs.refresh();
            //this.logs.add_message(delta);
        },

        _load: function() {
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


