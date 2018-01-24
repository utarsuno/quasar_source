'use strict';

// TODO : TEMPORARY LOCATION, EVENTUALLY MOVE THIS!
const SERVER_COMMAND_SUDO_OPERATION                = 'eoo';
const SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE = 'seoat';
const SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION  = 'gaai';
const POST_KEY_GENERIC_DATA                        = 'generic_data_key';

function AdminWorld() {
    this.__init__();
}

AdminWorld.prototype = {

    __init__: function () {
        World.call(this);
    },

    create: function() {

        // POST calls.
        this.post_get_all_accounts_information = new PostHelper('sudo_command');

        var p = new THREE.Vector3(1000, 1000, 1500);
        var n = new THREE.Vector3(-.56, 0, -.8);
        this.wall_all_accounts = new FloatingWall(500, 1000, p, n, this, false);
        this.wall_all_accounts.add_row_3D_text(false, -1, 'All Accounts', TYPE_TITLE, COLOR_BLUE);

        this.button_load_all_accounts = this.wall_all_accounts.add_row_2D_text([0, 1], 0, 'Refresh/Load All Accounts', TYPE_BUTTON, null, COLOR_YELLOW);
        this.button_load_all_accounts.set_engage_function(this._load_all_accounts_action.bind(this));
    },

    _load_all_accounts_action: function() {
        var data = {};
        data[ENTITY_PROPERTY_USERNAME]      = ENTITY_OWNER.get_username();
        data[ENTITY_PROPERTY_PASSWORD]      = ENTITY_OWNER.get_password();
        data[SERVER_COMMAND_SUDO_OPERATION] = SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION;
        data[POST_KEY_GENERIC_DATA]         = 'not_needed';
        this.post_get_all_accounts_information(data, this._all_accounts_information_result.bind(this));
    },

    _all_accounts_information_result: function(result) {
        l('ALL ACCOUNTS INFORMATION RESULT');
        l(result);
    },

    enter_world: function() {
        CURRENT_PLAYER.disengage();
        if (!GUI_PAUSED_MENU.currently_displayed) {
            CURRENT_PLAYER.enable_controls();
        }
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);
    },

    exit_world: function() {
    }
};