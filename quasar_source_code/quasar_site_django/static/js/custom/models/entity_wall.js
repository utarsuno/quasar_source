'use strict'

function EntityWall(position, look_at, world) {
    this.__init__(position, look_at, world)
}

EntityWall.prototype = {

    position    : null,
    look_at     : null,
    world       : null,
    scene       : null,

    normal      : null,
    depth_start : null,
    depth       : null,

    width       : null,
    height      : null,

    title_text  : null,
    title       : null,

    interactive_objects: null,

    self_entity: null,

    send_changes_to_server: function() {
        // This save data is for the Wall entity.
        var save_data = {}
        save_data.ENTITY_PROPERTY_NAME = this.title.get_text()
        // TODO : figure out this y positioning thing.
        save_data.ENTITY_PROPERTY_POSITION = '[' + this.position.x + ',' + this.position.y + ',' + this.position.z + ']'
        save_data.ENTITY_PROPERTY_LOOK_AT = '[' + this.look_at.x + ',' + this.look_at.y + ',' + this.look_at.z + ']'
        save_data.ENTITY_PROPERTY_TYPE = ENTITY_TYPE_WALL

        // The wall entity has not been created yet so create it.
        if (this.self_entity === null || this.self_entity === undefined) {
            this.self_entity = new Entity(this.title.get_text(), save_data)
        } else {
            // The wall entity already exists so simply update the values and then send the new values to the server.
            this.self_entity.update_values(save_data)
        }

        ENTITY_MANAGER.update_server_and_database()
    },

    set_entity: function(entity) {
        this.self_entity = entity
        console.log('The entity wall {' + this.title.get_text() + '} has the following self entity :')
        console.log(this.self_entity)
    },

    delete_entity_wall_pressed: function() {
        this.are_you_sure.set_to_visible()
    },

    perform_delete_entity_wall: function() {
        // TODO : Fix this function, make sure everything gets removed cleanly.

        // All child entities will be automatically deleted (if they don't have any other parent entity objects).
        ENTITY_MANAGER.delete_entity(this.self_entity)

        for (var i = 0; i < this.interactive_objects.length; i++) {
            this.world.remove_from_scene(this.interactive_objects[i].object3D)
        }
        this.world.remove_from_scene(this.object3D)

        this.are_you_sure.remove_from_scene()
        this.entities_display_wall.remove_from_scene()
        this.create_entity_wall.remove_from_scene()
        this.add_attribute_prompt.remove_from_scene()
        // TODO : make sure all resources are freed up (ex. THREE js calls to .dispose())
    },

    create_entity_button_pressed: function() {

        this.create_entity_wall.set_to_visible()
    },

    create_entity_wall_close_button_pressed: function() {
        this.create_entity_wall.set_to_invisible()
    },

    are_you_sure_close_button_pressed: function() {
        this.are_you_sure.set_to_invisible()
    },

    add_attribute_button_pressed: function() {
        var position_update = new THREE.Vector3(this.entity_wall_add_attribute.get_position().x, this.entity_wall_add_attribute.get_position().y, this.entity_wall_add_attribute.get_position().z)
        position_update.addScaledVector(this.normal, 10)
        this.add_attribute_prompt.update_position(position_update)
        this.add_attribute_prompt.set_to_visible()
    },

    add_attribute_prompt_close_button_pressed: function() {
        this.add_attribute_prompt.set_to_invisible()
    },

    entity_wall_save_entity_button_pressed: function() {
        //console.log('Save the entity!!!!')

        var entity_name
        var properties = {}

        for (var i = 0; i < this.create_entity_fields.length; i++) {
            var entity_field_label = this.create_entity_fields[i][0].get_text()
            var entity_field_value = this.create_entity_fields[i][1].get_text()

            console.log('Printing the label and then value :')
            console.log(entity_field_label)
            console.log(entity_field_value)

            if (entity_field_label === ENTITY_PROPERTY_NAME) {
                entity_name = entity_field_value
            }
            // Used to be : if (ENTITY_PROPERTY_ALL.indexOf(properties[entity_field_label]) !== NOT_FOUND) {
            if (ENTITY_PROPERTY_ALL.indexOf(entity_field_label) !== NOT_FOUND) {
                properties[entity_field_label] = entity_field_value
            }
        }

        console.log('Printing the properties')
        console.log(properties)

        var new_entity = ENTITY_MANAGER.add_new_entity(entity_name, properties)
        new_entity.add_parent(this.self_entity)
        this.add_entity(new_entity)

        this.create_entity_wall.set_to_invisible()
        // TODO : ALSO CLEAR THE FIELDS!!!
    },

    create_entity_close_button_pressed: function() {
        this.create_entity_wall.set_to_invisible()
    },

    entity_editor_close_button_pressed: function() {
        //this.current_entity_editor
        console.log('CLOSE THE ENTITY EDITOR!')

        // TODO : Eventually remove all aspects of the entity editor!!!
        // Super lazy solution for now is to make it invisible.
        this.current_entity_editor.set_to_invisible()

        //var index_of_editor = this.world.interactive_objects.indexOf(this.current_entity_editor)
        //this.world.interactive_objects.slice(index_of_editor, 1)
        //this.current_entity_editor.remove_from_scene()
    },

    entity_editor_save_changes_button_pressed: function() {
        var save_data = {}
        var labels = []
        var values = []

        var floating_texts = this.current_entity_editor.get_all_floating_2d_texts()

        var i
        for (i = 0; i < floating_texts.length; i++) {
            var current_label_position = floating_texts[i].get_label_position()
            var current_label          = floating_texts[i].get_label()

            if (current_label_position > -1) {
                if (current_label === 'l') {
                    labels.push([current_label_position, floating_texts[i].get_text()])
                } else {
                    values.push([current_label_position, floating_texts[i].get_text()])
                }
            }
        }

        for (i = 0; i < labels.length; i++) {
            for (var j = 0; j < values.length; j++) {
                if (labels[i][0] === values[j][0]) {
                    save_data[labels[i][1]] = values[j][1]
                }
            }
        }

        var entity_id = save_data[ENTITY_PROPERTY_ID]
        var entity = ENTITY_MANAGER.get_entity_by_id(entity_id)
        entity.update_values(save_data)

        this.current_floating_entity_row.update_text(save_data[ENTITY_PROPERTY_NAME])
        if (save_data[ENTITY_PROPERTY_TYPE] === ENTITY_TYPE_TASK) {
            if (save_data[ENTITY_PROPERTY_COMPLETED] === 'True') {
                this.current_floating_entity_row.set_default_color(COLOR_TEXT_GREEN)
            } else {
                this.current_floating_entity_row.set_default_color(COLOR_TEXT_RED)
            }
        }

        ENTITY_MANAGER.update_server_and_database()
        // TODO : only close if the POST call finished successfully

        // TODO : IMPORTANT! DELETE IT instead of making it invisible.
        this.current_entity_editor.set_to_invisible()
    },

    edit_entity_pressed: function() {
        console.log('EDIT THE PRESSED FLOATING ENTITY!!!!')

        for (var i = 0; i < this.floating_row_to_entity_list.length; i++) {
            if (this.floating_row_to_entity_list[i][0] === this.world.currently_looked_at_object) {
                console.log('EDIT THE FOLLOWING ENTITIY:')
                var current_entity = this.floating_row_to_entity_list[i][1]
                console.log(current_entity)

                //var y_offset = -(i) * (16 + 2)
                var position = new THREE.Vector3(this.world.currently_looked_at_object.get_position().x, this.world.currently_looked_at_object.get_position().y, this.world.currently_looked_at_object.get_position().z)
                position.addScaledVector(this.normal, 10)
                //var floating_row = this.entities_display_wall.add_floating_2d_text(this.entities_display_wall_width, entity.name, TYPE_BUTTON, 0, 4, 0, y_offset)

                console.log('Position to create the entity editor at :')
                console.log(position)

                var key_values = get_key_value_list_from_json_dictionary(current_entity.get_properties())

                var current_entity_editor_height = (key_values.length + 2) * (16 + 2)
                this.current_entity_editor = new FloatingWall(512, current_entity_editor_height, position, this.normal, this.world)
                this.current_floating_entity_row = this.floating_row_to_entity_list[i][0]

                var entity_editor_close_button = this.current_entity_editor.add_close_button(2)
                this.world.interactive_objects.push(entity_editor_close_button)

                for (var p = 0; p < key_values.length; p++) {
                    var property_name = this.current_entity_editor.add_floating_2d_text(512 / 3, key_values[p][0], TYPE_INPUT_REGULAR, -512 / 3, 2, p, 0)
                    property_name.set_label('l')
                    property_name.set_label_position(p)
                    var property_value = this.current_entity_editor.add_floating_2d_text((512 / 3) * 2, key_values[p][1], TYPE_INPUT_REGULAR, 512 / 3 - (512 / 6), 2, p, 0)
                    property_value.set_label('v')
                    property_value.set_label_position(p)

                    if (ENTITY_MANAGER.is_property_user_modifiable(property_name.get_text())) {
                        this.world.interactive_objects.push(property_name)
                        this.world.interactive_objects.push(property_value)
                    } else {
                        this.world.interactive_objects.push(property_name)
                        property_name.engable = false
                        this.world.interactive_objects.push(property_value)
                        property_name.engable = false
                        property_name.set_default_color(COLOR_TEXT_CONSTANT)
                        property_value.set_default_color(COLOR_TEXT_CONSTANT)
                    }
                }

                var edit_entity_save_changes_button = this.current_entity_editor.add_floating_2d_text(512, 'save changes', TYPE_BUTTON, 0, 2, key_values.length + 1, 0)
                this.world.interactive_objects.push(edit_entity_save_changes_button)
                edit_entity_save_changes_button.set_engage_function(this.entity_editor_save_changes_button_pressed.bind(this))



                /*
                this.interactive_wall.add_title('Modify : ' + this.entity.get_name())
                var key_values = get_key_value_list_from_json_dictionary(this.entity.get_properties())
                for (var i = 0; i < key_values.length; i++) {
                    this.interactive_wall.add_input_row(key_values[i][0], key_values[i][1])
                }
                 */


                // this.entity_wall_save_entity = this.create_entity_wall.add_floating_2d_text(entity_wall_width, 'Save Entity', TYPE_BUTTON, 0, 2, 0, -entity_wall_height)



                entity_editor_close_button.set_engage_function(this.entity_editor_close_button_pressed.bind(this))
            }
        }

    },

    __init__: function(position, world) {
        this.current_entity_editor = null


        this.position = position
        this.look_at  = new THREE.Vector3(0, this.position.y, 0)

        this.normal = new THREE.Vector3(this.look_at.x - this.position.x, this.look_at.y - this.position.y, this.look_at.z - this.position.z)
        this.normal.normalize()

        this.depth = new THREE.Vector3(this.normal.x * 20, this.normal.y * 20, this.normal.z * 20)
        this.depth_start = new THREE.Vector3(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2)

        this.world = world
        this.scene = this.world.scene

        this.object3D = new THREE.Object3D()

        this.object3D.position.x = position.x
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z
        this.object3D.lookAt(new THREE.Vector3(this.look_at.x, this.look_at.y, this.look_at.z))

        this.width = 512
        this.height = 1024

        this.interactive_objects = []

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height)



        //this.title = new Floating2DText((this.width / 4.0) * 3.0, this.title_text, TYPE_INPUT_REGULAR, this.scene)
        this.title = new Floating2DText(this.width, 'Default Group Name', TYPE_INPUT_REGULAR, this.scene)
        this.title.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(0), 0, 1), this.get_look_at_for_row(0, this.get_y_position_for_row(0), 0, 1))

        // Create entity button.
        var create_entity_position = this.get_position_for_row(0, this.get_y_position_for_row(1), 0, 1)
        this.create_entity = new Floating2DText(this.width, 'Create Entity', TYPE_BUTTON, this.scene)
        this.create_entity.update_position_and_look_at(create_entity_position, this.get_look_at_for_row(0, this.get_y_position_for_row(1), 0, 1))
        this.create_entity.set_engage_function(this.create_entity_button_pressed.bind(this))
        //////

        /* ___      ___   ___        ___      __   ___     __   ___       ___  __  ___  __   __
          |__  |\ |  |  |  |  \ /     |  \ / |__) |__     /__` |__  |    |__  /  `  |  /  \ |__)    .
          |___ | \|  |  |  |   |      |   |  |    |___    .__/ |___ |___ |___ \__,  |  \__/ |  \    .*/
        //this.entity_type_selector = new FloatingWall()

        /* __   __   ___      ___  ___     ___      ___   ___
          /  ` |__) |__   /\   |  |__     |__  |\ |  |  |  |  \ /    .
          \__, |  \ |___ /~~\  |  |___    |___ | \|  |  |  |   |     .*/
        this.create_entity_fields = []

        var entity_wall_width = 400
        var entity_wall_height = 512
        var entity_wall_position = this.get_position_for_row(0, this.get_y_position_for_row(1), 0, 20)
        this.create_entity_wall = new FloatingWall(entity_wall_width, entity_wall_height, entity_wall_position, this.normal, this.world)

        var create_entity_wall_title = this.create_entity_wall.add_floating_2d_text(entity_wall_width / 2, 'Create Entity', TYPE_TITLE, entity_wall_width / -4, 2, 0, 0)
        this.create_entity_wall.add_object_to_remove_later(create_entity_wall_title)

        var create_entity_wall_close_button = this.create_entity_wall.add_close_button(1)
        create_entity_wall_close_button.set_engage_function(this.create_entity_wall_close_button_pressed.bind(this))

        this.add_create_entity_field(ENTITY_PROPERTY_NAME, entity_wall_width)
        this.add_create_entity_field(ENTITY_PROPERTY_TYPE, entity_wall_width)

        this.create_entity_wall.set_to_invisible()

        /* ___      ___   ___    ___  __             __  ___     __     __   __
          |__  |\ |  |  |  |  | |__  /__`    |    | /__`  |     |  \ | /__` |__) |     /\  \ /    .
          |___ | \|  |  |  |  | |___ .__/    |___ | .__/  |     |__/ | .__/ |    |___ /~~\  |     .*/
        this.entities = []
        this.entities_display_wall_width = this.width * 0.9
        this.entities_display_wall_height = this.height * 0.75
        var entities_display_wall_position = this.get_position_for_row(0, -this.height / 2, 0, 2)
        this.entities_display_wall = new FloatingWall(this.entities_display_wall_width, this.entities_display_wall_height, entities_display_wall_position, this.normal, this.world)

        // Add attribute button.
        this.entity_wall_add_attribute = this.create_entity_wall.add_floating_2d_text(entity_wall_width, 'Add Attribute', TYPE_BUTTON, 0, 1, 4, 0)
        this.interactive_objects.push(this.entity_wall_add_attribute)
        this.entity_wall_add_attribute.set_engage_function(this.add_attribute_button_pressed.bind(this))

        this.entity_wall_save_entity = this.create_entity_wall.add_floating_2d_text(entity_wall_width, 'Save Entity', TYPE_BUTTON, 0, 2, 0, -entity_wall_height)
        this.interactive_objects.push(this.entity_wall_save_entity)
        this.entity_wall_save_entity.set_engage_function(this.entity_wall_save_entity_button_pressed.bind(this))
        //////

        // Save changes button.
        this.save_changes = new Floating2DText(this.width, 'Save Changes', TYPE_BUTTON, this.scene)
        this.save_changes.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(2), 0, 1), this.get_look_at_for_row(0, this.get_y_position_for_row(2), 0, 1))
        this.save_changes.set_engage_function(this.send_changes_to_server.bind(this))

        // Delete entity wall button.
        this.delete_entity_wall = new Floating2DText(this.width, 'Delete Entity Wall', TYPE_BUTTON, this.scene)
        this.delete_entity_wall.set_default_color(COLOR_TEXT_RED)
        this.delete_entity_wall.update_position_and_look_at(this.get_position_for_row(0, this.title.height - this.height, 0, 1), this.get_look_at_for_row(0, this.title.height - this.height, 0, 1))
        this.delete_entity_wall.set_engage_function(this.delete_entity_wall_pressed.bind(this))
        /////

        /* __   ___ ___     ___      ___   ___        ___      __   ___
          /__` |__   |     |__  |\ |  |  |  |  \ /     |  \ / |__) |__     .
          .__/ |___  |     |___ | \|  |  |  |   |      |   |  |    |___    .*/


        /*      __   __          ___ ___  __     __       ___  ___
           /\  |  \ |  \     /\   |   |  |__) | |__) |  |  |  |__     .
          /~~\ |__/ |__/    /~~\  |   |  |  \ | |__) \__/  |  |___    .*/
        var add_attribute_prompt_width = 400
        var temp_position = new THREE.Vector3(0, 0, 0)
        this.add_attribute_prompt = new FloatingWall(add_attribute_prompt_width, 300, temp_position, this.normal, this.world)

        //var add_attribute_title = this.add_attribute_prompt.add_floating_2d_text(add_attribute_prompt_width / 2, 'Add Attribute')

        this.add_attribute_prompt_close_button = this.add_attribute_prompt.add_close_button(1)
        this.add_attribute_prompt_close_button.set_engage_function(this.add_attribute_prompt_close_button_pressed.bind(this))

        this.add_attribute_prompt.set_to_invisible()
        /////

        /*      __   ___         __           __        __   ___     __   __   __         __  ___
           /\  |__) |__     \ / /  \ |  |    /__` |  | |__) |__     |__) |__) /  \  |\/| |__)  |     .
          /~~\ |  \ |___     |  \__/ \__/    .__/ \__/ |  \ |___    |    |  \ \__/  |  | |     |     .*/
        var are_you_sure_width = 300
        var are_you_sure_position = this.get_position_for_row(0, this.title.height - this.height, 0, 3)
        this.are_you_sure = new FloatingWall(are_you_sure_width, 100, are_you_sure_position, this.normal, this.world)

        var prompt = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 2, 'Are you sure?', TYPE_TITLE, -1.0 * (are_you_sure_width / 4.0), 2, 0, 0)
        this.are_you_sure.add_object_to_remove_later(prompt)
        var are_you_sure_close_button = this.are_you_sure.add_close_button(1)
        are_you_sure_close_button.set_engage_function(this.are_you_sure_close_button_pressed.bind(this))

        var yes_button = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 4, 'Yes', TYPE_BUTTON, -1.0 * (are_you_sure_width / 4.0), 1, 2, 0)
        this.interactive_objects.push(yes_button)
        yes_button.set_engage_function(this.perform_delete_entity_wall.bind(this))

        var no_button = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 4, 'No', TYPE_BUTTON, (are_you_sure_width / 4.0), 1, 2, 0)
        this.interactive_objects.push(no_button)
        no_button.set_engage_function(this.are_you_sure_close_button_pressed.bind(this))

        this.are_you_sure.set_to_invisible()
        //////

        this.interactive_objects.push(this.title)
        this.interactive_objects.push(this.create_entity)
        this.interactive_objects.push(this.save_changes)
        this.interactive_objects.push(this.delete_entity_wall)

        var extra_interactives = this.create_entity_wall.get_all_interactive_objects()
        for (var c = 0; c < extra_interactives.length; c++) {
            this.interactive_objects.push(extra_interactives[c])
        }
        extra_interactives = this.are_you_sure.get_all_interactive_objects()
        for (var d = 0; d < extra_interactives.length; d++) {
            this.interactive_objects.push(extra_interactives[d])
        }
        extra_interactives = this.add_attribute_prompt.get_all_interactive_objects()
        for (var e = 0; e < extra_interactives.length; e++) {
            this.interactive_objects.push(extra_interactives[e])
        }

        // Set the tab targets.
        this.title.set_next_tab_target(this.create_entity)
        this.create_entity.set_next_tab_target(this.save_changes)
        this.save_changes.set_next_tab_target(this.delete_entity_wall)
        this.delete_entity_wall.set_next_tab_target(this.title)

        this.object3D.add(this.wall.mesh)

        this.scene.add(this.object3D)

        this.floating_row_to_entity_list = []

        // TODO : Eventually move the location of this call. The save is done so entities can be created right away with a valid this.self_entity object to work with.
        this.send_changes_to_server()
    },

    // For create entity only.
    add_create_entity_field: function(attribute_name, entity_wall_width) {

        var y_offset = this.create_entity_fields.length * (16 + 2)

        var entity_wall_entity_name = this.create_entity_wall.add_floating_2d_text(entity_wall_width / 3, attribute_name, TYPE_INPUT_REGULAR, entity_wall_width / -3, 1, 2, -y_offset)
        var entity_wall_entity_name_input = this.create_entity_wall.add_floating_2d_text((entity_wall_width / 3) * 2, '', TYPE_INPUT_REGULAR, entity_wall_width / 3 - (entity_wall_width / 6), 1, 2, -y_offset)

        this.interactive_objects.push(entity_wall_entity_name)
        this.interactive_objects.push(entity_wall_entity_name_input)

        this.create_entity_fields.push([entity_wall_entity_name, entity_wall_entity_name_input])
    },

    update_title: function(title) {
        this.title.update_text(title)
    },

    add_entity: function(entity) {
        //console.log('ADD THE FOLLOWING ENTITY !!!!')
        //console.log(entity)

        var y_offset = -(this.entities.length) * (16 + 2)

        var floating_row = this.entities_display_wall.add_floating_2d_text(this.entities_display_wall_width, entity.name, TYPE_BUTTON, 0, 4, 0, y_offset)

        if (entity.get_value(ENTITY_PROPERTY_TYPE) === ENTITY_TYPE_TASK) {
            if (entity.get_value(ENTITY_PROPERTY_COMPLETED) === 'False') {
                floating_row.set_default_color(COLOR_TEXT_RED)

                // Since this is a task and it has a not-completed status then add a 'complete' button.

                // TODO : Add a button.
                //floating_row.
                var floating_row_button = this.entities_display_wall.add_floating_2d_text(this.entities_display_wall_width / 4, 'mark as completed', TYPE_BUTTON, this.entities_display_wall_width  * .375, 5, 0, y_offset)

            } else {
                floating_row.set_default_color(COLOR_TEXT_GREEN)
            }
        }

        this.world.interactive_objects.push(floating_row)

        floating_row.set_engage_function(this.edit_entity_pressed.bind(this))

        this.entities.push(entity)
        this.floating_row_to_entity_list.push([floating_row, entity])
    },

    get_y_position_for_row: function(y_index) {
        return (-16.0 / 2.0) * (1 + (2 * y_index))
    },

    get_position_for_row: function(x_offset, y_offset, z_offset, depth) {
        var p = new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z)
        p.addScaledVector(this.depth_start, depth)
        return p
    },

    get_look_at_for_row: function(x_offset, y_offset, z_offset, depth) {
        var la = new THREE.Vector3(this.look_at.x + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z)
        la.addScaledVector(this.depth_start, depth)
        return la
    },

    get_all_interactive_objects: function() {
        return this.interactive_objects
    }
}