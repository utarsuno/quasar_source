'use strict';

function LoginWorld() {
    this.__init__();
}

LoginWorld.prototype = {

    __init__: function() {
        // Inherit.
        World.call(this);
        WorldState.call(this, new THREE.Vector3(0, 200, 0), new THREE.Vector3(400, 200, 430), this.custom_world_enter.bind(this), this.custom_world_exit.bind(this));
        WorldInput.call(this);
    },

    custom_world_enter: function() {
        if (CURRENT_CLIENT.get_cookie(COOKIE_SHOULD_REMEMBER_USERNAME)) {
            this.remember_username.set_checked_state(true);
            if (CURRENT_CLIENT.has_cookie(COOKIE_REMEMBERED_USERNAME)) {
                this.input_username_login.update_text(CURRENT_CLIENT.get_cookie(COOKIE_REMEMBERED_USERNAME));
            }
        }

        this.quasar_source_title.refresh_position_and_look_at();
        this.wall_login.refresh_position_and_look_at();
        this.wall_create_account.refresh_position_and_look_at();
    },

    custom_world_exit: function() {
        //this.login_wall.clear_inputs();
        //this.wall_create_account.clear_inputs();
    },

    /*     __   __                  __  ___    __
     |    /  \ / _` | |\ |     /\  /  `  |  | /  \ |\ |
     |___ \__/ \__> | | \|    /~~\ \__,  |  | \__/ | \| */
    login_button_pressed: function() {
        this.server_request_login.set_username(this.input_username_login.get_text());
        this.server_request_login.set_password(this.input_password_login.get_text());
        this.server_request_login.perform_request();
    },

    login_success: function() {
        if (this.remember_username.is_checked()) {
            CURRENT_CLIENT.set_cookie(COOKIE_REMEMBERED_USERNAME, this.input_username_login.get_text());
        }
    },

    /*__   __   ___      ___  ___          __   __   __            ___          __  ___    __
     /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |      /\  /  `  |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |     /~~\ \__,  |  | \__/ | \| */
    create_account_button_pressed: function() {
        this.server_request_create_account.set_username(this.input_username_create.get_text());
        this.server_request_create_account.set_password(this.input_password_create.get_text());
        this.server_request_create_account.set_email(this.input_email_create.get_text());
        this.server_request_create_account.perform_request();
    },

    create_account_success: function() {

    },

    /*__   ___        ___        __   ___  __           __   ___  __                   ___     __   __   ___  __   __   ___  __
     |__) |__   |\/| |__   |\/| |__) |__  |__)    |  | /__` |__  |__) |\ |  /\   |\/| |__     |__) |__) |__  /__` /__` |__  |  \
     |  \ |___  |  | |___  |  | |__) |___ |  \    \__/ .__/ |___ |  \ | \| /~~\  |  | |___    |    |  \ |___ .__/ .__/ |___ |__/ */
    remember_username_pressed: function(is_checked) {
        CURRENT_CLIENT.set_cookie(COOKIE_SHOULD_REMEMBER_USERNAME, is_checked);
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this._create_quasar_title();
        this._create_login_wall();
        this._create_create_account_wall();
        this._create_server_requests();
    },

    _create_server_requests: function() {
        this.server_request_login = new ServerRequestLogin();
        this.server_request_login.bind_to_button(this.button_login);
        this.server_request_login.bind_success_event(this.login_success.bind(this));

        this.server_request_create_account = new ServerRequestCreateAccount();
        this.server_request_create_account.bind_to_button(this.button_create_account);
        this.server_request_create_account.bind_success_event(this.create_account_success.bind(this));
    },

    _create_quasar_title: function() {
        this.quasar_source_title = new FloatingText3D(this, 128, 'Quasar Source');
        this.quasar_source_title.set_position(1200, 400, 400);
        this.quasar_source_title.look_at_origin(false);
    },

    _create_create_account_wall: function() {
        var wall_create_account_position = new THREE.Vector3(200, 95, 600);
        var wall_create_account_normal = new THREE.Vector3(-wall_create_account_position.x, 0, -wall_create_account_position.z);
        this.wall_create_account = new FloatingWall(350, 95, wall_create_account_position, wall_create_account_normal, this);
        this.wall_create_account.make_base_wall_invisible();

        // Title.
        var row = this.wall_create_account.add_row(-1);
        row.add_text_3D([HALF, null, true], 32, 'Create Account', true);

        // Username.
        row = this.wall_create_account.add_row();
        this.input_username_create = row.add_input_2D([0, 1, false], 16);
        this.input_username_create.add_syntax(TEXT_SYNTAX_USERNAME);
        this.input_username_create.add_label_left('username:');

        // Email.
        row = this.wall_create_account.add_row();
        this.input_email_create = row.add_input_2D([0, 1, false], 16);
        this.input_email_create.add_syntax(TEXT_SYNTAX_EMAIL);
        this.input_email_create.add_label_left('email:');

        // Password.
        row = this.wall_create_account.add_row();
        this.input_password_create = row.add_input_2D([0, 1, false], 16);
        this.input_password_create.add_syntax(TEXT_SYNTAX_REPEAT_PASSWORD);
        this.input_password_create.add_label_left('password:');

        // Repeat Password.
        row = this.wall_create_account.add_row();
        this.input_repeat_password_create = row.add_input_2D([0, 1, false], 16);
        this.input_repeat_password_create.add_syntax(TEXT_SYNTAX_REPEAT_PASSWORD);
        this.input_repeat_password_create.add_label_left('repeat password:');

        // Create account button.
        row = this.wall_create_account.add_row();
        this.button_create_account = row.add_button([ONE_FOURTH, THREE_FOURTHS, true], 16, 'create account', this.create_account_button_pressed.bind(this));

        // Connect the elements together as a form.
        this.form_create_account = new FormManager([this.input_username_create, this.input_email_create, this.input_password_create, this.input_repeat_password_create], this.button_create_account);
    },

    _create_login_wall: function() {
        var login_wall_position = new THREE.Vector3(550, 95, 300);
        var login_wall_normal = new THREE.Vector3(-login_wall_position.x, 0, -login_wall_position.z);
        this.wall_login = new FloatingWall(200, 95, login_wall_position, login_wall_normal, this);
        this.wall_login.make_base_wall_invisible();

        // Title.
        var row = this.wall_login.add_row(-1);
        row.add_text_3D([HALF, null, true], 32, 'Login', true);

        // Username.
        row = this.wall_login.add_row();
        this.input_username_login = row.add_input_2D([0, 1, false], 16);
        this.input_username_login.add_syntax(TEXT_SYNTAX_USERNAME);
        this.input_username_login.add_label_left('username:');

        // Password.
        row = this.wall_login.add_row();
        this.input_password_login = row.add_input_2D([0, 1, false], 16);
        this.input_password_login.add_syntax(TEXT_SYNTAX_PASSWORD);
        this.input_password_login.add_label_left('password:');

        // Remember username.
        row = this.wall_login.add_row();
        this.remember_username = row.add_checkbox([0, null, false], 16, false, this.remember_username_pressed.bind(this));
        this.remember_username.add_label_left('remember username:');

        // Login button.
        row = this.wall_login.add_row();
        this.button_login = row.add_button([ONE_FOURTH, THREE_FOURTHS, true], 16, 'login', this.login_button_pressed.bind(this));

        // Connect the elements together as a form.
        this.form_login = new FormManager([this.input_username_login, this.input_password_login], this.button_login);
    }
};