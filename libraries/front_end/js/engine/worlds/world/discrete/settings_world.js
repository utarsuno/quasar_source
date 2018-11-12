'use strict';

$_NL.prototype.SettingsWorld = function(player) {
    this.init_world(player);
    this.set_world_enter_default_position(new THREE.Vector3(-34.79899682521624, 557.3571839639006, 1802.99541871182));
    this.set_world_enter_default_normal(new THREE.Vector3(0.005015558927525423, -0.16165647877160208, -0.9868343463012478));
};

Object.assign(
    $_NL.prototype.SettingsWorld.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
            //this.logs.refresh();
            //this.logs.add_message(delta);
        },

        create_for_first_render: function() {
        },
    }
);


// Really old version below.

/*
SettingsWorld.prototype = {
    select_phone_carrier: function() {
        this.profile_phone_carrier_list.set_to_visible();
    },
    selected_phone_carrier: function(selected_phone_carrier) {
        this.profile_phone_carrier_input.update_text(selected_phone_carrier);
        this.profile_phone_carrier_list.set_to_invisible();
    },
    /*
    // FOR_DEV_START
    // TODO : The .save command needs to save this data!!!
    save_changes_button_pressed: function() {
        var changes_occured = false;

        if (this.profile_email_input.get_text() !== this.owner_entity.get_value('owner_email')) {
            this.owner_entity.set_property('owner_email', this.profile_email_input.get_text());
            changes_occured = true;
        }
        if (this.profile_phone_number_input.get_text() !== this.owner_entity.get_value('owner_phone_number')) {
            this.owner_entity.set_property('owner_phone_number', this.profile_phone_number_input.get_text());
            changes_occured = true;
        }
        if (this.profile_phone_carrier_input.get_text() !== this.owner_entity.get_value('owner_phone_carrier')) {
            this.owner_entity.set_property('owner_phone_carrier', this.profile_phone_carrier_input.get_text());
            changes_occured = true;
        }
    },
    // FOR_DEV_END
    //*_/

    slider_master_volume_value_changed: function(master_volume_value) {
        // TODO : Don't linerally adjust the volume but instead follow that audio volume changing guide!!!!
        l('Master volume value is now : ' + master_volume_value);
        // TODO : Save the new value into ENTITY OWNER settings
    },

    slider_fov_value_changed: function(fov_value) {
        l('FOV value is now : ' + fov_value);
        MANAGER_RENDERER.camera.fov = fov_value;
        MANAGER_RENDERER.camera.updateProjectionMatrix();
        // TODO : Save the new value into ENTITY OWNER settings.
    },
    
    create: function() {
        __   __   __   ___         ___
         |__) |__) /  \ |__  | |    |__     |  |  /\  |    |
         |    |  \ \__/ |    | |___ |___    |/\| /~~\ |___ |___ 

        
        var wall_profile_position = new THREE.Vector3(500, 500, 700);
        var wall_profile_width    = 650;
        var wall_profile_height   = 512 / 2;
        var wall_profile_normal   = new THREE.Vector3(-0.5, 0.0, -0.85);
        this.wall_user_profile = new FloatingWall(wall_profile_width, wall_profile_height, wall_profile_position, wall_profile_normal, this, false);
        this.wall_user_profile.add_row_3D_text(false, -1, 'Profile Information', TYPE_TITLE);

        // Username.
        this.profile_name_label = this.wall_user_profile.add_row_2D_text([0, ONE_THIRD], 0, 'Username :', TYPE_CONSTANT);
        this.profile_name_input = this.wall_user_profile.add_row_2D_text([ONE_THIRD, 1], 0, '', TYPE_CONSTANT);

        // Email.
        this.profile_email_label = this.wall_user_profile.add_row_2D_text([0, ONE_THIRD], 1, 'Email :', TYPE_CONSTANT);
        this.profile_email_input = this.wall_user_profile.add_row_2D_text([ONE_THIRD, 1], 1, '', TYPE_CONSTANT);

        // Phone Number.
        this.profile_phone_number_label = this.wall_user_profile.add_row_2D_text([0, ONE_THIRD], 2, 'Email :', TYPE_CONSTANT);
        this.profile_phone_number_input = this.wall_user_profile.add_row_2D_text([ONE_THIRD, 1], 2, '', TYPE_INPUT);

        // Phone Carrier.
        this.profile_phone_carrier_label = this.wall_user_profile.add_row_2D_text([0, ONE_THIRD], 3, 'Email :', TYPE_CONSTANT);
        this.profile_phone_carrier_input = this.wall_user_profile.add_row_2D_text([ONE_THIRD, 1], 3, '', TYPE_INPUT);
        this.profile_phone_carrier_input.engable = false;
        this.profile_phone_carrier_input.set_engage_function(this.select_phone_carrier.bind(this));

        // Phone Carrier List.
        this.profile_phone_carrier_list = this.profile_phone_carrier_input.add_floating_wall_attachment(350, 400, null, null, 5, false);
        this.profile_phone_carrier_list.add_row_3D_text(false, -1, 'Select Phone Carrier', TYPE_TITLE);
        var current_row_index = 0;
        for (var property in CELL_PHONE_CARRIERS) {
            if (CELL_PHONE_CARRIERS.hasOwnProperty(property)) {
                var cell_phone_carrier = this.profile_phone_carrier_list.add_row_2D_text([0, 1], current_row_index, property, TYPE_BUTTON);
                current_row_index += 1;
                cell_phone_carrier.set_engage_function(this.selected_phone_carrier.bind(this, property));
            }
        }
        this.profile_phone_carrier_list.set_to_invisible();

        // Created at date.
        this.profile_created_at_date_label = this.wall_user_profile.add_row_2D_text([0, ONE_THIRD], 4, 'Date Created :', TYPE_CONSTANT);
        this.profile_created_at_date_input = this.wall_user_profile.add_row_2D_text([ONE_THIRD, 1], 4, '', TYPE_CONSTANT);

        this.wall_user_profile.refresh_position_and_look_at();

        

        __   ___ ___ ___         __   __
         /__` |__   |   |  | |\ | / _` /__`    |  |  /\  |    |
         .__/ |___  |   |  | | \| \__> .__/    |/\| /~~\ |___ |___ 

        
        var wall_settings_position = new THREE.Vector3(1150, 600, 200);
        var wall_settings_width    = 600;
        var wall_settings_height   = 512;
        var wall_settings_normal   = new THREE.Vector3(-0.969, 0, -0.221);
        var wall_settings_scalable = false;

        this.wall_settings = new FloatingWall(wall_settings_width, wall_settings_height, wall_settings_position, wall_settings_normal, this, wall_settings_scalable);
        this.wall_settings.add_3D_title('General Settings');

        // TODO : Support this functionality
        // TODO : Instead of always using the default value of 90 it needs to get loaded from the ENTITY_OWNER settings values.
        this.wall_settings_slider_fov = this.wall_settings.add_floating_slider(0, 1, 90, 20, 160, 'Camera Field of View : ', 1);
        // TODO : Implement the value changed function, Oh awesome! This will also work out for checking/displaying live syntax coloring.
        this.wall_settings_slider_fov.set_value_post_changed_function(this.slider_fov_value_changed.bind(this));
        // TODO : Don't use the default value but instead load from the ENTITY_OWNER settings value.
        this.wall_settings_slider_audio = this.wall_settings.add_floating_slider(0, 1, 100, 0, 100, 'Master Volume : ', 2);
        this.wall_settings_slider_audio.set_value_post_changed_function(this.slider_master_volume_value_changed.bind(this));
        
    }

};
*/