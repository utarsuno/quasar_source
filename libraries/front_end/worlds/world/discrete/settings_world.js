'use strict';

$_QE.prototype.SettingsWorld = function(engine) {
    this.init_world('Settings', ASSET_ICON_GEARS, engine);
    this.set_world_enter_default_position(new THREE.Vector3(-34.79899682521624, 557.3571839639006, 1802.99541871182));
    this.set_world_enter_default_normal(new THREE.Vector3(0.005015558927525423, -0.16165647877160208, -0.9868343463012478));

    this.needed_singletons = [
        SINGLETON_HEXAGON_GRID, SINGLETON_AMBIENT_LIGHT, SINGLETON_SKY_BOX_GRAY,
        SINGLETON_HEXAGON_LIGHT_0, SINGLETON_HEXAGON_LIGHT_1, SINGLETON_HEXAGON_LIGHT_2, SINGLETON_HEXAGON_LIGHT_3,
        SINGLETON_PLAYER_MENU, SINGLETON_PLAYER
    ];
};

// TODO: Ensure both singleton backgrounds arnt in scene!

Object.assign(
    $_QE.prototype.SettingsWorld.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
            //this.logs.refresh();
            //this.logs.add_message(delta);
        },

        _load: function() {

        },
    }
);
