'use strict';

ManagerManager.prototype.set_quasar_main_object = function(current_client, current_player, manager_world, manager_renderer, manager_manager) {
    function QuasarMainLoop(current_client, current_player, manager_world, manager_renderer, manager_manager) {
        this.__init__(current_client, current_player, manager_world, manager_renderer, manager_manager);
    }

    QuasarMainLoop.prototype = {

        __init__: function(current_client, current_player, manager_world, manager_renderer, manager_manager) {
            this.current_client   = current_client;
            this.current_player   = current_player;
            this.manager_world    = manager_world;
            this.manager_renderer = manager_renderer;
            this.manager_manager  = manager_manager;

            this.current_client.set_quasar(this);

            this.quasar_main_loop = this._quasar_main_loop.bind(this);

            //this.delta_clock = new THREE.Clock(false);
            this.delta_clock = new THREE.Clock();
            this.delta = 0;
        },

        run: function() {
            // Perform a single render.
            this._main_loop_logic();
            // Run garbage collection after the single render.
            this.manager_manager.perform_initial_heap_cleanup();
            // Now run the actual main loop.
            this.delta_clock.start();
            this._quasar_main_loop();
        },

        reset_delta: function() {
            this.delta_clock.start();
        },

        _quasar_main_loop: function() {
            requestAnimationFrame(this.quasar_main_loop);
            if (this.current_player.current_state !== PLAYER_STATE_PAUSED) {
                this._main_loop_logic();
            }
        },

        _main_loop_logic: function() {
            this.delta = this.delta_clock.getDelta();

            this.current_client.pre_render();

            this.current_client.update();
            this.manager_world.update(this.delta);
            this.current_client.update_message_log(this.delta);

            this.manager_renderer.render(this.delta);
            this.current_client.post_render();

            this.delta_clock.start();
        }
    };

    this.quasar_main_object = new QuasarMainLoop(current_client, current_player, manager_world, manager_renderer, manager_manager);
};