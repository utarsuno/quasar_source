'use strict';

function player_action_toggle_fullscreen() {
    MANAGER_RENDERER.toggle_fullscreen();
}

function player_action_global_save() {
    l('PERFORM A GLOBAL SAVE!');

    GUI_TYPING_INTERFACE.add_server_message('Saving changes to the server! TODO : Get a response back!');

    MANAGER_WORLD.prepare_for_save();
}

function player_action_create_entity_wall() {
    l('TODO : Create new entity wall!');
    MANAGER_WORLD.current_world.create_new_entity_wall(MANAGER_WORLD.current_world);
}

function player_action_teleport_to_world(world) {
    MANAGER_WORLD.set_current_world(world);
}

function player_action_create_picture() {
    GUI_TYPING_INTERFACE.add_server_message('To create an image simply drag and drop the image file into the browser!');
}

function player_action_create_new_video() {
    MANAGER_WORLD.current_world.create_new_video(MANAGER_WORLD.current_world);
}

// TODO :
function player_action_exit_function() {
    if (MANAGER_WORLD.current_world === MANAGER_WORLD.world_login) {
        // TODO : remove this or refactor
        window.close();
    } else {
        l('TODO : regular log out functionality');
    }
}