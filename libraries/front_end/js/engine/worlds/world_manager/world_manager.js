'use strict';

$_QE.prototype.WorldManager = function(engine) {
    this.engine      = engine;
    this.player      = engine.player;
    this.application = engine.application;
};

Object.assign(
    $_QE.prototype.WorldManager.prototype,
    {
        previous_world: null,
        current_world : null,

        __init__: function() {
            //this.first_world = new $_QE.prototype.SettingsWorld(this.engine);
            //this.first_world    = new this.engine.first_world_class(this.engine);
            //this.world_demo     = new $_QE.prototype.DemoWorld(this.engine);
            this.first_world = new $_QE.prototype.DemoWorld(this.engine);
            this.world_demo     = new $_QE.prototype.SettingsWorld(this.engine);
            this.world_settings    = new this.engine.application_first_world(this.engine);
            //this.world_settings = new $_QE.prototype.SettingsWorld(this.engine);
            this._create_global_singletons();

            this.player_menu.register_world(this.first_world);
            this.player_menu.register_world(this.world_demo);
            this.player_menu.register_world(this.world_settings);
        },

        set_current_world: function(world) {
            if (this.current_world != null) {
                this.singletons_leave_world();
                this.current_world.exit();
                this.previous_world = this.current_world;
            }
            this.current_world = world;
            this.current_world._load_world_if_needed();
            this.singletons_enter_world();
            this.current_world.enter();
            this.engine._on_new_scene_set(this.current_world.scene);
        },

        physics: function(delta) {
            this.player.physics(delta);

            if (this.engine.flag_is_on(QEFLAG_STATE_IN_TRANSITION)) {
                return;
            }

            this.current_world.update_elements_root(delta);

            if (!this.player_cursor.is_in_action()) {
                this.current_world.update_elements_interactive();
            }

            this.current_world.update(delta);
        },

        update: function(delta) {
            //this.current_world.update_elements_root(delta);
            //this.current_world.update(delta);
        },
    }
);
