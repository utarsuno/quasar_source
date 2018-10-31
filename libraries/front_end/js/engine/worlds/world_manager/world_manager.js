'use strict';

$_QE.prototype.WorldManager = function(engine) {
    this.engine      = engine;
    this.player      = engine.player;
    this.application = engine.application;
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
            this.application.add_singletons(this);
            this.player_cursor = new $_QE.prototype.PlayerCursor(this.player);
        },

        set_current_world: function(world) {
            if (this.current_world != null) {
                this.singletons_leave_world();
                this.previous_world = this.current_world;
            }
            this.current_world = world;
            this.singletons_enter_world();
            this.current_world.enter();
        },

        physics: function(delta) {
            this.player.physics(delta);

            if (this.engine.get_flag(ENGINE_STATE_IN_TRANSITION)) {
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
