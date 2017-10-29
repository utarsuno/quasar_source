'use strict'

function SettingsWorld() {
    this.__init__()
}

// Cell phone carriers.
const CELL_PHONE_CARRIERS = {
    'None'             : '',
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

SettingsWorld.prototype = {

    previous_world: null,

    owner_entity: null,

    select_phone_carrier: function() {
        this.phone_carrier_list.set_to_visible()
    },

    selected_phone_carrier: function(selected_phone_carrier) {
        this.phone_carrier_list.set_to_invisible()
        l('The selected phone carrier is: ')
        l(selected_phone_carrier)
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

        this.profile_name_label = this.profile_editor.add_floating_2d_text(label_width, 'Username', TYPE_INPUT_REGULAR, label_offset, 2, 3, 0)
        this.profile_name_label.engable = false
        this.profile_name_label.set_default_color(COLOR_TEXT_CONSTANT)
        //this.profile_editor.add_object_to_remove_later(profile_name)

        this.profile_name_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 3, 0)
        //this.profile_editor.add_object_to_remove_later(profile_name_input)

        this.profile_email_label = this.profile_editor.add_floating_2d_text(label_width, 'Email', TYPE_INPUT_REGULAR, label_offset, 2, 4, 0)
        this.profile_email_label.engable = false
        this.profile_email_label.set_default_color(COLOR_TEXT_CONSTANT)
        this.profile_email_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 4, 0)

        this.profile_phone_number_label = this.profile_editor.add_floating_2d_text(label_width, 'Phone Number', TYPE_INPUT_REGULAR, label_offset, 2, 5, 0)
        this.profile_phone_number_label.engable = false
        this.profile_phone_number_label.set_default_color(COLOR_TEXT_CONSTANT)
        this.profile_phone_number_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 5, 0)

        this.profile_phone_carrier_label = this.profile_editor.add_floating_2d_text(label_width, 'Phone Carrier', TYPE_INPUT_REGULAR, label_offset, 2, 6, 0)
        this.profile_phone_carrier_label.engable = false
        this.profile_phone_carrier_label.set_default_color(COLOR_TEXT_CONSTANT)
        this.profile_phone_carrier_input = this.profile_editor.add_floating_2d_text(1024 / 2, '', TYPE_INPUT_REGULAR, 1024 / -4 + (1024 / 4) + 50, 2, 6, 0)
        this.profile_phone_carrier_input.engable = false
        // TODO :
        this.profile_phone_carrier_input.set_engage_function(this.select_phone_carrier.bind(this))

        //////
        this.phone_carrier_list = new FloatingWall(512 / 2, 512, this.profile_phone_carrier_input.get_position().addScaledVector(this.normal, 8), this.normal, this)
        var phone_carrier_title = this.phone_carrier_list.add_floating_2d_text(512 / 2, 'Select Phone Carrier', TYPE_TITLE, 0, 4, 0, 0)
        var pc0 = this.phone_carrier_list.add_floating_2d_text(512 / 2, 'AT&T', TYPE_BUTTON, 0, 4, 4, 0)

        //pc0.set_engage_function(this.selected_phone_carrier('AT&T').bind(this))
        pc0.set_engage_function(function(){return this.selected_phone_carrier('AT&T')}.bind(this))

        var pc1 = this.phone_carrier_list.add_floating_2d_text(512 / 2, 'T-Mobile', TYPE_BUTTON, 0, 4, 5, 0)
        //pc1.set_engage_function(this.selected_phone_carrier('T-Mobile').bind(this))
        pc1.set_engage_function(function(){return this.selected_phone_carrier('T-Mobile')}.bind(this))
        this.phone_carrier_list.set_to_invisible()
        //////


        this.save_changes = this.profile_editor.add_floating_2d_text(1024, 'Save Changes', TYPE_BUTTON, 0, 2, 8, 0)


        this.interactive_objects.push(pc0)


        this.interactive_objects.push(this.profile_name_label)
        this.interactive_objects.push(this.profile_name_input)
        this.interactive_objects.push(this.profile_email_label)
        this.interactive_objects.push(this.profile_email_input)
        this.interactive_objects.push(this.profile_phone_number_label)
        this.interactive_objects.push(this.profile_phone_number_input)
        this.interactive_objects.push(this.profile_phone_carrier_label)
        this.interactive_objects.push(this.profile_phone_carrier_input)
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
    },

    exit_world: function() {
    }
}
