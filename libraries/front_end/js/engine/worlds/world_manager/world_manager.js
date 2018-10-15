'use strict';

$_QE.prototype.WorldManager = function(engine) {
    this.engine         = engine;
    this.player         = engine.player;
    this.renderer       = engine.manager_renderer;
    this.application    = engine.application;
    this.client         = engine.client;
    this.previous_world = null;
    this.current_world  = null;
    this.singletons     = [];

    //$_QE.prototype.WorldManagerInput.call(this);

    this.first_world   = new this.application.first_world_class(this.player);
    this.first_world.create_for_first_render();
    this.environment   = new this.application.world_environment(this);
    this.player_cursor = new $_QE.prototype.PlayerCursor();

    // TODO: Refactor this method!!
    this.set_current_world = function(world) {
        //let previous_position_and_look_at;
        let s;

        if (this.current_world !== null) {
            this.player_cursor.detach();

            for (s = 0; s < this.singletons.length; s++) {
                this.singletons[s].world_leave();
            }

            //previous_position_and_look_at = this.current_world.exit_world();

            // Before exiting the world make sure to remove certain objects that are not world-unique.
            this.current_world.remove_from_scene(this.player.yaw);

            this.previous_world = this.current_world;
        }
        this.current_world = world;

        // Before switching to the new scene make sure it has all non world-unique objects.
        this.current_world.add_to_scene(this.player.yaw);

        for (s = 0; s < this.singletons.length; s++) {
            this.singletons[s].world_enter(this.current_world);
        }

        this.current_world.enter();
    };

    this.physics = function(delta) {
        this.player.physics(delta);

        if (this.renderer.in_transition) {
            return;
        }
        this.current_world.update_elements_root(delta);

        if (!this.player_cursor.in_mouse_action()) {
            this.current_world.update_elements_interactive();
        }

        this.current_world.update(delta);
    };

    this.update = function(delta) {
    };

};

/*

WorldManager.prototype = {
    __init__: function() {
        // List of all dynamic worlds.
        this.dynamic_worlds = {};

        // Singletons.
        this.player_menu = new PlayerMenu();
        this.player_cursor = new PlayerCursor();
        this.environment = new WorldEnvironment();

        // Inherit.
        DynamicContentManager.call(this);
    },

    _singleton_transition_after_old_scene_fbo: function(current_world, previous_world) {
        this.environment.switch_to_new_world(previous_world, current_world);
    },

    set_current_world: function(world, transition_finished_callback) {
        let previous_position_and_look_at;

        if (this.current_world !== null) {
            this.player_cursor.detach();
            // Make sure to hide the player menu if it is visible.
            if (this.player_menu.is_currently_visible()) {
                this.player_menu.toggle_visibility();
            }

            previous_position_and_look_at = this.current_world.exit_world();

            // Before exiting the world make sure to remove certain objects that are not world-unique.
            this.current_world.remove_from_scene(CURRENT_PLAYER.fps_controls.yaw);

            this.previous_world = this.current_world;
        }
        this.current_world = world;

        // Before switching to the new scene make sure it has all non world-unique objects.
        this.current_world.add_to_scene(CURRENT_PLAYER.fps_controls.yaw);

        // Set the player position ahead of time.
        this.current_world.set_player_enter_position_and_look_at();
        this.current_world.enter_world(this.player_cursor);

        if (is_defined(this.previous_world)) {
            this.player_menu.switch_to_new_world(this.previous_world, this.current_world);
            this.player_cursor.switch_to_new_world(this.previous_world, this.current_world);
            MANAGER_RENDERER.set_current_world(this.current_world, this.previous_world, transition_finished_callback, previous_position_and_look_at, this._singleton_transition_after_old_scene_fbo.bind(this, this.current_world, this.previous_world));
        } else {
            MANAGER_RENDERER.set_current_scene(this.current_world.scene, transition_finished_callback);
        }

        //this.current_world.enter_world(this.player_cursor);
    },

};


*/