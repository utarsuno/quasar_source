'use strict'

function SettingsWorld() {
    this.__init__()
}

/*

// Cell phone carriers.
const CELL_PHONE_CARRIERS = {
    'No Value'         : '',
    'AT&T'             : 'number@txt.att.net',
    'T-Mobile'         : 'number@tmomail.net',
    'Verizon'          : 'number@vtext.com',
    'Sprint'           : 'number@pm.sprint.com',
    'Virgin Mobile'    : 'number@vmobl.com',
    'Tracfone'         : 'number@mmst5.tracfone.com',
    'Metro PCS'        : 'number@mymetropcs.com',
    'Boost Mobile'     : 'number@myboostmobile.com',
    'Cricket'          : 'number@mms.cricketwireless.net',
    'Ptel'             : 'number@ptel.com',
    'Republic Wireless': 'number@text.republicwireless.com',
    'Google Fi'        : 'number@msg.fi.google.com',
    'Suncom'           : 'number@tms.suncom.com',
    'Ting'             : 'number@message.ting.com',
    'U.S. Cellular'    : 'number@email.uscc.net',
    'Consumer Cellular': 'number@cingularme.com',
    'C-Spire'          : 'number@cspire1.com',
    'Page Plus'        : 'number@vtext.com'
}

*/

const CELL_PHONE_CARRIERS_AS_LIST = [
    'No Value',
    'AT&T',
    'T-Mobile',
    'Verizon',
    'Sprint',
    'Virgin Mobile',
    'Tracfone',
    'Metro PCS',
    'Boost Mobile',
    'Cricket',
    'Ptel',
    'Republic Wireless',
    'Google Fi',
    'Suncom',
    'Ting',
    'U.S. Cellular',
    'Consumer Cellular',
    'C-Spire',
    'Page Plus'
]

