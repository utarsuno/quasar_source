'use strict';

function EntityWall(position, world, entity) {
    this.__init__(position, world, entity);
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

    self_entity: null,

    create_or_update_self_wall_entity: function() {
        // TODO : Give player ability to move the wall.

        // This save data is for the Wall entity.
        var save_data = {};
        save_data[ENTITY_PROPERTY_NAME] = this.title.get_text();
        save_data[ENTITY_PROPERTY_POSITION] = '[' + this.position.x + ',' + this.position.y + ',' + this.position.z + ']';
        save_data[ENTITY_PROPERTY_LOOK_AT] = '[' + this.look_at.x + ',' + this.look_at.y + ',' + this.look_at.z + ']';

        // The wall entity has not been created yet so create it.
        if (!is_defined(this.self_entity)) {
            save_data[ENTITY_DEFAULT_PROPERTY_TYPE] = ENTITY_TYPE_WALL;
            this.self_entity = new Entity(save_data);
        } else {
            // The wall entity already exists so simply update the values and then send the new values to the server.
            this.self_entity.update_values(save_data);
        }
    },

    get_wall_entity: function() {
        // FOR_DEV_START
        if (!is_defined(this.self_entity)) {
            l('WARNING : self entity is null');
        }
        // FOR_DEV_END
        return this.self_entity;
    },

    set_entity: function(entity) {
        this.self_entity = entity;
    },

    delete_entity_wall_pressed: function() {
        this.are_you_sure.set_to_visible();
    },

    perform_delete_entity_wall: function() {
        // TODO : Fix this function, make sure everything gets removed cleanly.

        // All child entities will be automatically deleted (if they don't have any other parent entity objects).
        MANAGER_ENTITY.delete_entity(this.self_entity);

        this.world.remove_from_interactive_then_scene(this.title);
        this.world.remove_from_interactive_then_scene(this.create_entity_button);
        this.world.remove_from_interactive_then_scene(this.make_entity_wall_public_button);
        this.world.remove_from_interactive_then_scene(this.delete_entity_wall_button);
        
        this.are_you_sure.remove_from_scene();
        this.entities_display_wall.remove_from_scene();
        this.create_entity_wall.remove_from_scene();

        this.world.remove_from_scene(this.object3D);
        // TODO : make sure all resources are freed up (ex. THREE js calls to .dispose())
    },

    create_entity_button_pressed: function() {
        this.create_entity_wall.set_to_visible();
    },

    are_you_sure_close_button_pressed: function() {
        this.are_you_sure.set_to_invisible();
    },

    entity_editor_close_button_pressed: function() {
        this.current_entity_editor.remove_from_scene();
    },

    entity_editor_save_changes_button_pressed: function() {
        var save_data = {};
        var labels = [];
        var values = [];

        var floating_texts = this.current_entity_editor.get_all_floating_2d_texts();

        var i;
        for (i = 0; i < floating_texts.length; i++) {
            var current_label_position = floating_texts[i].get_label_position();
            var current_label          = floating_texts[i].get_label();

            if (current_label_position > -1) {
                if (current_label === 'l') {
                    labels.push([current_label_position, floating_texts[i].get_text()]);
                } else {
                    values.push([current_label_position, floating_texts[i].get_text()]);
                }
            }
        }

        for (i = 0; i < labels.length; i++) {
            for (var j = 0; j < values.length; j++) {
                if (labels[i][0] === values[j][0]) {
                    save_data[labels[i][1]] = values[j][1];
                }
            }
        }

        var entity_id = save_data[ENTITY_DEFAULT_PROPERTY_RELATIVE_ID];
        var entity = MANAGER_ENTITY.get_entity_by_id(entity_id);
        entity.update_values(save_data);

        this.current_floating_entity_row.update_text(save_data[ENTITY_PROPERTY_NAME]);
        if (save_data[ENTITY_DEFAULT_PROPERTY_TYPE] === ENTITY_TYPE_TASK) {
            if (save_data[ENTITY_PROPERTY_COMPLETED] === 'True') {
                this.current_floating_entity_row.set_color(COLOR_GREEN);
            } else {
                this.current_floating_entity_row.set_color(COLOR_RED);
            }
        }

        this.current_entity_editor.remove_from_scene();
    },

    edit_entity_pressed: function() {
        // FOR_DEV_START
        l('EDIT THE PRESSED FLOATING ENTITY!!!!');
        // FOR_DEV_END

        for (var i = 0; i < this.floating_row_to_entity_list.length; i++) {
            if (this.floating_row_to_entity_list[i][0] === this.world.currently_looked_at_object) {
                // FOR_DEV_START
                l('EDIT THE FOLLOWING ENTITIY:');
                // FOR_DEV_END
                var current_entity = this.floating_row_to_entity_list[i][1];
                l(current_entity);

                var position = new THREE.Vector3(this.world.currently_looked_at_object.get_position().x, this.world.currently_looked_at_object.get_position().y, this.world.currently_looked_at_object.get_position().z);
                position.addScaledVector(this.normal, 10);

                var key_values = get_key_value_list_from_json_dictionary(current_entity.get_all_properties());

                var current_entity_editor_height = (key_values.length + 2) * (16 + 2);
                this.current_entity_editor = new FloatingWall(512, current_entity_editor_height, position, this.normal, this.world);
                this.current_floating_entity_row = this.floating_row_to_entity_list[i][0];

                var entity_editor_close_button = this.current_entity_editor.add_close_button(1);
                this.world.interactive_objects.push(entity_editor_close_button);

                for (var p = 0; p < key_values.length; p++) {
                    var property_name = this.current_entity_editor.add_floating_2d_text(512 / 3, key_values[p][0], TYPE_INPUT_REGULAR, -512 / 3, 2, p, 0);
                    property_name.set_label('l');
                    property_name.set_label_position(p);
                    var property_value = this.current_entity_editor.add_floating_2d_text((512 / 3) * 2, key_values[p][1], TYPE_INPUT_REGULAR, 512 / 3 - (512 / 6), 2, p, 0);
                    property_value.set_label('v');
                    property_value.set_label_position(p);

                    if (MANAGER_ENTITY.is_property_user_modifiable(property_name.get_text())) {
                        this.world.interactive_objects.push(property_name);
                        this.world.interactive_objects.push(property_value);
                    } else {
                        this.world.interactive_objects.push(property_name);
                        property_name.engable = false;
                        this.world.interactive_objects.push(property_value);
                        // TODO : Is the line below supposed to be property_value.engable = false ?
                        property_name.engable = false;
                        property_name.set_color(COLOR_TEXT_CONSTANT);
                        property_value.set_color(COLOR_TEXT_CONSTANT);
                    }
                }

                var edit_entity_save_changes_button = this.current_entity_editor.add_floating_2d_text(512, 'save changes', TYPE_BUTTON, 0, 2, key_values.length + 1, 0);
                this.world.interactive_objects.push(edit_entity_save_changes_button);
                edit_entity_save_changes_button.set_engage_function(this.entity_editor_save_changes_button_pressed.bind(this));

                entity_editor_close_button.set_engage_function(this.entity_editor_close_button_pressed.bind(this));
            }
        }

    },

    entity_was_created: function(entity) {
        // FOR_DEV_START
        l('The following entity was just created!');
        l(entity);
        // FOR_DEV_END
    },

    make_entity_wall_public_button_pressed: function() {
        var save_data = {};
        save_data.public = 'true';
        save_data.owner = ENTITY_OWNER.get_username();

        // TODO : Make all the individual entities get the same attributes as well.

        this.self_entity.update_values(save_data);
    },

    __init__: function(position, world, entity) {
        this.current_entity_editor = null;

        this.position = position;
        this.look_at  = new THREE.Vector3(0, this.position.y, 0);

        this.normal = new THREE.Vector3(this.look_at.x - this.position.x, this.look_at.y - this.position.y, this.look_at.z - this.position.z);
        this.normal.normalize();

        this.depth = new THREE.Vector3(this.normal.x * 20, this.normal.y * 20, this.normal.z * 20);
        this.depth_start = new THREE.Vector3(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2);

        this.world = world;
        this.scene = this.world.scene;

        this.object3D = new THREE.Object3D();

        this.object3D.position.x = position.x;
        this.object3D.position.y = position.y;
        this.object3D.position.z = position.z;
        this.object3D.lookAt(new THREE.Vector3(this.look_at.x, this.look_at.y, this.look_at.z));

        this.width = 512;
        this.height = 1024;

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height);

        this.title = new Floating2DText(this.width, 'Default Group Name', TYPE_INPUT_REGULAR, this.scene);
        this.title.update_position_and_look_at(this.get_position_for_row(0, this.get_y_position_for_row(0), 0, 1), this.get_look_at_for_row(0, this.get_y_position_for_row(0), 0, 1));

        // Create entity button.
        var create_entity_position = this.get_position_for_row(0, this.get_y_position_for_row(1), 0, 1);
        this.create_entity_button = new Floating2DText(this.width, 'Create Entity', TYPE_BUTTON, this.scene);
        this.create_entity_button.update_position_and_look_at(create_entity_position, this.get_look_at_for_row(0, this.get_y_position_for_row(1), 0, 1));
        this.create_entity_button.set_engage_function(this.create_entity_button_pressed.bind(this));
        //

        /* ___      ___   ___    ___  __             __  ___     __     __   __
          |__  |\ |  |  |  |  | |__  /__`    |    | /__`  |     |  \ | /__` |__) |     /\  \ /    .
          |___ | \|  |  |  |  | |___ .__/    |___ | .__/  |     |__/ | .__/ |    |___ /~~\  |     .*/
        this.entities = [];
        this.entities_display_wall_width = this.width * 0.9;
        this.entities_display_wall_height = this.height * 0.75;
        var entities_display_wall_position = this.get_position_for_row(0, -this.height / 2, 0, 2);
        this.entities_display_wall = new FloatingWall(this.entities_display_wall_width, this.entities_display_wall_height, entities_display_wall_position, this.normal, this.world);

        // Delete entity wall button.
        this.delete_entity_wall_button = new Floating2DText(this.width, 'Delete Entity Wall', TYPE_BUTTON, this.scene, COLOR_RED);
        this.delete_entity_wall_button.update_position_and_look_at(this.get_position_for_row(0, this.title.height - this.height, 0, 1), this.get_look_at_for_row(0, this.title.height - this.height, 0, 1));
        this.delete_entity_wall_button.set_engage_function(this.delete_entity_wall_pressed.bind(this));
        /////

        // Make entity wall public button.
        this.make_entity_wall_public_button = new Floating2DText(this.width, 'Make Entity Wall Public', TYPE_BUTTON, this.scene, COLOR_TEXT_BUTTON);
        this.make_entity_wall_public_button.update_position_and_look_at(this.get_position_for_row(0, this.title.height * 2 - this.height, 0, 1), this.get_look_at_for_row(0, this.title.height * 2 - this.height, 0, 1));
        this.make_entity_wall_public_button.set_engage_function(this.make_entity_wall_public_button_pressed.bind(this));
        /////

        var entity_wall_position = new THREE.Vector3(this.create_entity_button.get_position().x + this.normal.x * 3, this.create_entity_button.get_position().y + this.normal.y * 3, this.create_entity_button.get_position().z + this.normal.z * 3);
        this.create_entity_wall = new CreateEntity(this, this.entity_was_created.bind(this), entity_wall_position, this.normal, 512 / 2 + 512 / 4, (ENTITY_TYPE_ALL.length + 4 - 3) * 16);
        //this.create_entity_wall.set_to_invisible()

        /*      __   ___         __           __        __   ___     __   __   __         __  ___
           /\  |__) |__     \ / /  \ |  |    /__` |  | |__) |__     |__) |__) /  \  |\/| |__)  |     .
          /~~\ |  \ |___     |  \__/ \__/    .__/ \__/ |  \ |___    |    |  \ \__/  |  | |     |     .*/
        var are_you_sure_width = 300;
        var are_you_sure_position = this.get_position_for_row(0, this.title.height - this.height, 0, 3);
        this.are_you_sure = new FloatingWall(are_you_sure_width, 100, are_you_sure_position, this.normal, this.world);

        var prompt = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 2, 'Are you sure?', TYPE_TITLE, -1.0 * (are_you_sure_width / 4.0), 2, 1, 0);
        this.are_you_sure.add_object_to_remove_later(prompt);
        var are_you_sure_close_button = this.are_you_sure.add_close_button(1);
        are_you_sure_close_button.set_engage_function(this.are_you_sure_close_button_pressed.bind(this));

        var yes_button = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 4, 'Yes', TYPE_BUTTON, -1.0 * (are_you_sure_width / 4.0), 1, 3, 0);
        this.world.interactive_objects.push(yes_button);
        yes_button.set_engage_function(this.perform_delete_entity_wall.bind(this));

        var no_button = this.are_you_sure.add_floating_2d_text(are_you_sure_width / 4, 'No', TYPE_BUTTON, (are_you_sure_width / 4.0), 1, 3, 0);
        this.world.interactive_objects.push(no_button);
        no_button.set_engage_function(this.are_you_sure_close_button_pressed.bind(this));

        this.are_you_sure.set_to_invisible();
        //////


        /*   __                  __   ___     __    __  ___     __       ___ ___  __
            /  ` |__|  /\  |\ | / _` |__     /__` |  / |__     |__) |  |  |   |  /  \ |\ |    .
            \__, |  | /~~\ | \| \__> |___    .__/ | /_ |___    |__) \__/  |   |  \__/ | \|    .*/

        this.change_size_button = new Floating2DText(200, 'Change Size', TYPE_TWO_DIRECTIONAL_SLIDER, this.scene);



        //////


        this.world.interactive_objects.push(this.title);
        this.world.interactive_objects.push(this.create_entity_button);
        this.world.interactive_objects.push(this.make_entity_wall_public_button);
        this.world.interactive_objects.push(this.delete_entity_wall_button);

        // TODO : Change the design so this for loop isn't needed.
        var extra_interactives = this.are_you_sure.get_all_interactive_objects();
        for (var d = 0; d < extra_interactives.length; d++) {
            this.world.interactive_objects.push(extra_interactives[d]);
        }

        // Set the tab targets.
        this.title.set_next_tab_target(this.create_entity_button);
        this.create_entity_button.set_next_tab_target(this.make_entity_wall_public_button);
        this.make_entity_wall_public_button.set_next_tab_target(this.delete_entity_wall_button);
        this.delete_entity_wall_button.set_next_tab_target(this.title);

        this.object3D.add(this.wall.mesh);

        this.scene.add(this.object3D);

        this.floating_row_to_entity_list = [];

        if (is_defined(entity)) {
            this.self_entity = entity;
        } else {
            this.create_or_update_self_wall_entity();
        }
    },

    get_parametric_plane_equation: function() {

        

        return 'hi, todo lol';
    },

    update_title: function(title) {
        this.title.update_text(title);
        var save_data = {};
        save_data[ENTITY_PROPERTY_NAME] = this.title.get_text();
        this.self_entity.update_values(save_data);
    },

    add_entity: function(entity) {
        //console.log('ADD THE FOLLOWING ENTITY !!!!')
        //console.log(entity)

        var y_offset = -(this.entities.length) * (16 + 2);

        var floating_row = this.entities_display_wall.add_floating_2d_text(this.entities_display_wall_width, entity.get_value(ENTITY_PROPERTY_NAME), TYPE_BUTTON, 0, 4, 0, y_offset);

        if (entity.get_value(ENTITY_DEFAULT_PROPERTY_TYPE) === ENTITY_TYPE_TASK) {
            if (entity.get_value(ENTITY_PROPERTY_COMPLETED) === 'False') {
                floating_row.set_color(COLOR_RED);

                // Since this is a task and it has a not-completed status then add a 'complete' button.

                // TODO : Add a button.
                //floating_row.
                // FOR_DEV_START
                var floating_row_button = this.entities_display_wall.add_floating_2d_text(this.entities_display_wall_width / 4, 'mark as completed', TYPE_BUTTON, this.entities_display_wall_width  * .375, 5, 0, y_offset);
                // FOR_DEV_END
            } else {
                floating_row.set_color(COLOR_GREEN);
            }
        }

        this.world.interactive_objects.push(floating_row);

        floating_row.set_engage_function(this.edit_entity_pressed.bind(this));

        this.entities.push(entity);
        this.floating_row_to_entity_list.push([floating_row, entity]);
    },

    get_y_position_for_row: function(y_index) {
        return (-16.0 / 2.0) * (1 + (2 * y_index));
    },

    get_position_for_row: function(x_offset, y_offset, z_offset, depth) {
        var p = new THREE.Vector3(this.object3D.position.x + x_offset, this.object3D.position.y + this.height / 2 + y_offset, this.object3D.position.z);
        p.addScaledVector(this.depth_start, depth);
        return p;
    },

    get_look_at_for_row: function(x_offset, y_offset, z_offset, depth) {
        var la = new THREE.Vector3(this.look_at.x + x_offset, this.look_at.y + this.height / 2 + y_offset, this.look_at.z);
        la.addScaledVector(this.depth_start, depth);
        return la;
    }

};