'use strict';

$_QE.prototype.WorldManager = function(player, renderer, application) {
    this.previous_world = null;
    this.current_world  = null;
    this.player         = player;
    this.renderer       = renderer;
    this.application    = application;
    this.client         = this.player.client;

    this.singletons     = [];

    $_QE.prototype.WorldManagerInput.call(this);

    this.initialize_first_world = function() {
        this.first_world = new this.application.first_world_class(this.player, this);
        //this.first_world.create_for_first_render();

        this.environment = new this.application.world_environment();
        this.environment.create_world_environment_singletons(this.first_world, this);

        this.player_cursor = new $_QE.prototype.PlayerCursor();
        this.player_cursor.create_world_environment_singletons(this.first_world, this.player, this);
    };

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

        // Set the player position ahead of time.
        for (s = 0; s < this.singletons.length; s++) {
            this.singletons[s].world_enter(this.current_world);
        }

        this.current_world.enter_world(this.player_cursor);
    };

    this.update = function(delta) {
        if (this.player.currently_loading()) {
            return;
        }

        let a;
        for (a = 0; a < QE.gui_2d_elements.length; a++) {
            QE.gui_2d_elements[a].update();
        }

        this.player.physics(delta);

        if (this.renderer.in_transition) {
            return;
        }

        this.current_world.update_elements_root(delta);
        this.current_world.update_elements_interactive();

        //if (!this.player_cursor._currently_engaged && this.player.current_state !== PLAYER_STATE_TYPING) {
        //    this.current_world.update_interactive_objects();
        //}

        this.current_world.update(delta);
    };

};

/*

WorldManager.prototype = {

    __init__: function() {
        // Static world objects without static entity.
        this.world_login = new LoginWorld();

        // List of all dynamic worlds.
        this.dynamic_worlds = {};

        // Singletons.
        this.player_menu = new PlayerMenu();
        this.player_cursor = new PlayerCursor();
        this.environment = new WorldEnvironment();

        // Inherit.
        DynamicContentManager.call(this);
        WorldManagerInput.call(this);

        // For optimizations.
        // TODO: Previous position and direction.
    },

    _singleton_transition_after_old_scene_fbo: function(current_world, previous_world) {
        this.environment.switch_to_new_world(previous_world, current_world);
    },

    update: function(delta) {
        if (CURRENT_PLAYER.currently_loading()) {
            return;
        }

        // Since we are not currently loading we can perform an update on the player and the world.
        //CURRENT_PLAYER.update(delta);
        CURRENT_PLAYER.fps_controls.physics(delta);

        this.environment.update(delta);

        if (MANAGER_RENDERER.in_transition) {
            return;
        }


        // TODO : Double check on what order these should update.

        //if (MANAGER_WORLD.current_player_menu.is_visible()) {
        //    MANAGER_WORLD.current_player_menu.update(delta);
        //}

        let a;
        for (a = 0; a < this.current_world.root_attachables.length; a++) {
            if (this.current_world.root_attachables[a].has_animation && this.root_attachables[a].requires_animation_update) {
                this.current_world.root_attachables[a].update(delta);

                //if (this.current_world.root_attachables[a].hasOwnProperty('update_all_child_animations_recursively')) {
                //    this.current_world.root_attachables[a].update_all_child_animations_recursively(delta);
                //} else {
                //    l('Investigate this?');
                //}

            }
        }

        if (!this.player_cursor._currently_engaged) {
            // Don't update interactive objects during a transition or during chat typing.
            if (!MANAGER_RENDERER.in_transition || CURRENT_PLAYER.current_state === PLAYER_STATE_TYPING) {

                // TODO : Prevent interactive objects update if there has been no movement/inputs.



                this.current_world.update_interactive_objects();
            }
        }

        this.current_world.floating_cursor.update();
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