SettingsWorld.prototype = {

    previous_world: null,

    owner_entity: null,

    select_phone_carrier: function() {
        this.phone_carrier_list.set_to_visible()
    },

    selected_phone_carrier: function(selected_phone_carrier) {
        this.profile_phone_carrier_input.update_text(selected_phone_carrier)
        this.phone_carrier_list.set_to_invisible()
    },

    save_changes_button_pressed: function() {
        var changes_occured = false

        if (this.profile_email_input.get_text() !== this.owner_entity.get_value('owner_email')) {
            this.owner_entity.set_property('owner_email', this.profile_email_input.get_text())
            changes_occured = true
        }
        if (this.profile_phone_number_input.get_text() !== this.owner_entity.get_value('owner_phone_number')) {
            this.owner_entity.set_property('owner_phone_number', this.profile_phone_number_input.get_text())
            changes_occured = true
        }
        if (this.profile_phone_carrier_input.get_text() !== this.owner_entity.get_value('owner_phone_carrier')) {
            this.owner_entity.set_property('owner_phone_carrier', this.profile_phone_carrier_input.get_text())
            changes_occured = true
        }

        if (changes_occured) {
            ENTITY_MANAGER.update_server_and_database()
        }
    },

    __init__: function() {
        this.owner_entity = null

        // Inherit world properties.
        World.call(this, 'SettingsWorld')

        var position = new THREE.Vector3(500, 500, 700)
        this.normal = new THREE.Vector3(-.5, 0, -.85)
        this.normal.normalize()
        this.profile_editor = new FloatingWall(1024, 512 / 2, position, this.normal, this)

        var create_entity_wall_title = this.profile_editor.add_floating_2d_text(1024 / 2, 'Profile Information', TYPE_TITLE, 1024 / -4, 2, 0, 0)
        create_entity_wall_title.set_default_color(COLOR_TEXT_CONSTANT)
        this.profile_editor.add_object_to_remove_later(create_entity_wall_title)

        var label_width = 1024 / 8
        var label_offset = (1024 / -4) - label_width / 2

        this.profile_name_label = this.profile_editor.add_floating_2d_text(label_width, 'Username', TYPE_CONSTANT_TEXT, label_offset, 2, 3, 0)

        this.profile_name_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_CONSTANT_TEXT, 1024 / -4 + (1024 / 4) + 50, 2, 3, 0)

        this.profile_email_label = this.profile_editor.add_floating_2d_text(label_width, 'Email', TYPE_CONSTANT_TEXT, label_offset, 2, 4, 0)
        this.profile_email_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 4, 0)

        this.profile_phone_number_label = this.profile_editor.add_floating_2d_text(label_width, 'Phone Number', TYPE_CONSTANT_TEXT, label_offset, 2, 5, 0)
        this.profile_phone_number_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 5, 0)

        this.profile_phone_carrier_label = this.profile_editor.add_floating_2d_text(label_width, 'Phone Carrier', TYPE_CONSTANT_TEXT, label_offset, 2, 6, 0)
        this.profile_phone_carrier_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 6, 0)
        this.profile_phone_carrier_input.engable = false

        // Created at date.
        this.profile_created_at_date_label = this.profile_editor.add_floating_2d_text(label_width, 'Created at Date', TYPE_CONSTANT_TEXT, label_offset, 2, 7, 0)
        this.profile_created_at_date_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_CONSTANT_TEXT, 1024 / -4 + (1024 / 4) + 50, 2, 7, 0)

        this.profile_phone_carrier_input.set_engage_function(this.select_phone_carrier.bind(this))

        //////
        var phone_carrier_list_position = new THREE.Vector3(this.profile_phone_carrier_input.get_position().x + this.normal.x * 8, this.profile_phone_carrier_input.get_position().y + this.normal.y * 8, this.profile_phone_carrier_input.get_position().z + this.normal.z * 8)
        this.phone_carrier_list = new FloatingWall(512 / 2, 512, phone_carrier_list_position, this.normal, this)
        var phone_carrier_title = this.phone_carrier_list.add_floating_2d_text(512 / 2, 'Select Phone Carrier', TYPE_TITLE, 0, 4, 0, 0)

        var current_row_index = 4

        // Add all the possible cell phone carriers.
        for (var property in CELL_PHONE_CARRIERS) {
            if (CELL_PHONE_CARRIERS.hasOwnProperty(property)) {
                var current_cell_phone_carrier = this.phone_carrier_list.add_floating_2d_text(512 / 2, CELL_PHONE_CARRIERS_AS_LIST[current_row_index - 4], TYPE_BUTTON, 0, 4, current_row_index, 0)
                current_row_index += 1
                this.interactive_objects.push(current_cell_phone_carrier)
                current_cell_phone_carrier.set_engage_function(this.selected_phone_carrier.bind(this, property))
            }
        }

        this.phone_carrier_list.set_to_invisible()
        //////

        this.save_changes = this.profile_editor.add_floating_2d_text(1024, 'Save Changes', TYPE_BUTTON, 0, 2, 8, 0)
        this.save_changes.set_engage_function(this.save_changes_button_pressed.bind(this))

        /////
        // Define the first camera FOV slider here.
        var slider_fov_position     = new THREE.Vector3(1200, 500, -350)
        var slider_fov_normal       = new THREE.Vector3(-0.969, -0.115, -0.221)
        var slider_fov_width        = 500
        this.slider_fov = new FloatingSlider(90, 60, 120, slider_fov_width, slider_fov_position, slider_fov_normal, this)
        /////


        this.interactive_objects.push(this.profile_name_label)
        this.interactive_objects.push(this.profile_name_input)
        this.interactive_objects.push(this.profile_email_label)
        this.interactive_objects.push(this.profile_email_input)
        this.interactive_objects.push(this.profile_phone_number_label)
        this.interactive_objects.push(this.profile_phone_number_input)
        this.interactive_objects.push(this.profile_phone_carrier_label)
        this.interactive_objects.push(this.profile_phone_carrier_input)
        this.interactive_objects.push(this.profile_created_at_date_label)
        this.interactive_objects.push(this.profile_created_at_date_input)
        this.interactive_objects.push(this.save_changes)
    },

    update: function() {
        this.update_interactive_objects()
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
    },

    enter_world: function() {
        this.player.disengage()
        if (!PAUSED_MENU.currently_displayed) {
            this.player.enable_controls()
        }

        this.player.set_position(new THREE.Vector3(-1000, 350, 350))
        this.player.look_at(new THREE.Vector3(0.992, 0.124, -0.122))

        this.previous_world = WORLD_MANAGER.previous_world

        // Set the profile information values.

        // TODO : Grab the values from the owner entity!
        if (this.owner_entity === null) {
            this.owner_entity = ENTITY_MANAGER.get_all_entities_of_type(ENTITY_TYPE_OWNER)[0]
        }

        this.profile_name_input.update_text(this.player.owner.username)
        this.profile_email_input.update_text(this.owner_entity.get_value('owner_email'))
        this.profile_phone_number_input.update_text(this.owner_entity.get_value('owner_phone_number'))
        this.profile_phone_carrier_input.update_text(this.owner_entity.get_value('owner_phone_carrier'))
        this.profile_created_at_date_input.update_text(this.owner_entity.get_value('owner_created_at_date'))
    },

    exit_world: function() {
    }
}
