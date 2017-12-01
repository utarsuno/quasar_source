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
    login_username_character_change: function() {

    },

    login_button_clicked: function() {
        var error = false;
        var error_message = '';

        var login_username_text = this.login_username.get_input_text();
        var login_password_text = this.login_password.get_input_text();

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
            this.post_login.perform_post(data, this.login_button_event.bind(this));
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + error_message);
        }
    },

    login_button_event: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            GUI_TYPING_INTERFACE.add_server_message('Logged in!');
            if (this.remember_username_checkbox.checked) {
                MANAGER_COOKIES.set(COOKIE_REMEMBERED_USERNAME, this.attempted_username);
            }
            CURRENT_PLAYER.login(this.attempted_username, this.attempted_password);
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + data);
        }
    },

    create_account_button_clicked: function() {
        var error = false;
        var error_message = '';

        // TODO : Eventually make input parsing live for the user.
        var email_text = this.create_email.get_input_text();
        var username_text = this.create_username.get_input_text();
        var password_text = this.create_password.get_input_text();

        this.attempted_password = this.create_password.get_input_text();

        var password_repeat_text = this.create_repeat_password.get_input_text();

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
            this.attempted_username = this.create_username.get_input_text();
            this.attempted_password = this.create_password.get_input_text();
            var local_data = {};
            local_data[ENTITY_PROPERTY_USERNAME] = this.attempted_username;
            local_data[ENTITY_PROPERTY_PASSWORD] = this.attempted_password;
            this.post_login.perform_post(local_data, this.login_button_event.bind(this));
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + data);
        }
    },

    remember_username_clicked: function() {
        this.remember_username_checkbox.toggle();
        if (this.remember_username_checkbox.status()) {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'true');
        } else {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'false');
        }
    },

    __init__: function() {
        this.post_create_account = new PostHelper(POST_URL_CREATE_ACCOUNT);
        this.post_login          = new PostHelper(POST_URL_LOGIN);

        // Inherit from World.
        World.call(this, 'LoginWorld');


        var login_wall_width = 500;
        var login_wall_height = 400;
        var login_wall_position = new THREE.Vector3(650, 400, 300);
        var login_wall_look_at = new THREE.Vector3(0, 400, 0);
        var login_wall_normal = new THREE.Vector3(login_wall_look_at.x - login_wall_position.x, login_wall_look_at.y - login_wall_position.y, login_wall_look_at.z - login_wall_position.z);
        login_wall_normal.normalize();

        this.login_wall = new FloatingWall(login_wall_width, login_wall_height, login_wall_position, login_wall_normal, this);
        this.login_button = this.login_wall.add_floating_2d_text(login_wall_width, 'login', TYPE_BUTTON, 0, 2, 10, 0);
        this.login_username_label = this.login_wall.add_floating_2d_text(login_wall_width / 4, 'username', TYPE_CONSTANT_TEXT, 0, 2, 1, 0);
        this.login_username_input = this.login_wall.add_floating_2d_text(login_wall_width * (3 / 2), '', TYPE_INPUT_REGULAR, login_wall_width / 2, 2, 1, 0);
        /*

        var edit_entity_save_changes_button = this.current_entity_editor.add_floating_2d_text(512, 'save changes', TYPE_BUTTON, 0, 2, key_values.length + 1, 0);

        this.delete_entity_wall_button = new Floating2DText(this.width, 'Delete Entity Wall', TYPE_BUTTON, this.scene, COLOR_TEXT_RED);
        this.delete_entity_wall_button.update_position_and_look_at(this.get_position_for_row(0, this.title.height - this.height, 0, 1), this.get_look_at_for_row(0, this.title.height - this.height, 0, 1));
        this.delete_entity_wall_button.set_engage_function(this.delete_entity_wall_pressed.bind(this));

         */

        //this.login_wall.add_


        var wall_create_account_width = 500;
        var wall_create_account_height = 400;
        var wall_create_account_position = new THREE.Vector3(300, 400, 650);
        var wall_create_account_look_at = new THREE.Vector3(0, 400, 0);
        var wall_create_account_normal = new THREE.Vector3(wall_create_account_look_at.x - wall_create_account_position.x, wall_create_account_look_at.y - wall_create_account_position.y, wall_create_account_look_at.z - wall_create_account_position.z);
        wall_create_account_normal.normalize();

        this.wall_create_account = new FloatingWall(wall_create_account_width, wall_create_account_height, wall_create_account_position, wall_create_account_normal, this);
        /*

        const LOGIN_X = 0;

        // LOGIN_BELOW

        var login_width = 150;

        this.login_title = new Floating3DText(login_width, 'Login', TYPE_TITLE, this.scene);
        this.login_title.update_position_and_look_at(new THREE.Vector3(LOGIN_X, 200 + global_y_offset, 40), new THREE.Vector3(LOGIN_X, 200 + global_y_offset, 55));

        this.login_username = new Floating2DText(login_width, 'Username :', TYPE_INPUT_REGULAR, this.scene);
        this.login_username.update_position(0, 100 + global_y_offset, 45);

        this.login_password = new Floating2DText(login_width, 'Password :', TYPE_INPUT_PASSWORD, this.scene);
        this.login_password.update_position(0, 75 + global_y_offset, 45);

        var remember_me_width = 75;
        this.remember_username_text = new Floating2DText(remember_me_width, 'remember me c:', TYPE_INPUT_REGULAR, this.scene);
        this.remember_username_text.update_position_and_look_at(new THREE.Vector3(remember_me_width / 2, 50 + global_y_offset, 45), new THREE.Vector3(remember_me_width / 2, 50 + global_y_offset, 45));
        this.remember_username_checkbox = new CheckBox(true, this.scene);
        this.remember_username_checkbox.update_position_and_look_at(new THREE.Vector3(150 - 16 / 2, 50 + global_y_offset, 45), new THREE.Vector3(150 - 16 / 2, 50 + global_y_offset, 45));

        this.remember_username_checkbox.floating_2d_text.set_engage_function(this.remember_username_clicked.bind(this));

        this.login_button = new Floating2DText(login_width, 'Login', TYPE_BUTTON, this.scene);
        this.login_button.update_position_and_look_at(new THREE.Vector3(login_width / 2, 25 + global_y_offset, 45), new THREE.Vector3(login_width / 2, 25 + global_y_offset, 55));
        this.login_button.set_engage_function(this.login_button_clicked.bind(this));

        // CREATE ACCOUNT BELOW

        var create_width = 150;

        this.create_account_title = new Floating3DText(create_width, 'Create\nAccount', TYPE_TITLE, this.scene);
        this.create_account_title.update_position_and_look_at(new THREE.Vector3(200, 225 + global_y_offset, 40), new THREE.Vector3(200, 225 + global_y_offset, 55));

        this.create_username = new Floating2DText(create_width, 'Username :', TYPE_INPUT_REGULAR, this.scene);
        this.create_username.update_position(200, 100 + global_y_offset, 45);

        if (!is_defined(MANAGER_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME))) {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, this.remember_username_checkbox.status());
        }

        this.create_email = new Floating2DText(create_width, 'Email :', TYPE_INPUT_REGULAR, this.scene);
        this.create_email.update_position(200, 75 + global_y_offset, 45);

        this.create_password = new Floating2DText(create_width, 'Password :', TYPE_INPUT_PASSWORD, this.scene);
        this.create_password.update_position(200, 50 + global_y_offset, 45);

        this.create_repeat_password = new Floating2DText(create_width, 'Repeat Password :', TYPE_INPUT_PASSWORD, this.scene);
        this.create_repeat_password.update_position(200, 25 + global_y_offset, 45);

        this.create_account_button = new Floating2DText(create_width, 'Create Account', TYPE_BUTTON, this.scene);
        this.create_account_button.update_position_and_look_at(new THREE.Vector3(200 + create_width / 2, global_y_offset, 45), new THREE.Vector3(200 + create_width / 2, global_y_offset, 46));

        this.create_account_button.set_engage_function(this.create_account_button_clicked.bind(this));

        // Quasar Source title
        // TODO :
        //this.quasar_source_title = new Floating3DText()

        this.interactive_objects = [
            this.login_button,
            this.create_account_button,
            this.login_username.floating_input,
            this.login_password.floating_input,
            this.create_username.floating_input,
            this.create_email.floating_input,
            this.create_password.floating_input,
            this.create_repeat_password.floating_input,
            this.remember_username_checkbox.floating_2d_text
        ];

        // Set the tab targets.
        this.login_username.floating_input.set_next_tab_target(this.login_password.floating_input);
        this.login_password.floating_input.set_next_tab_target(this.remember_username_checkbox.floating_2d_text);
        this.remember_username_checkbox.floating_2d_text.set_next_tab_target(this.login_button);
        this.login_button.set_next_tab_target(this.create_username.floating_input);
        this.create_username.floating_input.set_next_tab_target(this.create_email.floating_input);
        this.create_email.floating_input.set_next_tab_target(this.create_password.floating_input);
        this.create_password.floating_input.set_next_tab_target(this.create_repeat_password.floating_input);
        this.create_repeat_password.floating_input.set_next_tab_target(this.create_account_button);
        this.create_account_button.set_next_tab_target(this.login_username.floating_input);

        this.set_default_tab_target(this.login_username.floating_input);

        */
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

        CURRENT_PLAYER.set_position(new THREE.Vector3(-100, 500, -100));
        CURRENT_PLAYER.look_at(new THREE.Vector3(0.670, 0, 0.742));

        if (MANAGER_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME) === 'true') {
            if (MANAGER_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== undefined) {
                if (MANAGER_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== 'undefined') {
                    this.login_username.set_input_value(MANAGER_COOKIES.get(COOKIE_REMEMBERED_USERNAME));
                }
            }
        }
    },

    exit_world: function() {
        this.login_username.floating_input.update_text('');
        this.login_password.floating_input.update_text('');
        this.create_username.floating_input.update_text('');
        this.create_email.floating_input.update_text('');
        this.create_password.floating_input.update_text('');
        this.create_repeat_password.floating_input.update_text('');
    }
};