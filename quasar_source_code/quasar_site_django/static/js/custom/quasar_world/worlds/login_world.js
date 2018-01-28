'use strict';

function LoginWorld() {
    this.__init__();
}

LoginWorld.prototype = {

    // Post calls.
    post_create_account   : null,
    post_login            : null,

    // TODO : Refactor into the EntityOwner at a later time.
    attempted_username: null,
    attempted_password: null,

    /*            ___     __           ___
     |    | \  / |__     /__` \ / |\ |  |   /\  \_/    .
     |___ |  \/  |___    .__/  |  | \|  |  /~~\ / \    .*/
    _error_check: function(error_manager) {
        error_manager.error_check();
    },

    /*     __   __
     |    /  \ / _` | |\ |
     |___ \__/ \__> | | \| */
    login_button_pressed: function() {
        // TODO : Move this logic elsewhere.
        var login_username_text = this.login_username_input.get_text();
        var login_password_text = this.login_password_input.get_text();
        GUI_TYPING_INTERFACE.add_server_message('Sending login request to server...');
        this.attempted_username = login_username_text;
        this.attempted_password = login_password_text;
        var data = {};
        data[ENTITY_PROPERTY_USERNAME] = login_username_text;
        data[ENTITY_PROPERTY_PASSWORD] = login_password_text;
        this.post_login.perform_post(data, this.perform_login_request.bind(this));
    },

    perform_login_request: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            GUI_TYPING_INTERFACE.add_server_message('Login successful!');
            //if (this.remember_username_checkbox.checked) {
            //    MANAGER_COOKIES.set(COOKIE_REMEMBERED_USERNAME, this.attempted_username);
            //}

            MANAGER_LOADING.perform_login_load(this.attempted_username, this.attempted_password);
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error : ' + data);
        }
    },

    /*__   __   ___      ___  ___          __   __   __            ___
     /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |
     \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |  */
    create_account_button_pressed: function() {
        var email_text = this.create_account_email_input.get_text();
        var username_text = this.create_account_username_input.get_text();
        var password_text = this.create_account_password_input.get_text();

        GUI_TYPING_INTERFACE.add_server_message('Sending create account request to server...');
        var data = {};
        data[ENTITY_PROPERTY_USERNAME] = username_text;
        data[ENTITY_PROPERTY_PASSWORD] = password_text;
        data[ENTITY_PROPERTY_EMAIL]    = email_text;
        this.post_create_account.perform_post(data, this.create_account_button_event.bind(this));
    },

    create_account_button_event: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            // Auto-login for successful account creations.
            GUI_TYPING_INTERFACE.add_server_message('Account created! Now sending login request to server!');
            // TODO : Have the Entity Owner take care of this logic.
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

    ///////

    remember_username_pressed: function() {
        this.remember_username_checkbox.toggle();
        if (this.remember_username_checkbox.status()) {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'true');
        } else {
            MANAGER_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'false');
        }
    },

    __init__: function() {
        // Inherit from World.
        World.call(this);
    },

    enter_world: function() {
        // TODO : Reformat this, it's not world specific so should be generalized to world_base.js
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

        this.quasar_source_title.refresh_position_and_look_at();
        this.wall_login.refresh_position_and_look_at();
        this.wall_create_account.refresh_position_and_look_at();
    },

    exit_world: function() {
        //this.login_wall.clear_inputs();
        //this.wall_create_account.clear_inputs();
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this.post_create_account = new PostHelper(POST_URL_CREATE_ACCOUNT);
        this.post_login          = new PostHelper(POST_URL_LOGIN);

        /*__             __        __     ___   ___       ___
         /  \ |  |  /\  /__`  /\  |__)     |  |  |  |    |__
         \__X \__/ /~~\ .__/ /~~\ |  \     |  |  |  |___ |___ */
        this.quasar_source_title = new Floating3DText('Quasar Source', TYPE_SUPER_TITLE, this);
        this.quasar_source_title.set_position(1200, 400, 400, false);
        this.quasar_source_title.look_at_origin(false);

        /*     __   __
         |    /  \ / _` | |\ |    |  |  /\  |    |
         |___ \__/ \__> | | \|    |/\| /~~\ |___ |___ */
        this.login_errors = new TextSyntaxManager(this);

        var login_wall_width = 350;
        var login_wall_height = 95;
        var login_wall_position = new THREE.Vector3(600, login_wall_height, 350);
        var login_wall_normal = new THREE.Vector3(-login_wall_position.x, 0, -login_wall_position.z);

        this.wall_login = new FloatingWall(login_wall_width, login_wall_height, login_wall_position, login_wall_normal, this, false);
        this.wall_login.add_row_3D_text(false, -1, 'Login', TYPE_TITLE);

        this.login_username_label = this.wall_login.add_row_2D_text([0, ONE_THIRD], 0, 'username', TYPE_CONSTANT);
        this.login_username_input = this.wall_login.add_row_2D_text([ONE_THIRD, 1], 0, '', TYPE_INPUT, [TEXT_SYNTAX_STANDARD_LENGTH]);
        this.login_errors.add_label_and_input(this.login_username_label, this.login_username_input);
        this.login_username_input.set_value_post_changed_function(this._error_check.bind(this, this.login_errors));

        this.login_password_label = this.wall_login.add_row_2D_text([0, ONE_THIRD], 1, 'password', TYPE_CONSTANT);
        this.login_password_input = this.wall_login.add_row_2D_text([ONE_THIRD, 1], 1, '', TYPE_PASSWORD, [TEXT_SYNTAX_STANDARD_LENGTH]);
        this.login_errors.add_label_and_input(this.login_password_label, this.login_password_input);
        this.login_password_input.set_value_post_changed_function(this._error_check.bind(this, this.login_errors));

        // TODO :
        //this.login_rememeber_username = this.login_wall.add_floating_2d_text(0, 1 / 2, 'remember username', TYPE_CH);
        //this.login_remember_username_label = this.login_wall.add_floating_2d_text(login_wall_width / 2, 'remember username', TYPE_CONSTANT_TEXT, 0, 2, 2, 0);
        //this.login_remember_username_checkbox = this.login_wall.add_floating_2d_text(16, '', TYPE_CHECK_BOX, login_wall_width / 2 + 10, 2, 2, 0);

        this.login_button = this.wall_login.add_row_2D_text([.25, .75], 3, 'login', TYPE_BUTTON);
        this.login_button.set_engage_function(this.login_button_pressed.bind(this));
        this.login_errors.add_final_button(this.login_button);

        /*__   __   ___      ___  ___          __   __   __            ___
         /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |     |  |  /\  |    |
         \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |     |/\| /~~\ |___ |___  */
        this.create_account_errors = new TextSyntaxManager(this);

        var wall_create_account_position = new THREE.Vector3(350, 95, 600);
        var wall_create_account_normal = new THREE.Vector3(-wall_create_account_position.x, 0, -wall_create_account_position.z);

        this.wall_create_account = new FloatingWall(350, 95, wall_create_account_position, wall_create_account_normal, this, false);
        this.wall_create_account.add_row_3D_text(false, -1, 'Create Account', TYPE_TITLE);

        this.create_account_username_label = this.wall_create_account.add_row_2D_text([0, ONE_THIRD], 0, 'username', TYPE_CONSTANT);
        this.create_account_username_input = this.wall_create_account.add_row_2D_text([ONE_THIRD, 1], 0, '', TYPE_INPUT, [TEXT_SYNTAX_STANDARD_LENGTH]);
        this.create_account_errors.add_label_and_input(this.create_account_username_label, this.create_account_username_input);
        this.create_account_username_input.set_value_post_changed_function(this._error_check.bind(this, this.create_account_errors));

        this.create_account_email_label = this.wall_create_account.add_row_2D_text([0, ONE_THIRD], 1, 'email', TYPE_CONSTANT);
        this.create_account_email_input = this.wall_create_account.add_row_2D_text([ONE_THIRD, 1], 1, '', TYPE_INPUT, [TEXT_SYNTAX_STANDARD_LENGTH, TEXT_SYNTAX_EMAIL]);
        this.create_account_errors.add_label_and_input(this.create_account_email_label, this.create_account_email_input);
        this.create_account_email_input.set_value_post_changed_function(this._error_check.bind(this, this.create_account_errors));

        this.create_account_password_label = this.wall_create_account.add_row_2D_text([0, ONE_THIRD], 2, 'password', TYPE_CONSTANT);
        this.create_account_password_input = this.wall_create_account.add_row_2D_text([ONE_THIRD, 1], 2, '', TYPE_PASSWORD, [TEXT_SYNTAX_STANDARD_LENGTH, TEXT_SYNTAX_MATCH_PASSWORDS]);
        this.create_account_errors.add_label_and_input(this.create_account_password_label, this.create_account_password_input);
        this.create_account_password_input.set_value_post_changed_function(this._error_check.bind(this, this.create_account_errors));

        this.create_account_password_repeat_label = this.wall_create_account.add_row_2D_text([0, ONE_THIRD], 3, 'repeat password', TYPE_CONSTANT);
        this.create_account_password_repeat_input = this.wall_create_account.add_row_2D_text([ONE_THIRD, 1], 3, '', TYPE_PASSWORD, [TEXT_SYNTAX_STANDARD_LENGTH, TEXT_SYNTAX_MATCH_PASSWORDS]);
        this.create_account_errors.add_label_and_input(this.create_account_password_repeat_label, this.create_account_password_repeat_input);
        this.create_account_password_repeat_input.set_value_post_changed_function(this._error_check.bind(this, this.create_account_errors));

        this.create_account_button = this.wall_create_account.add_row_2D_text([.25, .75], 5, 'create account', TYPE_BUTTON);
        this.create_account_button.set_engage_function(this.create_account_button_pressed.bind(this));
        this.create_account_errors.add_final_button(this.create_account_button);

        // TODO : Delete this or reformat
        this.set_default_tab_target(this.login_username_input);
        this.login_username_input.set_next_tab_target(this.login_password_input);
        this.login_password_input.set_next_tab_target(this.login_button);
        this.login_button.set_next_tab_target(this.create_account_username_input);
        this.create_account_username_input.set_next_tab_target(this.create_account_email_input);
        this.create_account_email_input.set_next_tab_target(this.create_account_password_input);
        this.create_account_password_input.set_next_tab_target(this.create_account_password_repeat_input);
        this.create_account_password_repeat_input.set_next_tab_target(this.create_account_button);
        this.create_account_button.set_next_tab_target(this.login_username_input);

        /*___    __   __             ___  __     __        __
           |  | |__) /__`    |\ |     |  |__) | /  ` |__/ /__`    |  |  /\  |    |
           |  | |    .__/    | \|     |  |  \ | \__, |  \ .__/    |/\| /~~\ |___ |___ */
        this.wall_tips_and_tricks = new FloatingWall(500, 300, new THREE.Vector3(850, 200, -50), new THREE.Vector3(-.99, 0, 0.07), this, false, COLOR_BLACK);
        //this.wall_tips_and_tricks.add_close_button();

        var current_row;
        current_row = this.wall_tips_and_tricks.add_row(-1);
        current_row.add_3D_element('Tips N Tricks', TYPE_TITLE, COLOR_YELLOW);

        this.wall_tips_and_tricks.add_full_row_2D('- A cursor will only be visible for anything interactive.', TYPE_CONSTANT, COLOR_YELLOW);
        this.wall_tips_and_tricks.add_full_row_2D('- Once engaged, right click to dis-engage.', TYPE_CONSTANT, COLOR_YELLOW);

        //this.wall_tips_and_tricks.add_row_3D_text(false, -1, 'Tips N Tricks', TYPE_TITLE, COLOR_YELLOW);
        //this.wall_tips_and_tricks.add_row_2D_text([0, .9], 0, '- A cursor will only be visible for anything interactive.', TYPE_CONSTANT, COLOR_YELLOW);
        //this.wall_tips_and_tricks.add_row_2D_text([0, 1], 1, '- Left click to click buttons or engage with engable objects.', TYPE_CONSTANT, COLOR_YELLOW);
        this.wall_tips_and_tricks.add_row_2D_text([0, 1], 2, '- Once engaged, right click to dis-engage.', TYPE_CONSTANT, COLOR_YELLOW);
        this.wall_tips_and_tricks.add_row_2D_text([0, 1], 3, '- Hit the escape key to release control of the mouse', TYPE_CONSTANT, null, COLOR_RED);
        this.wall_tips_and_tricks.add_row_2D_text([0, 1], 4, '- Hit the tab key to cycle through engable/clickable objects.', TYPE_CONSTANT, COLOR_YELLOW);
        this.wall_tips_and_tricks.refresh_position_and_look_at();

        /*              ___       __                   ___      ___   ___
         |  | |__|  /\   |     | /__`     /\  |\ |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
         |/\| |  | /~~\  |     | .__/    /~~\ | \|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
        this.wall_what_is_an_entity = new FloatingWall(500, 600, new THREE.Vector3(810, 550, -800), new THREE.Vector3(-.8, 0, .575), this, false, COLOR_FLOATING_WALL_SUCCESS);
        this.wall_what_is_an_entity.add_close_button();
        this.wall_what_is_an_entity.add_row_3D_text(false, -1, 'So what\'s an Entity?', TYPE_TITLE, COLOR_YELLOW);
        this.wall_what_is_an_entity.add_row_2D_text([0, 1], 0, 'ToDo =)', TYPE_CONSTANT);
        this.wall_what_is_an_entity.refresh_position_and_look_at();
    }
};