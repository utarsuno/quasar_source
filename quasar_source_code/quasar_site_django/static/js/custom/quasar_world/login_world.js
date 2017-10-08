'use strict'

function LoginWorld() {
    this.__init__()
}

LoginWorld.prototype = {

    scene: null,

    player: null,

    previously_looked_at: null,

    // Create account fields.
    create_username: null,

    set_player_look_at: null,

    interactive_objects : null,

    // Post calls.
    post_create_account   : null,
    post_login            : null,

    ajax_status        : null,

    //
    current_world: null,

    //
    attempted_username: null,
    attempted_password: null,

    login_button_event: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            this.ajax_status.update_text('Logged in!')
            this.player.perform_login(this.attempted_username, this.attempted_password)
        } else {
            this.ajax_status.update_text('Error: ' + data)
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

    __init__: function() {

        this.post_create_account = new PostHelper('/create_account')
        this.post_login = new PostHelper('/login')

        this.current_world = false

        // Create the scene.
        this.scene = new THREE.Scene()

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
        light3.position.set(5, 100, 5)
        this.add_to_scene(light3)

        // AJAX status.
        this.ajax_status = new Floating2DText(400, 30, '', TYPE_TITLE, this.scene)
        this.ajax_status.update_position_and_look_at(new THREE.Vector3(150, 150, 45), new THREE.Vector3(150, 150, 55))

        // Login fields.
        this.login_username = new Floating2DLabelInput(150, 16, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.login_username.update_position(0, 100, 45)

        this.login_password = new Floating2DLabelInput(150, 16, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.login_password.update_position(0, 75, 45)

        this.login_button = new Floating2DText(150, 16, 'Login', TYPE_BUTTON, this.scene)
        this.login_button.update_position_and_look_at(new THREE.Vector3(150 / 3, 50, 45), new THREE.Vector3(150 / 3, 50, 55))

        // Create account fields.
        this.create_username = new Floating2DLabelInput(150, 16, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.create_username.update_position(200, 100, 45)

        // TODO : REMOVE THIS, THIS IS FOR TEMPORARY TESTING.
        set_cookie

        // If the remember_username field is marked and we have a value then set the username default value.
        if (get_cookie('should_remember_username') === true) {
            var cookie = get_cookie('remember_username')
            if (cookie !== null) {
                this.create_username.set_input_value(cookie)
            }
        }

        this.create_email = new Floating2DLabelInput(150, 16, 'Email :', TYPE_INPUT_REGULAR, this.scene)
        this.create_email.update_position(200, 75, 45)

        this.create_password = new Floating2DLabelInput(150, 16, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_password.update_position(200, 50, 45)

        this.create_repeat_password = new Floating2DLabelInput(150, 16, 'Repeat Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_repeat_password.update_position(200, 25, 45)

        this.create_account_button = new Floating2DText(150, 16, 'Create Account', TYPE_BUTTON, this.scene)
        this.create_account_button.update_position_and_look_at(new THREE.Vector3(200 + 150 / 3, 0, 45), new THREE.Vector3(200 + 150 / 3, 0, 46))

        // Create a list of the interactive floating texts.
        this.interactive_objects = [
            this.login_button,
            this.create_account_button,
            this.login_username.floating_input,
            this.login_password.floating_input,
            this.create_username.floating_input,
            this.create_email.floating_input,
            this.create_password.floating_input,
            this.create_repeat_password.floating_input]

        // Handle key press events.
        document.addEventListener('keydown', this.on_key_press.bind(this), false)

        this.set_player_look_at = false
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    update: function() {
        if (this.set_player_look_at) {
            //this.player.look_at(new THREE.Vector3(0, 70, 45))
            this.player.set_position(new THREE.Vector3(130, 90, 300))
            this.set_player_look_at = false
        }

        var raycaster = new THREE.Raycaster(this.player.fps_controls.get_position(), this.player.fps_controls.get_direction())

        for (var i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i] !== this.previously_looked_at) {
                this.interactive_objects[i].look_away()
            }
            var intersections = raycaster.intersectObject(this.interactive_objects[i].object3d, true)
            if (intersections.length > 0) {
                this.interactive_objects[i].look_at()
                this.previously_looked_at = this.interactive_objects[i]
            }
        }
    },

    on_key_press: function(event) {

        // TODO : Optimize this later. Maybe put all key events into a single key event handler class?
        if (this.current_world === false) {
            return
        }

        //console.log('KEYCODE IS : ')
        //console.log(event)
        var i

        if (event.keyCode == 220) { // backslash
            if (this.player.is_engaged()) {
                for (i = 0; i < this.interactive_objects.length; i++) {
                    if (this.interactive_objects[i].being_looked_at) {
                        this.interactive_objects[i].disengage(this.player)
                    }
                }
            }
        } else if (event.keyCode == 9) { // tab
            // Oh, player.look_at() needs to be working first.
            //if (this.player.is_engaged()) {
            //}

            event.preventDefault()
            event.stopPropagation()
            // Prevent default and prevent
        }

        for (i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i].is_engaged()) {
                this.interactive_objects[i].parse_keycode(event)
            }
        }

        if (event.keyCode == 69) { // e
            for (i = 0; i < this.interactive_objects.length; i++) {
                if (this.interactive_objects[i].being_looked_at) {
                    this.interactive_objects[i].engage(this.player)

                    var error = false
                    var error_message = ''

                    if (this.interactive_objects[i] === this.create_account_button) {

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
                    } else if (this.interactive_objects[i] === this.login_button) {

                        var login_username_text = this.login_username.get_input_text()
                        var login_password_text = this.login_password.get_input_text()

                        // TODO : Create a class to handle this kind of logic.

                        if (login_username_text.length < 4) {
                            error = true
                            error_message = 'Usernames are at least 4 characters!'
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

                    }

                }
            }
        }

    },

    enter_world: function() {
        this.current_world = true
        if (this.player == null) {
            this.set_player_look_at = true
        } else {
            //this.player.look_at(new THREE.Vector3(0, 70, 45))
            this.player.set_position(new THREE.Vector3(130, 90, 300))
        }
    },

    exit_world: function() {
        this.current_world = false
    }
}