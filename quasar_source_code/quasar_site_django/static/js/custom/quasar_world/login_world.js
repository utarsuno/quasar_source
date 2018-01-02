'use strict';

function LoginWorld() {
    this.__init__();
}

LoginWorld.prototype = {

    // Create account fields.
    create_username: null,

    // Post calls.
    post_create_account   : null,
    post_login            : null,

    //
    current_world: null,

    //
    attempted_username: null,
    attempted_password: null,

    /*             ___     __           ___
      |    | \  / |__     /__` \ / |\ |  |   /\  \_/    .
      |___ |  \/  |___    .__/  |  | \|  |  /~~\ / \    .*/
    _text_error_check: function(field, text) {
        for (var key in this.current_login_errors) {
            if (this.current_login_errors.hasOwnProperty(key)) {
                field[field] = text;
            }
        }

        l('----');
        l(text);
        l(field);
        l('--');
        if (text.length < 3) {
            l('Error text needed!');
            this.login_wall_errors.update_text(field + ' can not be less than 4 characters!');
        } else {
            delete this.current_login_errors[field];
        }
    },

    login_button_pressed: function() {
        var error = false;
        var error_message = '';

        var login_username_text = this.login_username_input.get_text();
        var login_password_text = this.login_password_input.get_text();

        // TODO : Create a class to handle this kind of logic.

        if (login_username_text.length < 4) {
            error = true;
            error_message = 'Username must be at least 4 characters.';
        }
        if (!error) {
            if (login_password_text.length < 4) {
                error = true;
                error_message = 'Passwords are at least 4 characters!';
            }
        }

        if (!error) {
            GUI_TYPING_INTERFACE.add_server_message('Sending login request to server...');
            this.attempted_username = login_username_text;
            this.attempted_password = login_password_text;
            var data = {};
            data[ENTITY_PROPERTY_USERNAME] = login_username_text;
            data[ENTITY_PROPERTY_PASSWORD] = login_password_text;
            this.post_login.perform_post(data, this.perform_login_request.bind(this));
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + error_message);
        }
    },

    perform_login_request: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            GUI_TYPING_INTERFACE.add_server_message('Logged in!');
            //if (this.remember_username_checkbox.checked) {
            //    MANAGER_COOKIES.set(COOKIE_REMEMBERED_USERNAME, this.attempted_username);
            //}
            CURRENT_PLAYER.login(this.attempted_username, this.attempted_password);
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + data);
        }
    },

    create_account_button_pressed: function() {
        var error = false;
        var error_message = '';

        // TODO : Eventually make input parsing live for the user.
        var email_text = this.create_account_email_input.get_text();
        var username_text = this.create_account_username_input.get_text();
        var password_text = this.create_account_password_input.get_text();
        var password_repeat_text = this.create_account_password_repeat_input.get_text();

        if (!is_email_valid(email_text)) {
            error = true;
            error_message = 'invalid email format';
        }
        if (!error) {
            if (username_text.length < 4) {
                error = true;
                error_message = 'username text length < 4';
            }
        }
        if (!error) {
            if (password_text.length < 4 || password_text !== password_repeat_text) {
                error = true;
                if (password_text.length < 4) {
                    error_message = 'password length < 4';
                } else {
                    error_message = 'passwords do not match';
                }
            }
        }

        if (!error) {
            GUI_TYPING_INTERFACE.add_server_message('Sending create account request to server...');
            var data = {};
            data[ENTITY_PROPERTY_USERNAME] = username_text;
            data[ENTITY_PROPERTY_PASSWORD] = password_text;
            data[ENTITY_PROPERTY_EMAIL]    = email_text;
            this.post_create_account.perform_post(data, this.create_account_button_event.bind(this));
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + error_message);
        }
    },

    create_account_button_event: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            // Auto-login for successful account creations.
            GUI_TYPING_INTERFACE.add_server_message('Account created! Now sending login request to server!');
            this.attempted_username = this.create_account_username_input.get_text();
            this.attempted_password = this.create_account_password_input.get_text();
            var local_data = {};
            local_data[ENTITY_PROPERTY_USERNAME] = this.attempted_username;
            local_data[ENTITY_PROPERTY_PASSWORD] = this.attempted_password;
            this.post_login.perform_post(local_data, this.perform_login_request.bind(this));
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + data);
        }
    },

    remember_username_pressed: function() {
        this.remember_username_checkbox.toggle();
        if (this.remember_username_checkbox.status()) {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'true');
        } else {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'false');
        }
    },

    __init__: function() {
        this.current_login_errors = {};

        this.post_create_account = new PostHelper(POST_URL_CREATE_ACCOUNT);
        this.post_login          = new PostHelper(POST_URL_LOGIN);

        // Inherit from World.
        World.call(this, 'LoginWorld');

        // Quasar Source title.
        var quasar_source_title_position = new THREE.Vector3(1200, 400, 400);
        this.quasar_source_title = new Floating3DText('Quasar Source', TYPE_SUPER_TITLE, this.scene);
        this.quasar_source_title.update_position_and_look_at_origin(quasar_source_title_position);

        /*        __   __
            |    /  \ / _` | |\ |    |  |  /\  |    |
            |___ \__/ \__> | | \|    |/\| /~~\ |___ |___ */
        this.login_errors = {};

        var login_wall_width = 350;
        var login_wall_height = 90;
        var login_wall_position = new THREE.Vector3(600, login_wall_height, 350);
        var login_wall_look_at = new THREE.Vector3(0, login_wall_height, 0);
        var login_wall_normal = new THREE.Vector3(login_wall_look_at.x - login_wall_position.x, login_wall_look_at.y - login_wall_position.y, login_wall_look_at.z - login_wall_position.z);

        this.login_wall = new FloatingWall(login_wall_width, login_wall_height, login_wall_position, login_wall_normal, this, false);
        this.login_wall.add_3D_title('Login', TYPE_TITLE_CONSTANT, null, 2);
        this.login_wall_errors = this.login_wall.add_3D_title('!', TYPE_CONSTANT_TEXT, COLOR_RED, 1, TEXT_FORMAT_LEFT);
        this.login_wall_errors.update_text('');

        this.login_username_label = this.login_wall.add_floating_2d_text(0, 1 / 3, 'username', TYPE_CONSTANT_TEXT, 0);
        this.login_username_input = this.login_wall.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_REGULAR, 0);
        this.login_username_input.set_syntax_type(TEXT_SYNTAX_FOUR_MINIMUM);
        this.login_username_input.set_value_changed_function(this._text_error_check.bind(this, this.login_username_input));

        this.login_password_label = this.login_wall.add_floating_2d_text(0, 1 / 3, 'password', TYPE_CONSTANT_TEXT, 1);
        this.login_password_input = this.login_wall.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_PASSWORD, 1);
        this.login_password_input.set_syntax_type(TEXT_SYNTAX_PASSWORD);
        this.login_password_input.set_value_changed_function(this._text_error_check.bind(this, this.login_password_input));

        // TODO :
        //this.login_remember_username_label = this.login_wall.add_floating_2d_text(login_wall_width / 2, 'remember username', TYPE_CONSTANT_TEXT, 0, 2, 2, 0);
        //this.login_remember_username_checkbox = this.login_wall.add_floating_2d_text(16, '', TYPE_CHECK_BOX, login_wall_width / 2 + 10, 2, 2, 0);

        this.login_button = this.login_wall.add_floating_2d_text(.25, .75, 'login', TYPE_BUTTON, 3);
        this.login_button.set_engage_function(this.login_button_pressed.bind(this));
        this.login_button.disable();

        /*   __   __   ___      ___  ___          __   __   __            ___
            /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |     |  |  /\  |    |
            \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |     |/\| /~~\ |___ |___  */
        this.create_errors = {};

        var wall_create_account_width = 350;
        var wall_create_account_height = 90;
        var wall_create_account_position = new THREE.Vector3(350, wall_create_account_height, 600);
        var wall_create_account_look_at = new THREE.Vector3(0, wall_create_account_height, 0);
        var wall_create_account_normal = new THREE.Vector3(wall_create_account_look_at.x - wall_create_account_position.x, wall_create_account_look_at.y - wall_create_account_position.y, wall_create_account_look_at.z - wall_create_account_position.z);

        this.wall_create_account = new FloatingWall(wall_create_account_width, wall_create_account_height, wall_create_account_position, wall_create_account_normal, this, false);
        this.wall_create_account.add_3D_title('Create Account', TYPE_TITLE_CONSTANT, null, 3);

        this.create_account_username_label = this.wall_create_account.add_floating_2d_text(0, 1 / 3, 'username', TYPE_CONSTANT_TEXT, 0);
        this.create_account_username_input = this.wall_create_account.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_REGULAR, 0);
        this.create_account_username_input.set_syntax_type(TEXT_SYNTAX_FOUR_MINIMUM);
        this.create_account_username_input.set_value_changed_function(this._text_error_check.bind(this, this.create_account_username_input));

        this.create_account_email_label = this.wall_create_account.add_floating_2d_text(0, 1 / 3, 'email', TYPE_CONSTANT_TEXT, 1);
        this.create_account_email_input = this.wall_create_account.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_REGULAR, 1);
        this.create_account_email_input.set_syntax_type(TEXT_SYNTAX_EMAIL);
        this.create_account_email_input.set_value_changed_function(this._text_error_check.bind(this, this.create_account_email_input));

        this.create_account_password_label = this.wall_create_account.add_floating_2d_text(0, 1 / 3, 'password', TYPE_CONSTANT_TEXT, 2);
        this.create_account_password_input = this.wall_create_account.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_PASSWORD, 2);
        this.create_account_password_input.set_syntax_type(TEXT_SYNTAX_PASSWORD);
        this.create_account_password_input.set_value_changed_function(this._text_error_check.bind(this, this.create_account_password_input));

        this.create_account_password_repeat_label = this.wall_create_account.add_floating_2d_text(0, 1 / 3, 'repeat password', TYPE_CONSTANT_TEXT, 3);
        this.create_account_password_repeat_input = this.wall_create_account.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_PASSWORD, 3);
        this.create_account_password_repeat_input.set_syntax_type(TEXT_SYNTAX_PASSWORD);
        this.create_account_password_repeat_input.set_value_changed_function(this._text_error_check.bind(this, this.create_account_password_repeat_input));

        this.create_account_button = this.wall_create_account.add_floating_2d_text(.25, .75, 'create account', TYPE_BUTTON, 5);
        this.create_account_button.set_engage_function(this.create_account_button_pressed.bind(this));
        this.create_account_button.disable();

        this.set_default_tab_target(this.login_username_input);
        this.login_username_input.set_next_tab_target(this.login_password_input);
        this.login_password_input.set_next_tab_target(this.login_button);
        this.login_button.set_next_tab_target(this.create_account_username_input);
        this.create_account_username_input.set_next_tab_target(this.create_account_email_input);
        this.create_account_email_input.set_next_tab_target(this.create_account_password_input);
        this.create_account_password_input.set_next_tab_target(this.create_account_password_repeat_input);
        this.create_account_password_repeat_input.set_next_tab_target(this.create_account_button);
        this.create_account_button.set_next_tab_target(this.login_username_input);
    },

    update: function() {
        this.update_interactive_objects();
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event);
    },

    enter_world: function() {
        CURRENT_PLAYER.disengage();
        if (!GUI_PAUSED_MENU.currently_displayed) {
            CURRENT_PLAYER.enable_controls();
        }

        CURRENT_PLAYER.set_position_xyz(0, 200, 0);
        CURRENT_PLAYER.look_at(new THREE.Vector3(400, 200, 430));

        if (MANAGER_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME) === 'true') {
            if (MANAGER_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== undefined) {
                if (MANAGER_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== 'undefined') {
                    this.login_username_input.update_text(MANAGER_COOKIES.get(COOKIE_REMEMBERED_USERNAME));
                }
            }
        }
    },

    exit_world: function() {
        this.login_wall.clear_inputs();
        this.wall_create_account.clear_inputs();
    }
};