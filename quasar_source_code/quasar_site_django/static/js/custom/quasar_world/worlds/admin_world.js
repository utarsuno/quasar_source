'use strict';

function Account(account_name, account_type, floating_wall) {
    this.__init__(account_name, account_type, floating_wall);
}

Account.prototype = {
    __init__: function(account_name, account_type, floating_wall) {
        this.account_name = account_name;
        this.account_type = account_type;
        this.floating_wall = floating_wall;

        this.button = null;
    },

    set_button: function(b) {
        this.button = b;
    },

    is_listed_on_floating_wall: function() {
        if (!is_defined(this.floating_wall)) {
            return false;
        }
        for (var f = 0; f < this.floating_wall._2D_rows.length; f++) {
            // 3 is the index of the floating_2D_text
            if (this.floating_wall._2D_rows[f][3].get_text() === this.account_name) {
                return true;
            }
        }
        return false;
    }
};

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

        this.wall_all_accounts.add_row_2D_text([0, ONE_THIRD], 2, 'Name', TYPE_CONSTANT);
        this.wall_all_accounts.add_row_2D_text([ONE_THIRD, TWO_THIRDS], 2, 'Type', TYPE_CONSTANT);
        this.wall_all_accounts.add_row_2D_text([TWO_THIRDS, 1], 2, 'Actions', TYPE_CONSTANT);

        //this.wall_all_accounts.add_row_2D_text(row, text, type, sc, c)

        this.wall_all_accounts.refresh_position_and_look_at();

        this.accounts = [];
        this.number_of_accounts_listed = 0;

        // Account actions list.
        this.wall_account_actions = new FloatingWall(200, 300, null, null, this, false);
        this.wall_account_actions.add_close_button();
        this.wall_account_actions.add_row_3D_text(false, -1, 'Account Actions', TYPE_TITLE);

        // TODO : Add the actions here
        this.wall_account_actions.add_row_2D_text([0, 1], 1, 'Set to Verified', TYPE_BUTTON);
        this.wall_account_actions.add_row_2D_text([0, 1], 2, 'Delete Account', TYPE_BUTTON);

        this.wall_account_actions.set_attachment_depth_offset(5);
        this.wall_account_actions.hide_self_and_all_child_attachments_recursively();
    },

    _load_all_accounts_action: function() {
        var data = {};
        data[ENTITY_PROPERTY_USERNAME]      = ENTITY_OWNER.get_username();
        data[ENTITY_PROPERTY_PASSWORD]      = ENTITY_OWNER.get_password();
        data[SERVER_COMMAND_SUDO_OPERATION] = SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION;
        data[POST_KEY_GENERIC_DATA]         = 'not_needed';
        this.post_get_all_accounts_information.perform_post(data, this._all_accounts_information_result.bind(this));
    },

    _all_accounts_information_result: function(result) {
        var all_accounts = result.split('-');
        for (var a = 0; a < all_accounts.length; a++) {
            var account_data = all_accounts[a].split('+');
            if (is_defined(account_data[0] && is_defined(account_data[1]))) {
                if (account_data[0] !== '') {
                    if (!this._have_account(account_data[0])) {
                        this.accounts.push(new Account(account_data[0], account_data[1], this.floating_wall));
                    }
                }
            }
        }

        this._refresh_account_list();
    },

    _refresh_account_list: function() {
        var account_added_or_removed = false;

        for (var a = 0; a < this.accounts.length; a++) {
            if (!this.accounts[a].is_listed_on_floating_wall()) {
                this.wall_all_accounts.add_row_2D_text([0, ONE_THIRD], 3 + this.number_of_accounts_listed, this.accounts[a].account_name, TYPE_CONSTANT);
                this.wall_all_accounts.add_row_2D_text([ONE_THIRD, TWO_THIRDS], 3 + this.number_of_accounts_listed, this.accounts[a].account_type, TYPE_CONSTANT);
                var perform_account_actions_button =  this.wall_all_accounts.add_row_2D_text([TWO_THIRDS, 1], 3 + this.number_of_accounts_listed, 'actions', TYPE_BUTTON);
                perform_account_actions_button.set_engage_function(this._perform_account_actions_button_pressed.bind(this, this.accounts[a]));

                this.accounts[a].set_button(perform_account_actions_button);

                this.number_of_accounts_listed += 1;

                account_added_or_removed = true;
            }
        }

        if (account_added_or_removed) {
            this.wall_all_accounts.refresh_position_and_look_at();
        }
    },

    _have_account: function(account_name) {
        for (var a = 0; a < this.accounts.length; a++) {
            if (this.accounts[a].account_name === account_name) {
                return true;
            }
        }
        return false;
    },

    _perform_account_actions_button_pressed: function(account) {
        l('TODO : Perform account actions!');
        if (this.wall_account_actions.is_attached()) {
            this.wall_account_actions.detach_from_parent();
        }

        this.wall_account_actions.attach_to(account.button);

        this.wall_account_actions.refresh_position_and_look_at();
        this.wall_account_actions.display_self_and_all_child_attachments_recursively();
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


// utarsuno+sudo-aaaa+not_verified-bbbb+not_verified-Ryan+not_verified-cccc+not_verified-zzzz+not_verified-
