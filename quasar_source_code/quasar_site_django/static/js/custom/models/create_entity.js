'use strict';

function CreateEntity(entity_wall, entity_created_bind_function, position, normal, width, height) {
    this.__init__(entity_wall, entity_created_bind_function, position, normal, width, height);
}

// Random global TODO : eventually set a standard for the z-depth difference between layers on FloatingWalls.

/*
ENTITY_TYPE_NO_SPECIAL_TYPE
ENTITY_TYPE_TEXT_REMINDER
ENTITY_TYPE_TASK
ENTITY_TYPE_TIME
ENTITY_TYPE_BASE
 */

//const TEMP_PROPERTY_A = 'Text Contents :'
//const TEMP_PROPERTY_B = 'Seconds from now :'
//const TEMP_PROPERTY_C = 'Send to :'

// TODO : Move this to globals.
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
};

CreateEntity.prototype = {

    // TODO : Deal with all 'set_engage_function' functions.

    entity_created_bind_function: null,

    /*
    select_date: function(floating_2d_text) {
        l('Set the date!')

        var add_attribute_prompt_width = 400
        var temp_position = new THREE.Vector3(0, 0, 0)
        this.add_attribute_prompt = new FloatingWall(add_attribute_prompt_width, 300, temp_position, this.normal, this.world)

        if (this.date_time_selector === null) {
            this.date_time_selector = new FloatingWall()
        }
    },
    */

    get_owner_sms_email: function() {
        var owner_entity = MANAGER_ENTITY.get_owner_entity();

        var owner_provider = owner_entity.get_value('owner_phone_carrier');
        var owner_phone_number = owner_entity.get_value('owner_phone_number');
        var owner_sms_address;

        for (var key in CELL_PHONE_CARRIERS) {
            if (CELL_PHONE_CARRIERS.hasOwnProperty(key)) {

                if (key === owner_provider) {
                    owner_sms_address = CELL_PHONE_CARRIERS[key].replace('number', owner_phone_number);
                }
            }
        }

        return owner_sms_address;
    },

    entity_row_type_selected: function(selected_type) {
        l('The selected type is : ' + selected_type);

        // Wall title.
        this.create_entity_wall_title = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width, 'Create a New ' + selected_type, TYPE_TITLE, 0, 2, 1, 0);
        this.entity_type_selector.set_to_invisible();

        this.add_create_entity_field(ENTITY_PROPERTY_NAME, 'entity default name', false, true);
        this.add_create_entity_field(ENTITY_PROPERTY_TYPE, selected_type, false, false);

        switch (selected_type) {
        case ENTITY_TYPE_NO_SPECIAL_TYPE:
            break;
        case ENTITY_TYPE_TEXT_REMINDER:
            this.add_create_entity_field(TEMP_PROPERTY_A, 'message here', false, true);
            this.add_create_entity_field('PID :', 'to be filled out by the server', false, false);

            this.add_create_entity_field(TEMP_PROPERTY_B, '5', false, true);
            this.add_create_entity_field(TEMP_PROPERTY_C, this.get_owner_sms_email(), false, false);

            // TODO : Date time selector
            //var fields = this.add_create_entity_field('Date and Time', 'click me to set!', false, false)
            //fields[1].set_engage_function(this.select_date.bind(this, fields[1]))
            break;
        case ENTITY_TYPE_TASK:
            break;
        case ENTITY_TYPE_TIME:
            break;
        case ENTITY_TYPE_BASE:
            break;
        }
        this.entity_type_selector.set_to_invisible();
        this.create_entity_wall.set_to_visible();
    },

    close_button_pressed: function() {
        this.create_entity_wall.set_to_invisible();
        this.clear_create_entity_fields();
    },

    add_attribute_prompt_close_button_pressed: function() {
        this.add_attribute_prompt.set_to_invisible();
    },

    add_attribute_button_pressed: function() {
        var position_update = new THREE.Vector3(this.add_attribute_button.get_position().x, this.add_attribute_button.get_position().y, this.add_attribute_button.get_position().z);
        position_update.addScaledVector(this.normal, 10);
        this.add_attribute_prompt.update_position(position_update);
        this.add_attribute_prompt.set_to_visible();
    },

    save_entity_button_pressed: function() {
        //console.log('Save the entity!!!!')

        var entity_name;
        var properties = {};

        for (var i = 0; i < this.create_entity_fields.length; i++) {
            var entity_field_label = this.create_entity_fields[i][0].get_text();
            var entity_field_value = this.create_entity_fields[i][1].get_text();

            l('Printing the label and then value :');
            l(entity_field_label);
            l(entity_field_value);

            if (entity_field_label === ENTITY_PROPERTY_NAME) {
                entity_name = entity_field_value;
            }
            if (ENTITY_PROPERTY_ALL.indexOf(entity_field_label) !== NOT_FOUND) {
                properties[entity_field_label] = entity_field_value;
            }
        }

        //l('Printing the properties')
        //l(properties)

        var new_entity = MANAGER_ENTITY.add_new_entity(entity_name, properties);
        new_entity.add_parent(this.entity_wall.get_wall_entity());
        this.entity_wall.add_entity(new_entity);

        this.create_entity_wall.set_to_invisible();
        this.clear_create_entity_fields();
    },

    __init__: function(entity_wall, entity_created_bind_function, position, normal, width, height) {
        this.entity_wall = entity_wall;
        this.world = this.entity_wall.world;
        this.position = position;
        this.normal = normal;
        this.width = width;
        this.height = height;

        this.entity_created_bind_function = entity_created_bind_function;

        this.date_time_selector = null;

        /* ___      ___   ___        ___      __   ___     __   ___       ___  __  ___  __   __
          |__  |\ |  |  |  |  \ /     |  \ / |__) |__     /__` |__  |    |__  /  `  |  /  \ |__)    .
          |___ | \|  |  |  |   |      |   |  |    |___    .__/ |___ |___ |___ \__,  |  \__/ |  \    .*/
        var entity_type_selector_position = new THREE.Vector3(this.position.x + this.normal.z * 14, this.position.y + this.normal.z * 14, this.position.z + this.normal.z * 14);
        this.entity_type_selector = new FloatingWall(this.width, this.height, entity_type_selector_position, this.normal, this.world);

        // Entity type selector - title.
        this.entity_type_selector.add_floating_2d_text(this.width, 'Select Entity Type', TYPE_TITLE, 0, 4, 1, 0);
        var entity_type_row_index = 4;
        for (var f = 0; f < ENTITY_TYPE_ALL.length; f++) {
            var entity_type_row = this.entity_type_selector.add_floating_2d_text(this.width, ENTITY_TYPE_ALL[f], TYPE_BUTTON, 0, 4, entity_type_row_index, 0);
            entity_type_row_index += 1;

            this.entity_wall.world.interactive_objects.push(entity_type_row);

            entity_type_row.set_engage_function(this.entity_row_type_selected.bind(this, ENTITY_TYPE_ALL[f]));
        }

        this.entity_type_selector.set_to_invisible();

        /* __   __   ___      ___  ___     ___      ___   ___
          /  ` |__) |__   /\   |  |__     |__  |\ |  |  |  |  \ /    .
          \__, |  \ |___ /~~\  |  |___    |___ | \|  |  |  |   |     .*/
        this.create_entity_fields = [];

        this.entity_wall_width = 400;
        // TODO : Height needs to be dynamically determined from the number of rows needed.
        var entity_wall_height = 512 / 2;
        this.create_entity_wall = new FloatingWall(this.entity_wall_width, entity_wall_height, entity_type_selector_position, this.normal, this.world);

        // Close button.
        var create_entity_wall_close_button = this.create_entity_wall.add_close_button(3);
        create_entity_wall_close_button.set_engage_function(this.close_button_pressed.bind(this));

        // Attribute button.
        this.add_attribute_button = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width, 'Add Attribute', TYPE_BUTTON, 0, 1, 3, 0);
        this.add_attribute_button.set_engage_function(this.add_attribute_button_pressed.bind(this));

        // Save Entity button.
        this.save_entity_button = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width, 'Save Entity', TYPE_BUTTON, 0, 2, 0, (-entity_wall_height + 16));
        this.save_entity_button.set_engage_function(this.save_entity_button_pressed.bind(this));
        //////

        this.create_entity_wall.set_to_invisible();

        /*      __   __          ___ ___  __     __       ___  ___
           /\  |  \ |  \     /\   |   |  |__) | |__) |  |  |  |__     .
          /~~\ |__/ |__/    /~~\  |   |  |  \ | |__) \__/  |  |___    .*/
        var add_attribute_prompt_width = 400;
        var temp_position = new THREE.Vector3(0, 0, 0);
        this.add_attribute_prompt = new FloatingWall(add_attribute_prompt_width, 300, temp_position, this.normal, this.world);

        // TODO : Create/fill out the add attribute wall, custom Entity types will require this (currently only need to use set in stone entity types)

        //var add_attribute_title = this.add_attribute_prompt.add_floating_2d_text(add_attribute_prompt_width / 2, 'Add Attribute')

        this.add_attribute_prompt_close_button = this.add_attribute_prompt.add_close_button(1);
        this.add_attribute_prompt_close_button.set_engage_function(this.add_attribute_prompt_close_button_pressed.bind(this));

        this.add_attribute_prompt.set_to_invisible();
        /////


        // Make sure to add interactive objects back to the wall.
        this.entity_wall.world.interactive_objects.push(this.add_attribute_button);
        this.entity_wall.world.interactive_objects.push(this.save_entity_button);
        this.entity_wall.world.interactive_objects.push(create_entity_wall_close_button);
    },

    set_to_visible: function() {
        // This set to function is only intended for initially displaying the EntityType selector list.
        this.entity_type_selector.set_to_visible();
    },

    remove_from_scene: function() {
        this.entity_type_selector.remove_from_scene();
        this.create_entity_wall.remove_from_scene();
        this.add_attribute_prompt.remove_from_scene();
    },

    /* __   __   ___      ___  ___     ___      ___   ___                                    ___          ___    ___  __
      /  ` |__) |__   /\   |  |__     |__  |\ |  |  |  |  \ /    |  |  /\  |    |       |  |  |  | |    |  |  | |__  /__`    .
      \__, |  \ |___ /~~\  |  |___    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___    \__/  |  | |___ |  |  | |___ .__/    .*/

    add_create_entity_field: function(attribute_name, default_input, label_modifiable, input_modifiable) {
        var y_offset = this.create_entity_fields.length * (16 + 2);
        var input_type_label = TYPE_INPUT_REGULAR;
        var input_type_input = TYPE_INPUT_REGULAR;
        if (is_defined(label_modifiable)) {
            if (!label_modifiable) {
                input_type_label = TYPE_CONSTANT_TEXT;
            }
        }
        if (is_defined(input_modifiable)) {
            if (!input_modifiable) {
                input_type_input = TYPE_CONSTANT_TEXT;
            }
        }


        // WAS  :  var entity_wall_entity_name = this.create_entity_wall.add_floating_2d_text(this.width / 3, attribute_name, input_type_label, this.width / -3, 1, 4, -y_offset)
        // TODO : Change these variables names
        var entity_wall_entity_name = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width / 2, attribute_name, input_type_label, this.entity_wall_width / -4, 1, 4, -y_offset);

        var entity_wall_entity_name_input = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width / 2, '', input_type_input, this.entity_wall_width / 4, 1, 4, -y_offset);

        if (is_defined(default_input)) {
            entity_wall_entity_name_input.update_text(default_input);
        }

        this.entity_wall.world.interactive_objects.push(entity_wall_entity_name);
        this.entity_wall.world.interactive_objects.push(entity_wall_entity_name_input);

        this.create_entity_fields.push([entity_wall_entity_name, entity_wall_entity_name_input]);

        return [entity_wall_entity_name, entity_wall_entity_name_input];
    },

    clear_create_entity_fields: function() {
        for (var i = 0; i < this.create_entity_fields.length; i++) {

            var field_label = this.create_entity_fields[i][0];
            var field_input = this.create_entity_fields[i][1];

            // Remove from interactive objects.
            var index_of_field_label = this.entity_wall.world.interactive_objects.indexOf(field_label);
            if (index_of_field_label > -1) {
                this.entity_wall.world.interactive_objects.splice(index_of_field_label, 1);
            } else {
                l('Warning : did not find the field label to remove.');
                l(field_label);
            }

            var index_of_field_input = this.entity_wall.world.interactive_objects.indexOf(field_input);
            if (index_of_field_input > -1) {
                this.entity_wall.world.interactive_objects.splice(index_of_field_input, 1);
            } else {
                l('WARNING : did not find the field input to remove.');
                l(field_input);
            }

            // Remove from the scene/world.
            this.world.remove_from_scene(field_label);
            this.world.remove_from_scene(field_input);
        }

        // Also remove the title
        this.world.remove_from_scene(this.create_entity_wall_title);

        // Finally, empty out the create_entity_fields list.
        this.create_entity_fields.length = 0;
    }

};
