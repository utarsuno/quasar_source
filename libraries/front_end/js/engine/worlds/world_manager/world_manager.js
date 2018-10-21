'use strict';

$_QE.prototype.WorldManager = function(engine) {
    this.engine         = engine;
    this.player         = engine.player;
    this.renderer       = engine.manager_renderer;
    this.application    = engine.application;
    this.client         = engine.client;
    this.create_for_first_render();
};

Object.assign(
    $_QE.prototype.WorldManager.prototype,
    {
        previous_world: null,
        current_world : null,

        create_for_first_render: function() {
            this.first_world   = new this.engine.first_world_class(this.player);
            this.first_world.create_for_first_render();
            this.environment   = new this.engine.world_environment(this);
            this.player_cursor = new $_QE.prototype.PlayerCursor(this.player);
        },

        // TODO: Refactor this method!!
        set_current_world: function(world) {
            //let previous_position_and_look_at;

            if (this.current_world !== null) {
                this.player_cursor.detach();
                this.singletons_leave_world();

                //previous_position_and_look_at = this.current_world.exit_world();

                // Before exiting the world make sure to remove certain objects that are not world-unique.
                this.current_world.scene.remove(this.player.yaw);

                this.previous_world = this.current_world;
            }
            this.current_world = world;

            // Before switching to the new scene make sure it has all non world-unique objects.
            this.current_world.scene.add(this.player.yaw);

            this.singletons_enter_world();
            this.current_world.enter();
        },

        physics: function(delta) {
            this.player.physics(delta);

            if (this.renderer.in_transition) {
                return;
            }
            this.current_world.update_elements_root(delta);

            if (!this.player_cursor.in_mouse_action()) {
                this.current_world.update_elements_interactive();
            }

            this.current_world.update(delta);
        },

        update: function(delta) {
        },
    }
);
