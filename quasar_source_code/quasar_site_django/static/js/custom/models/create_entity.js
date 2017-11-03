'use strict'

function CreateEntity(entity_wall, entity_created_bind_function, position, normal, width, height) {
    this.__init__(entity_wall, entity_created_bind_function, position, normal, width, height)
}

// Random global TODO : eventually set a standard for the z-depth difference between layers on FloatingWalls.

CreateEntity.prototype = {

    // TODO : Deal with all 'set_engage_function' functions.

    entity_created_bind_function: null,

    entity_row_type_selected: function(selected_type) {
        l('The selected type is : ' + selected_type)
        this.entity_type_selector.set_to_invisible()

        this.clear_create_entity_fields()

        // TODO : This needs to be determined from the Entity Type.
        //this.add_create_entity_field(ENTITY_PROPERTY_NAME, this.entity_wall_width)
        //this.add_create_entity_field(ENTITY_PROPERTY_TYPE, this.entity_wall_width)

        this.create_entity_wall.set_to_visible()
    },

    close_button_pressed: function() {
        this.create_entity_wall.set_to_invisible()
    },

    add_attribute_prompt_close_button_pressed: function() {
        this.add_attribute_prompt.set_to_invisible()
    },

    add_attribute_button_pressed: function() {
        var position_update = new THREE.Vector3(this.add_attribute_button.get_position().x, this.add_attribute_button.get_position().y, this.add_attribute_button.get_position().z)
        position_update.addScaledVector(this.normal, 10)
        this.add_attribute_prompt.update_position(position_update)
        this.add_attribute_prompt.set_to_visible()
    },

    save_entity_button_pressed: function() {
        //console.log('Save the entity!!!!')

        var entity_name
        var properties = {}

        for (var i = 0; i < this.create_entity_fields.length; i++) {
            var entity_field_label = this.create_entity_fields[i][0].get_text()
            var entity_field_value = this.create_entity_fields[i][1].get_text()

            l('Printing the label and then value :')
            l(entity_field_label)
            l(entity_field_value)

            if (entity_field_label === ENTITY_PROPERTY_NAME) {
                entity_name = entity_field_value
            }
            // Used to be : if (ENTITY_PROPERTY_ALL.indexOf(properties[entity_field_label]) !== NOT_FOUND) {
            if (ENTITY_PROPERTY_ALL.indexOf(entity_field_label) !== NOT_FOUND) {
                properties[entity_field_label] = entity_field_value
            }
        }

        l('Printing the properties')
        l(properties)

        var new_entity = ENTITY_MANAGER.add_new_entity(entity_name, properties)
        new_entity.add_parent(this.self_entity)
        this.add_entity(new_entity)

        this.create_entity_wall.set_to_invisible()
    },

    __init__: function(entity_wall, entity_created_bind_function, position, normal, width, height) {
        this.entity_wall = entity_wall
        this.world = this.entity_wall.world
        this.position = position
        this.normal = normal
        this.width = width
        this.height = height

        this.entity_created_bind_function = entity_created_bind_function

        /* ___      ___   ___        ___      __   ___     __   ___       ___  __  ___  __   __
          |__  |\ |  |  |  |  \ /     |  \ / |__) |__     /__` |__  |    |__  /  `  |  /  \ |__)    .
          |___ | \|  |  |  |   |      |   |  |    |___    .__/ |___ |___ |___ \__,  |  \__/ |  \    .*/
        var entity_type_selector_position = new THREE.Vector3(this.position.x + this.normal.z * 14, this.position.y + this.normal.z * 14, this.position.z + this.normal.z * 14)
        this.entity_type_selector = new FloatingWall(this.width, this.height, entity_type_selector_position, this.normal, this.world)

        // Entity type selector - title.
        this.entity_type_selector.add_floating_2d_text(this.width, 'Select Entity Type', TYPE_TITLE, 0, 4, 1, 0)
        var entity_type_row_index = 4
        for (var f = 0; f < ENTITY_TYPE_ALL.length; f++) {
            var entity_type_row = this.entity_type_selector.add_floating_2d_text(this.width, ENTITY_TYPE_ALL[f], TYPE_BUTTON, 0, 4, entity_type_row_index, 0)
            entity_type_row_index += 1
            this.interactive_objects.push(entity_type_row)
            // TODO :
            entity_type_row.set_engage_function(this.entity_row_type_selected.bind(this, ENTITY_TYPE_ALL[f]))
        }

        this.entity_type_selector.set_to_invisible()

        /* __   __   ___      ___  ___     ___      ___   ___
          /  ` |__) |__   /\   |  |__     |__  |\ |  |  |  |  \ /    .
          \__, |  \ |___ /~~\  |  |___    |___ | \|  |  |  |   |     .*/
        this.create_entity_fields = []

        this.entity_wall_width = 400
        // TODO : Height needs to be dynamically determined from the number of rows needed.
        var entity_wall_height = 512 / 2
        this.create_entity_wall = new FloatingWall(this.entity_wall_width, entity_wall_height, entity_type_selector_position, this.normal, this.world)

        // Wall title.
        this.create_entity_wall.add_floating_2d_text(this.entity_wall_width / 2, 'Create Entity', TYPE_TITLE, this.entity_wall_width / -4, 2, 0, 0)

        // Close button.
        var create_entity_wall_close_button = this.create_entity_wall.add_close_button(1)
        create_entity_wall_close_button.set_engage_function(this.close_button_pressed.bind(this))

        // Attribute button.
        this.add_attribute_button = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width, 'Add Attribute', TYPE_BUTTON, 0, 1, 2, 0)
        this.add_attribute_button.set_engage_function(this.add_attribute_button_pressed.bind(this))

        // Entity button.
        this.save_entity_button = this.create_entity_wall.add_floating_2d_text(this.entity_wall_width, 'Save Entity', TYPE_BUTTON, 0, 2, -16, -entity_wall_height)
        this.save_entity_button.set_engage_function(this.save_entity_button_pressed.bind(this))
        //////

        this.create_entity_wall.set_to_invisible()

        // Entity wall save changes button.
        this.save_changes = new Floating2DText(this.width, 'Save Changes', TYPE_BUTTON, this.scene)
        this.save_changes.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(2), 0, 1), this.get_look_at_for_row(0, this.get_y_position_for_row(2), 0, 1))
        this.save_changes.set_engage_function(this.entity_wall.send_changes_to_server)

        /*      __   __          ___ ___  __     __       ___  ___
           /\  |  \ |  \     /\   |   |  |__) | |__) |  |  |  |__     .
          /~~\ |__/ |__/    /~~\  |   |  |  \ | |__) \__/  |  |___    .*/
        var add_attribute_prompt_width = 400
        var temp_position = new THREE.Vector3(0, 0, 0)
        this.add_attribute_prompt = new FloatingWall(add_attribute_prompt_width, 300, temp_position, this.normal, this.world)

        // TODO : Create/fill out the add attribute wall, custom Entity types will require this (currently only need to use set in stone entity types)

        //var add_attribute_title = this.add_attribute_prompt.add_floating_2d_text(add_attribute_prompt_width / 2, 'Add Attribute')

        this.add_attribute_prompt_close_button = this.add_attribute_prompt.add_close_button(1)
        this.add_attribute_prompt_close_button.set_engage_function(this.add_attribute_prompt_close_button_pressed.bind(this))

        this.add_attribute_prompt.set_to_invisible()
        /////


        // Make sure to add interactive objects back to the wall.
        this.entity_wall.interactive_objects.push(this.add_attribute_button)
        this.entity_wall.interactive_objects.push(this.save_entity_button)
    }

}
