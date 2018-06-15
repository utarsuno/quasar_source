'use strict';

/*
// Global managers.
let MANAGER_MANAGER      = null;
let MANAGER_HEAP         = null;
let MANAGER_SPRITESHEET  = null;
let MANAGER_WEB_SOCKETS  = null;
let MANAGER_AUDIO        = null;
let MANAGER_TEXTURE      = null;
let MANAGER_WORLD        = null;
let MANAGER_ENTITY       = null;
//var MANAGER_MULTIPLAYER  = null;
let MANAGER_SHADER       = null;
let MANAGER_RENDERER     = null;
let MANAGER_INPUT        = null;
*/

let $_QE = null;

function $_CQE() {
    this.__init__();
}


$_CQE.prototype = {

    __init__: function() {
        this.client = this.get_client();
        console.log('Quasar Engine created!');
    },

};


// Engine starts here!
window.onload = function() {
    $_QE = new $_CQE();

    /*
    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }
    */
};
