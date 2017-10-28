'use strict'

function LoginWorld() {
    this.__init__()
}

const LOGIN_X = 0

LoginWorld.prototype = {

    // Create account fields.
    create_username: null,

    // Post calls.
    post_create_account   : null,
    post_login            : null,

    ajax_status        : null,

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
        var error = false
        var error_message = ''

        var login_username_text = this.login_username.get_input_text()
        var login_password_text = this.login_password.get_input_text()

        // TODO : Create a class to handle this kind of logic.

        if (login_username_text.length < 4) {
            error = true
            error_message = 'Username must be at least 4 characters.'
        }
        if (!error) {
            if (login_password_text.length < 4) {
                error = true
                error_message = 'Passwords are at least 4 characters!'
            }
        }

        if (!error) {
            this.ajax_status.update_text('sending login request to server')
            this.attempted_username = login_username_text
            this.attempted_password = login_password_text
            this.post_login.perform_post({'username': login_username_text, 'password': login_password_text}, this.login_button_event.bind(this))
        } else {
            this.ajax_status.update_text('Error : ' + error_message)
        }
    },

    login_button_event: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            this.ajax_status.update_text('Logged in!')
            if (this.remember_username_checkbox.checked) {
                GLOBAL_COOKIES.set(COOKIE_REMEMBERED_USERNAME, this.attempted_username)
            }
            this.player.perform_login(this.attempted_username, this.attempted_password)
        } else {
            this.ajax_status.update_text('Error: ' + data)
        }
    },

    create_account_button_clicked: function() {
        var error = false
        var error_message = ''

        // TODO : Eventually make input parsing live for the user.
        var email_text = this.create_email.get_input_text()
        var username_text = this.create_username.get_input_text()
        var password_text = this.create_password.get_input_text()

        this.attempted_password = this.create_password.get_input_text()

        var password_repeat_text = this.create_repeat_password.get_input_text()

        if (!is_email_valid(email_text)) {
            error = true
            error_message = 'invalid email format'
        }
        if (!error) {
            if (username_text.length < 4) {
                error = true
                error_message = 'username text length < 4'
            }
        }
        if (!error) {
            if (password_text.length < 4 || password_text !== password_repeat_text) {
                error = true
                if (password_text.length < 4) {
                    error_message = 'password length < 4'
                } else {
                    error_message = 'passwords do not match'
                }
            }
        }

        if (!error) {
            this.ajax_status.update_text('Sending request to server.')
            this.post_create_account.perform_post({'owner': username_text, 'password': password_text, 'email': email_text}, this.create_account_button_event.bind(this))
        } else {
            this.ajax_status.update_text('Error : ' + error_message)
        }
    },

    create_account_button_event: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            this.ajax_status.update_text('Account created!')
        } else {
            this.ajax_status.update_text('Error: ' + data)
        }
    },

    remember_username_clicked: function() {
        this.remember_username_checkbox.toggle()
        if (this.remember_username_checkbox.status()) {
            GLOBAL_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'true')
        } else {
            GLOBAL_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'false')
        }
    },

    __init__: function() {

        this.post_create_account = new PostHelper('/create_account')
        this.post_login = new PostHelper('/login')

        // Inherit from World.
        World.call(this, 'LoginWorld')

        // AJAX status.
        this.ajax_status = new Floating2DText(450, '', TYPE_TITLE, this.scene)
        this.ajax_status.update_position_and_look_at(new THREE.Vector3(450 / 2 - 50, 150, 45), new THREE.Vector3(450 / 2 - 50, 150, 55))

        /*      __   __
          |    /  \ / _` | |\ |
          |___ \__/ \__> | | \| */

        var login_width = 150

        this.login_title = new Floating3DText(login_width, 'Login', TYPE_TITLE, this.scene)
        this.login_title.update_position_and_look_at(new THREE.Vector3(LOGIN_X, 200, 40), new THREE.Vector3(LOGIN_X, 200, 55))

        this.login_username = new Floating2DLabelInput(login_width, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.login_username.update_position(0, 100, 45)

        this.login_password = new Floating2DLabelInput(login_width, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.login_password.update_position(0, 75, 45)

        var remember_me_width = 75
        this.remember_username_text = new Floating2DText(remember_me_width, 'remember me c:', TYPE_INPUT_REGULAR, this.scene)
        this.remember_username_text.update_position_and_look_at(new THREE.Vector3(remember_me_width / 2, 50, 45), new THREE.Vector3(remember_me_width / 2, 50, 45))
        this.remember_username_checkbox = new CheckBox(true, this.scene)
        this.remember_username_checkbox.update_position_and_look_at(new THREE.Vector3(150 - 16 / 2, 50, 45), new THREE.Vector3(150 - 16 / 2, 50, 45))

        this.remember_username_checkbox.floating_2d_text.set_engage_function(this.remember_username_clicked.bind(this))

        this.login_button = new Floating2DText(login_width, 'Login', TYPE_BUTTON, this.scene)
        this.login_button.update_position_and_look_at(new THREE.Vector3(login_width / 2, 25, 45), new THREE.Vector3(login_width / 2, 25, 55))
        this.login_button.set_engage_function(this.login_button_clicked.bind(this))

        /* __   __   ___      ___  ___          __   __   __            ___
          /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |
          \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |  */

        var create_width = 150

        this.create_account_title = new Floating3DText(create_width, 'Create\nAccount', TYPE_TITLE, this.scene)
        this.create_account_title.update_position_and_look_at(new THREE.Vector3(200, 225, 40), new THREE.Vector3(200, 225, 55))

        this.create_username = new Floating2DLabelInput(create_width, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.create_username.update_position(200, 100, 45)

        if (GLOBAL_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME) === undefined) {
            GLOBAL_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, this.remember_username_checkbox.status())
        }

        this.create_email = new Floating2DLabelInput(create_width, 'Email :', TYPE_INPUT_REGULAR, this.scene)
        this.create_email.update_position(200, 75, 45)

        this.create_password = new Floating2DLabelInput(create_width, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_password.update_position(200, 50, 45)

        this.create_repeat_password = new Floating2DLabelInput(create_width, 'Repeat Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_repeat_password.update_position(200, 25, 45)

        this.create_account_button = new Floating2DText(create_width, 'Create Account', TYPE_BUTTON, this.scene)
        this.create_account_button.update_position_and_look_at(new THREE.Vector3(200 + create_width / 2, 0, 45), new THREE.Vector3(200 + create_width / 2, 0, 46))

        this.create_account_button.set_engage_function(this.create_account_button_clicked.bind(this))

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
        ]

        // Set the tab targets.
        this.login_username.floating_input.set_next_tab_target(this.login_password.floating_input)
        this.login_password.floating_input.set_next_tab_target(this.remember_username_checkbox.floating_2d_text)
        this.remember_username_checkbox.floating_2d_text.set_next_tab_target(this.login_button)
        this.login_button.set_next_tab_target(this.create_username.floating_input)
        this.create_username.floating_input.set_next_tab_target(this.create_email.floating_input)
        this.create_email.floating_input.set_next_tab_target(this.create_password.floating_input)
        this.create_password.floating_input.set_next_tab_target(this.create_repeat_password.floating_input)
        this.create_repeat_password.floating_input.set_next_tab_target(this.create_account_button)
        this.create_account_button.set_next_tab_target(this.login_username.floating_input)

        this.set_default_tab_target(this.login_username.floating_input)
    },

    update: function() {
        this.update_interactive_objects()
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
    },

    enter_world: function() {
        this.current_world = true

        this.player.set_position(new THREE.Vector3(130, 90, 300))

        if (GLOBAL_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME) === 'true') {
            if (GLOBAL_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== undefined) {
                if (GLOBAL_COOKIES.get(COOKIE_REMEMBERED_USERNAME) !== 'undefined') {
                    this.login_username.set_input_value(GLOBAL_COOKIES.get(COOKIE_REMEMBERED_USERNAME))
                }
            }
        }
    },

    exit_world: function() {
        this.current_world = false
    }
}