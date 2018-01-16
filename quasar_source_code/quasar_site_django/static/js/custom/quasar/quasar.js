'use strict';

/* __             __        __      __   __        __   __   ___                          __   __   __   ___
  /  \ |  |  /\  /__`  /\  |__)    /__` /  \ |  | |__) /  ` |__      |\/|  /\  | |\ |    /  ` /  \ |  \ |__
  \__X \__/ /~~\ .__/ /~~\ |  \    .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | | \|    \__, \__/ |__/ |___ */


// The main loop will start after the required initial resources have loaded.
function QuasarMainLoop() {
}

QuasarMainLoop.prototype = {
    run: function() {
        // TODO : Make the messages fade away over time and then appear again whenever the typing menu is present.
        GUI_TYPING_INTERFACE.add_server_message('Welcome to Quasar!');

        // Game loop below.

        var previous_time = performance.now();

        var quasar_main_loop = function () {
            requestAnimationFrame(quasar_main_loop);
            MANAGER_RENDERER.pre_render();

            var time = performance.now();
            var delta = (time - previous_time) / 1000.0;

            MANAGER_DATA_DISPLAY.update();

            // TODO : Refactor this logic into ManagerWorld?
            //if (MANAGER_WORLD.current_floating_cursor.engaged) {
            //    MANAGER_WORLD.current_floating_cursor.update();
            //}

            //MANAGER_MULTIPLAYER.update(delta);
            CURRENT_PLAYER.update(delta);
            MANAGER_WORLD.update_current_world(delta);

            ////
            if (GUI_TYPING_INTERFACE.needs_an_update()) {
                GUI_TYPING_INTERFACE.update();
            }
            ////

            MANAGER_RENDERER.render();
            MANAGER_RENDERER.post_render();
            previous_time = time;
        };
    }
};

var quasar = QuasarMainLoop();


// Load all the initially needed resources. Once loaded start the main loop.
MANAGER_LOADING.perform_initial_load(quasar);

