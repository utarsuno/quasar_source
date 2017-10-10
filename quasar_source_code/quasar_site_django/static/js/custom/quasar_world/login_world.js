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

    //
    got_camera: null,

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
        /*
        OWNER_NAME       = 'owner'
        OWNER_PASSWORD   = 'password'
        OWNER_EMAIL      = 'email'
        OWNER_ID         = 'owner_id'
        OWNER_MANAGER_ID = 'manager_id'
         */
    },

    remember_username_clicked: function() {
        this.remember_username_checkbox.toggle()
        if (this.remember_username_checkbox.checked) {
            GLOBAL_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'true')
        } else {
            GLOBAL_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, 'false')
        }
    },

    __init__: function() {

        this.post_create_account = new PostHelper('/create_account')
        this.post_login = new PostHelper('/login')

        // Inherit from World.
        World.call(this)

        this.got_camera = false


        // Going to try to create a plane here.
        var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 50, 50)
        plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
        //var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
        var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
        var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
        this.add_to_scene(plane_mesh)

        // Add lights.
        /*
        var color1 = '#b9ffd2'
        var color2 = '#090920'
        var light = new THREE.HemisphereLight(color1, color2, .5)
        this.add_to_scene(light)
        */

        var light3 = new THREE.PointLight(0xccffcc, .8, 0)
        light3.position.set(100, 100, 100)
        this.add_to_scene(light3)

        // AJAX status.
        this.ajax_status = new Floating2DText(450, '', TYPE_TITLE, this.scene)
        this.ajax_status.update_position_and_look_at(new THREE.Vector3(-50, 150, 45), new THREE.Vector3(-50, 150, 55))

        /*      __   __
          |    /  \ / _` | |\ |
          |___ \__/ \__> | | \| */
        this.login_title = new Floating3DText(150, 'Login', TYPE_TITLE, this.scene)
        this.login_title.update_position_and_look_at(new THREE.Vector3(LOGIN_X, 200, 40), new THREE.Vector3(LOGIN_X, 200, 55))

        this.login_username = new Floating2DLabelInput(150, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.login_username.update_position(0, 100, 45)

        this.login_password = new Floating2DLabelInput(150, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.login_password.update_position(0, 75, 45)

        this.remember_username_text = new Floating2DText(76, 'remember me c:', TYPE_INPUT_REGULAR, this.scene)
        this.remember_username_text.update_position_and_look_at(new THREE.Vector3(0, 50, 45), new THREE.Vector3(0, 50, 45))
        this.remember_username_checkbox = new CheckBox(true, this.scene)
        this.remember_username_checkbox.update_position_and_look_at(new THREE.Vector3(150 - 16, 50, 45), new THREE.Vector3(150 - 16, 50, 45))

        this.remember_username_checkbox.floating_2d_text.set_engage_function(this.remember_username_clicked.bind(this))

        this.login_button = new Floating2DText(150, 'Login', TYPE_BUTTON, this.scene)
        this.login_button.update_position_and_look_at(new THREE.Vector3(0, 25, 45), new THREE.Vector3(0, 25, 55))

        this.login_button.set_engage_function(this.login_button_clicked.bind(this))

        /* __   __   ___      ___  ___          __   __   __            ___
          /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |
          \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |  */
        this.create_account_title = new Floating3DText(150, 'Create\nAccount', TYPE_TITLE, this.scene)
        this.create_account_title.update_position_and_look_at(new THREE.Vector3(200, 225, 40), new THREE.Vector3(200, 225, 55))

        this.create_username = new Floating2DLabelInput(150, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.create_username.update_position(200, 100, 45)

        if (GLOBAL_COOKIES.get(COOKIE_SHOULD_REMEMBER_USERNAME) === undefined) {
            GLOBAL_COOKIES.set(COOKIE_SHOULD_REMEMBER_USERNAME, this.remember_username_checkbox.status())
        }

        this.create_email = new Floating2DLabelInput(150, 'Email :', TYPE_INPUT_REGULAR, this.scene)
        this.create_email.update_position(200, 75, 45)

        this.create_password = new Floating2DLabelInput(150, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_password.update_position(200, 50, 45)

        this.create_repeat_password = new Floating2DLabelInput(150, 'Repeat Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_repeat_password.update_position(200, 25, 45)

        this.create_account_button = new Floating2DText(150, 'Create Account', TYPE_BUTTON, this.scene)
        this.create_account_button.update_position_and_look_at(new THREE.Vector3(200, 0, 45), new THREE.Vector3(200, 0, 46))

        this.create_account_button.set_engage_function(this.create_account_button_clicked.bind(this))

        // Create a list of the interactive floating texts.
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

        if (this.got_camera === false) {
            this.add_to_scene(this.player.fps_controls.get_object())
            this.got_camera = true
        }

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