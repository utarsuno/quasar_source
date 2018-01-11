'use strict';

function SettingsWorld() {
    this.__init__();
}

SettingsWorld.prototype = {

    previous_world: null,

    select_phone_carrier: function() {
        this.profile_phone_carrier_list.set_to_visible();
    },

    selected_phone_carrier: function(selected_phone_carrier) {
        this.profile_phone_carrier_input.update_text(selected_phone_carrier);
        this.profile_phone_carrier_list.set_to_invisible();
    },



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

    __init__: function() {
        // Inherit world properties.
        World.call(this, 'SettingsWorld');

        /* __   __   __   ___         ___
          |__) |__) /  \ |__  | |    |__     |  |  /\  |    |
          |    |  \ \__/ |    | |___ |___    |/\| /~~\ |___ |___ */
        var wall_profile_position = new THREE.Vector3(500, 500, 700);
        var wall_profile_width    = 650;
        var wall_profile_height   = 512 / 2;
        var wall_profile_normal   = new THREE.Vector3(-0.5, 0.0, -0.85);
        var wall_profile_scalable = false;
        this.wall_user_profile = new FloatingWall(wall_profile_width, wall_profile_height, wall_profile_position, wall_profile_normal, this, wall_profile_scalable);
        this.wall_user_profile.add_3D_title('Profile Information');

        // Username.
        this.profile_name_label = this.wall_user_profile.add_floating_2d_text(0, 1 / 3, 'Username :', TYPE_CONSTANT_TEXT, 0);
        this.profile_name_input = this.wall_user_profile.add_floating_2d_text(1 / 3, 1, '', TYPE_CONSTANT_TEXT, 0);

        // Email.
        this.profile_email_label = this.wall_user_profile.add_floating_2d_text(0, 1 / 3, 'Email :', TYPE_CONSTANT_TEXT, 1);
        this.profile_email_input = this.wall_user_profile.add_floating_2d_text(1 / 3, 1, '', TYPE_CONSTANT_TEXT, 1);

        // Phone Number.
        this.profile_phone_number_label = this.wall_user_profile.add_floating_2d_text(0, 1 / 3, 'Phone Number :', TYPE_CONSTANT_TEXT, 2);
        this.profile_phone_number_input = this.wall_user_profile.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_REGULAR, 2);

        // Phone Carrier.
        this.profile_phone_carrier_label = this.wall_user_profile.add_floating_2d_text(0, 1 / 3, 'Phone Carrier :', TYPE_CONSTANT_TEXT, 3);
        this.profile_phone_carrier_input = this.wall_user_profile.add_floating_2d_text(1 / 3, 1, '', TYPE_INPUT_REGULAR, 3);
        this.profile_phone_carrier_input.engable = false;
        this.profile_phone_carrier_input.set_engage_function(this.select_phone_carrier.bind(this));

        // Phone Carrier List.
        this.profile_phone_carrier_list = this.wall_user_profile.add_floating_wall_off_of_button(350, 400, this.profile_phone_carrier_input, false);
        this.profile_phone_carrier_list.add_3D_title('Select Phone Carrier');
        var current_row_index = 0;
        for (var property in CELL_PHONE_CARRIERS) {
            if (CELL_PHONE_CARRIERS.hasOwnProperty(property)) {
                var current_cell_phone_carrier = this.profile_phone_carrier_list.add_floating_2d_text(0, 1, property, TYPE_BUTTON, current_row_index);
                current_row_index += 1;
                current_cell_phone_carrier.set_engage_function(this.selected_phone_carrier.bind(this, property));
            }
        }

        this.profile_phone_carrier_list.set_to_invisible();

        // Created at date.
        this.profile_created_at_date_label = this.wall_user_profile.add_floating_2d_text(0, 1 / 3, 'Date Created :', TYPE_CONSTANT_TEXT, 4);
        this.profile_created_at_date_input = this.wall_user_profile.add_floating_2d_text(1 / 3, 1, '', TYPE_CONSTANT_TEXT, 4);

        /* __   ___ ___ ___         __   __
          /__` |__   |   |  | |\ | / _` /__`    |  |  /\  |    |
          .__/ |___  |   |  | | \| \__> .__/    |/\| /~~\ |___ |___ */

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

        // TODO : Create option for a FloatingWall's height to be dynamically be updated based on how many rows there are.
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

        CURRENT_PLAYER.set_position_xyz(-1000, 350, 350);
        CURRENT_PLAYER.look_at(new THREE.Vector3(0.992, 0.124, -0.122));

        this.previous_world = MANAGER_WORLD.previous_world;

        // Set the profile information values.

        this.profile_name_input.update_text(ENTITY_OWNER.get_username());
        this.profile_email_input.update_text(ENTITY_OWNER.get_email());
        this.profile_phone_number_input.update_text(ENTITY_OWNER.get_phone_number());
        this.profile_phone_carrier_input.update_text(ENTITY_OWNER.get_phone_carrier());
        this.profile_created_at_date_input.update_text(ENTITY_OWNER.get_created_at_date());


        l(this.wall_user_profile.floating_3D_title.get_text_length());
        l(this.wall_settings.floating_3D_title.get_text_length());
    },

    exit_world: function() {
    }
};
