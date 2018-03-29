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
        this.quasar_source_title.refresh_position_and_look_at();
        this.wall_login.refresh_position_and_look_at();
        this.wall_create_account.refresh_position_and_look_at();


        this.wall_test.refresh_position_and_look_at();
    },

    custom_world_exit: function() {
        //this.login_wall.clear_inputs();
        //this.wall_create_account.clear_inputs();
    },

    /*     __   __                  __  ___    __
     |    /  \ / _` | |\ |     /\  /  `  |  | /  \ |\ |
     |___ \__/ \__> | | \|    /~~\ \__,  |  | \__/ | \| */
    login_button_pressed: function() {
        l('TODO : Login action!');
    },

    /*__   __   ___      ___  ___          __   __   __            ___          __  ___    __
     /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |      /\  /  `  |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |     /~~\ \__,  |  | \__/ | \| */
    create_account_button_pressed: function() {
        l('TODO : Create account action!');
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this._create_quasar_title();
        this._create_login_wall();
        this._create_create_account_wall();

        this.wall_test = new FloatingWall(500, 95, new THREE.Vector3(900, 3000, -700), new THREE.Vector3(-900, 0, 700), this);
        var a = 'a';
        for (var i = 0; i < 100; i++) {
            a += 'a';
            var row = this.wall_test.add_row(-1);
            var input_username = row.add_input_2D([0, 1, false], 16);
            input_username.add_label_left(a);
        }
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
        var input_username = row.add_input_2D([0, 1, false], 16);
        input_username.add_syntax(TEXT_SYNTAX_USERNAME);
        input_username.add_label_left('username:');

        // Email.
        row = this.wall_create_account.add_row();
        var input_email = row.add_input_2D([0, 1, false], 16);
        input_email.add_syntax(TEXT_SYNTAX_EMAIL);
        input_email.add_label_left('email:');

        // Password.
        row = this.wall_create_account.add_row();
        var input_password = row.add_input_2D([0, 1, false], 16);
        input_password.add_syntax(TEXT_SYNTAX_REPEAT_PASSWORD);
        input_password.add_label_left('password:');

        // Repeat Password.
        row = this.wall_create_account.add_row();
        var input_repeat_password = row.add_input_2D([0, 1, false], 16);
        input_repeat_password.add_syntax(TEXT_SYNTAX_REPEAT_PASSWORD);
        input_repeat_password.add_label_left('repeat password:');

        // Create account button.
        row = this.wall_create_account.add_row();
        var button_create_account = row.add_button([ONE_FOURTH, THREE_FOURTHS, true], 16, 'create account', this.create_account_button_pressed.bind(this));

        // Connect the elements together as a form.
        this.form_create_account = new FormManager([input_username, input_email, input_password, input_repeat_password], button_create_account);
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
        var input_username = row.add_input_2D([0, 1, false], 16);
        input_username.add_syntax(TEXT_SYNTAX_USERNAME);
        input_username.add_label_left('username:');

        // Password.
        row = this.wall_login.add_row();
        var input_password = row.add_input_2D([0, 1, false], 16);
        input_password.add_syntax(TEXT_SYNTAX_PASSWORD);
        input_password.add_label_left('password:');

        // Remember username.
        row = this.wall_login.add_row();
        var remember_username = row.add_checkbox([0, null, false], 16, false);
        remember_username.add_label_left('remember username:');

        // Login button.
        row = this.wall_login.add_row();
        var button_login = row.add_button([ONE_FOURTH, THREE_FOURTHS, true], 16, 'login', this.login_button_pressed.bind(this));

        // Connect the elements together as a form.
        //this.form_login = new FormManager([input_username, input_password], button_login);
        this.form_login = new FormManager();
        this.form_login.add_input_field(input_username);
        this.form_login.add_input_field(input_password);
        this.form_login.add_final_button(button_login);
    }
};