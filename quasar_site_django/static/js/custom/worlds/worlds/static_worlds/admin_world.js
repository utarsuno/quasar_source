'use strict';

function Account(account_name, account_type) {
    this.__init__(account_name, account_type);
}

Account.prototype = {
    __init__: function(account_name, account_type) {
        this.account_name = account_name;
        this.account_type = account_type;
    },

    set_action_button: function(b) {
        this.action_button = b;
    }
};

function AdminWorld(static_world_entity) {
    this.__init__(static_world_entity);
}

AdminWorld.prototype = {

    __init__: function (static_world_entity) {
        // Inherit.
        World.call(this, static_world_entity);
        // Inherit.
        WorldInput.call(this);
    },

    _perform_account_actions_button_pressed: function(account) {
        if (this.wall_account_actions.is_attached()) {
            this.wall_account_actions.detach_from_parent();
        }
        this.wall_account_actions.attach_to(account.action_button);
        this._current_account = account;

        this.wall_account_actions.refresh_position_and_look_at();
        this.wall_account_actions.display_self_and_all_child_attachments_recursively();
        this.wall_all_accounts.refresh_position_and_look_at();
    },

    /*__        __   __      __   __                         __   __
     /__` |  | |  \ /  \    /  ` /  \  |\/|  |\/|  /\  |\ | |  \ /__`
     .__/ \__/ |__/ \__/    \__, \__/  |  |  |  | /~~\ | \| |__/ .__/ */
    _get_sudo_command_post_data_start: function() {
        var data = {};
        data[ENTITY_PROPERTY_USERNAME] = ENTITY_OWNER.get_username();
        data[ENTITY_PROPERTY_PASSWORD] = ENTITY_OWNER.get_password();
        return data;
    },

    _delete_account_button_pressed: function() {
        var data = this._get_sudo_command_post_data_start();
        data[SERVER_COMMAND_SUDO_OPERATION] = SERVER_COMMAND_DELETE_ENTITY_OWNER;
        data[POST_KEY_GENERIC_DATA] = this._current_account.account_name;
        this.post_delete_account.perform_post(data, this._delete_account_result.bind(this));
    },

    _delete_account_result: function(result) {
        if (result === SERVER_REPLY_GENERIC_YES) {
            GUI_TYPING_INTERFACE.add_server_message('Account deleted!');
            if (this.wall_account_actions.is_attached()) {
                this.wall_account_actions.detach_from_parent();
            }
            this.wall_account_actions.hide_self_and_all_child_attachments_recursively();

            this.wall_all_accounts.delete_row_by_name(this._current_account.account_name);
            var account_to_remove_index = -1;
            var a;
            for (a = 0; a < this.accounts.length; a++) {
                if (this.accounts[a].account_name === this._current_account.account_name) {
                    account_to_remove_index = a;
                    break;
                }
            }
            if (account_to_remove_index !== NOT_FOUND) {
                this.accounts.splice(account_to_remove_index, 1);
            }
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error deleting account!');
            GUI_TYPING_INTERFACE.add_server_message(result);
        }
    },

    _load_all_accounts_action: function() {
        var data = this._get_sudo_command_post_data_start();
        data[SERVER_COMMAND_SUDO_OPERATION] = SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION;
        data[POST_KEY_GENERIC_DATA] = 'not_needed';
        this.post_get_all_accounts_information.perform_post(data, this._all_accounts_information_result.bind(this));
    },

    _all_accounts_information_result: function(result) {
        var all_accounts = result.split('-');
        for (var a = 0; a < all_accounts.length; a++) {
            var account_data = all_accounts[a].split('+');
            if (is_defined(account_data[0] && is_defined(account_data[1]))) {
                if (account_data[0] !== '') {

                    var account_name = account_data[0];
                    var account_type = account_data[1];

                    if (!this.wall_all_accounts.has_row_with_name(account_data[0])) {
                        var account_row = this.wall_all_accounts.add_row(null, account_name);
                        account_row.add_2D_element([0, ONE_THIRD], account_name, TYPE_CONSTANT);
                        account_row.add_2D_element([ONE_THIRD, TWO_THIRDS], account_type, TYPE_CONSTANT);

                        var account = new Account(account_name, account_type);
                        this.accounts.push(account);
                        var account_actions_button = account_row.add_2D_button([TWO_THIRDS, 1], 'actions', null, this._perform_account_actions_button_pressed.bind(this, account));
                        account.set_action_button(account_actions_button);

                        this.wall_all_accounts.refresh_position_and_look_at();

                    }
                }
            }
        }
    },

    /*     __        __   __      __   __   ___  __       ___    __        __
     |  | /  \ |    |__) |  \    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     |/\| \__/ |___ |  \ |__/    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    create: function() {
        // POST calls.
        this.post_get_all_accounts_information = new PostHelper('sudo_command');
        this.post_delete_account               = new PostHelper('sudo_command');

        this._init_all_accounts_wall();
        this._init_account_actions_wall();

        this.accounts = [];
        this._current_account = null;
    },

    _init_all_accounts_wall: function() {
        var p = new THREE.Vector3(1000, 1000, 1500);
        var n = new THREE.Vector3(-.56, 0, -.8);
        this.wall_all_accounts = new FloatingWall(500, 1000, p, n, this, false);
        this.wall_all_accounts.add_full_row_3D(-1, 'All Accounts', TYPE_TITLE, COLOR_BLUE);

        this.wall_all_accounts.add_row(0).add_2D_button([0, 1], 'Refresh Account List', COLOR_YELLOW, this._load_all_accounts_action.bind(this));

        // Add an empty row for spacing.
        this.wall_all_accounts.add_row(1);

        // Add row headers.
        var row_headers = this.wall_all_accounts.add_row(2);
        row_headers.add_2D_element([0, ONE_THIRD], 'Name', TYPE_CONSTANT);
        row_headers.add_2D_element([ONE_THIRD, TWO_THIRDS], 'Type', TYPE_CONSTANT);
        row_headers.add_2D_element([TWO_THIRDS, 1], 'Actions', TYPE_CONSTANT);

        this.wall_all_accounts.refresh_position_and_look_at();
    },

    _init_account_actions_wall: function() {
        this.wall_account_actions = new FloatingWall(200, 300, null, null, this, false, COLOR_FLOATING_WALL_HIGHLIGHT);
        this.wall_account_actions.add_close_button();
        this.wall_account_actions.add_full_row_3D(-1, 'Account Actions', TYPE_TITLE);

        this.wall_account_actions.add_row(0).add_2D_button([0, 1], 'set to verified', null, null);
        this.wall_account_actions.add_row(1).add_2D_button([0, 1], 'delete account', COLOR_RED, this._delete_account_button_pressed.bind(this));

        this.wall_account_actions.set_attachment_depth_offset(5);
        this.wall_account_actions.set_attachment_horizontal_offset(100, null);
        this.wall_account_actions.hide_self_and_all_child_attachments_recursively();
    },

    enter_world: function() {
        CURRENT_PLAYER.set_position_xyz(0, 1000, 0);
    },

    exit_world: function() {
    }
};