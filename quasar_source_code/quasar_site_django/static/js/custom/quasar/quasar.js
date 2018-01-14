'use strict';

/* __             __        __      __   __        __   __   ___                          __   __   __   ___
  /  \ |  |  /\  /__`  /\  |__)    /__` /  \ |  | |__) /  ` |__      |\/|  /\  | |\ |    /  ` /  \ |  \ |__
  \__X \__/ /~~\ .__/ /~~\ |  \    .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | | \|    \__, \__/ |__/ |___ */
// Load all the initially needed resources. Once complete the paused menu will go away.
MANAGER_LOADING.perform_initial_load();

// TODO : Make the messages fade away over time and then appear again whenever the typing menu is present.
GUI_TYPING_INTERFACE.add_server_message('Welcome to Quasar!');

// Game loop below.

var previous_time = performance.now();

var total_delta = 0;
var position_update_interval = 1 / 20;

var animate = function () {
    requestAnimationFrame(animate);
    MANAGER_RENDERER.pre_render();

    var time = performance.now();
    var delta = (time - previous_time) / 1000.0;

    MANAGER_DATA_DISPLAY.update();

    if (MANAGER_WORLD.current_floating_cursor.engaged) {
        MANAGER_WORLD.current_floating_cursor.update();
    }

    if (MANAGER_WORLD.current_player_menu.is_visible()) {
        MANAGER_WORLD.current_player_menu.update(delta);
    }

    MANAGER_MULTIPLAYER.update(delta);
    CURRENT_PLAYER.update(delta);
    MANAGER_WORLD.update_current_scene(delta);

    total_delta += delta;
    if (total_delta >= position_update_interval) {
        if (MANAGER_MULTIPLAYER.players.length > 1) {
            CURRENT_PLAYER.try_to_send_position_update_to_server();
        }
        total_delta -= position_update_interval;
    }

    ////
    if (GUI_TYPING_INTERFACE.needs_an_update()) {
        GUI_TYPING_INTERFACE.update();
    }
    ////

    MANAGER_RENDERER.render();
    MANAGER_RENDERER.post_render();
    previous_time = time;
};

animate();
