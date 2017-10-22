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

    // POST calls.
    post_call_save_changes: null,

    self_entity: null,

    save_changes_result: function(result) {
        if (result === SERVER_REPLY_GENERIC_YES) {
            console.log('Saved the data!')

            this.self_entity.needs_to_be_saved = false
        } else {
            console.log('ERROR SAVING : ' + result)
        }
    },

    send_changes_to_server: function() {
        var username = WORLD_MANAGER.world_home.player.get_username()
        var password = WORLD_MANAGER.world_home.player.get_password()

        // This save data is for the Wall entity.
        var save_data = {}
        save_data.ENTITY_PROPERTY_NAME = this.title.get_text()
        // TODO : figure out this y positioning thing.
        save_data.ENTITY_PROPERTY_POSITION = '[' + this.position.x + ',' + (this.position.y - this.height / 2) + ',' + this.position.z + ']'
        save_data.ENTITY_PROPERTY_LOOK_AT = '[' + this.look_at.x + ',' + this.look_at.y + ',' + this.look_at.z + ']'
        save_data.ENTITY_PROPERTY_TYPE = ENTITY_TYPE_WALL

        // The wall entity has not been created yet so create it.
        if (this.self_entity === null || this.self_entity === undefined) {
            this.self_entity = new Entity(this.title.get_text(), save_data)
        } else {
            // The wall entity already exists so simply update the values and then send the new values to the server.
            this.self_entity.update_values(save_data)
        }

        // TODO : Eventually refactor to a more efficient design. 1 POST per entity is just for quick n dirty setup.

        this.post_call_save_changes.perform_post({'username': username, 'password': password, 'save_data': JSON.stringify(this.self_entity.get_properties())}, this.save_changes_result.bind(this))

        // TODO : traverse through the entity list here and save any entities that need to be saved.
    },

    set_entity: function(entity) {
        this.self_entity = entity
    },

    delete_entity_wall_pressed: function() {
        this.are_you_sure.set_to_visible()
    },

    perform_delete_entity: function() {
        ENTITY_MANAGER.delete_entity(this.self_entity)

        for (var i = 0; i < this.interactive_objects.length; i++) {
            this.world.remove_from_scene(this.interactive_objects[i].object3D)
        }
        this.world.remove_from_scene(this.object3D)

        this.are_you_sure.remove_from_scene()
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
        console.log('Save the entity!!!!')

        var entity_name
        var properties = {}

        for (var i = 0; i < this.create_entity_fields.length; i++) {
            console.log(this.create_entity_fields[i])
            if (this.create_entity_fields[i][0].get_text() === ENTITY_PROPERTY_NAME) {
                entity_name = this.create_entity_fields[i][1].get_text()
            }
            properties[this.create_entity_fields[i][0]] = this.create_entity_fields[i][1]
            console.log(this.create_entity_fields[i][0].get_text())
            console.log(this.create_entity_fields[i][1].get_text())
        }

        // TODO : Set entity parent attribute as well.


        var new_entity = ENTITY_MANAGER.add_new_entity(entity_name, properties)
        new_entity.set_parent(this.self_entity)
        this.add_entity(new_entity)


        this.create_entity_wall.set_to_invisible()
        // TODO : ALSO CLEAR THE FIELDS!!!
    },

    __init__: function(position, world) {
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

        this.width = 500
        this.height = 1000

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

        /* __   __   ___      ___  ___     ___      ___   ___
          /  ` |__) |__   /\   |  |__     |__  |\ |  |  |  |  \ /    .
          \__, |  \ |___ /~~\  |  |___    |___ | \|  |  |  |   |     . */
        this.create_entity_fields = []

        var entity_wall_width = 400
        var entity_wall_height = 500
        var entity_wall_position = this.get_position_for_row(0, this.get_y_position_for_row(1), 0, 20)
        this.create_entity_wall = new FloatingWall(entity_wall_width, entity_wall_height, entity_wall_position, this.normal, this.world)

        var create_entity_wall_title = this.create_entity_wall.add_floating_2d_text(entity_wall_width / 2, 'Create Entity', TYPE_TITLE, entity_wall_width / -4, 2, 0, 0)
        this.create_entity_wall.add_object_to_remove_later(create_entity_wall_title)

        this.add_create_entity_field(ENTITY_PROPERTY_NAME, entity_wall_width)

        this.entities = []

        // Add attribute button.
        this.entity_wall_add_attribute = this.create_entity_wall.add_floating_2d_text(entity_wall_width, 'Add Attribute', TYPE_BUTTON, 0, 1, 4, 0)
        this.interactive_objects.push(this.entity_wall_add_attribute)
        this.entity_wall_add_attribute.set_engage_function(this.add_attribute_button_pressed.bind(this))

        this.entity_wall_save_entity = this.create_entity_wall.add_floating_2d_text(entity_wall_width, 'Save Entity', TYPE_BUTTON, 0, 2, 0, -entity_wall_height)
        this.interactive_objects.push(this.entity_wall_save_entity)
        this.entity_wall_save_entity.set_engage_function(this.entity_wall_save_entity_button_pressed.bind(this))

        var create_entity_wall_close_button = this.create_entity_wall.add_close_button()
        create_entity_wall_close_button.set_engage_function(this.create_entity_wall_close_button_pressed.bind(this))

        this.create_entity_wall.set_to_invisible()
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

        this.add_attribute_prompt_close_button = this.add_attribute_prompt.add_close_button()
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
        var are_you_sure_close_button = this.are_you_sure.add_close_button()
        are_you_sure_close_button.set_engage_function(this.are_you_sure_close_button_pressed.bind(this))

        var yes_button = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 4, 'Yes', TYPE_BUTTON, -1.0 * (are_you_sure_width / 4.0), 1, 2, 0)
        this.interactive_objects.push(yes_button)
        yes_button.set_engage_function(this.perform_delete_entity.bind(this))

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

        this.post_call_save_changes = new PostHelper('/save_entities')
    },

    // For create entity only.
    add_create_entity_field: function(attribute_name, entity_wall_width) {
        var entity_wall_entity_name = this.create_entity_wall.add_floating_2d_text(entity_wall_width / 3, attribute_name, TYPE_INPUT_REGULAR, entity_wall_width / -3, 1, 2, 0)
        var entity_wall_entity_name_input = this.create_entity_wall.add_floating_2d_text((entity_wall_width / 3) * 2, '', TYPE_INPUT_REGULAR, entity_wall_width / 3 - (entity_wall_width / 6), 1, 2, 0)

        this.interactive_objects.push(entity_wall_entity_name)
        this.interactive_objects.push(entity_wall_entity_name_input)

        this.create_entity_fields.push([entity_wall_entity_name, entity_wall_entity_name_input])
    },

    update_title: function(title) {
        this.title.update_text(title)
    },

    save: function() {
        this.send_changes_to_server().bind(this)
    },

    add_entity: function(entity) {

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