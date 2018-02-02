'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    __init__: function(world, entity) {
        this.date_selector = null;

        if (!is_defined(entity)) {
            // The entity wall is being created for the first time.
            var pp = CURRENT_PLAYER.get_position();
            var pn = CURRENT_PLAYER.get_direction();
            var p = new THREE.Vector3(pp.x + pn.x * 200, pp.y + pn.y * 200, pp.z + pn.z * 200);
            var n = new THREE.Vector3(-pn.x, 0, -pn.z);

            this.base_wall = new FloatingWall(400, 600, p, n, world, true);
            this.base_wall.add_full_row_3D(-1, 'Entity Wall', TYPE_INPUT);

            this.base_wall.set_to_saveable();
        } else {
            // The entity wall is being loaded from an entity.
            this.base_wall = new FloatingWall(400, 600, null, null, world, true);

            this.base_wall.set_entity(entity);

            var width = this.base_wall.get_value(ENTITY_PROPERTY_WIDTH);
            var height = this.base_wall.get_value(ENTITY_PROPERTY_HEIGHT);
            var position = this.base_wall.get_value(ENTITY_PROPERTY_POSITION);
            var normal = this.base_wall.get_value(ENTITY_PROPERTY_NORMAL);

            this.base_wall.width = width;
            this.base_wall.height = height;
            this.base_wall.set_position(position.x, position.y, position.z);
            this.base_wall.set_normal(normal.x, normal.y, normal.z);

            this.base_wall.dimensions_changed();

            // TODO : ADD ROWS!!!!
            // TODO : ADD ROWS!!!!

            this.base_wall.refresh_position_and_look_at();
        }

        // Create the standard functionality of the entity wall.
        this.create_new_entity_button = this.base_wall.add_row(0).add_2D_button([0, 1], 'create new entity', COLOR_GREEN, this._create_new_entity_button_pressed.bind(this));


        // TODO : Create a button for deleting the entity wall!!





        // Regardless if created or loaded the following operations must be taken.
        // TODO : This should be automatic? Remove the need to explicitly need to write this code.
        this.base_wall.world.root_attachables.push(this.base_wall);

        this._init_create_new_entity_wall();
        this._init_select_entity_type_wall();
        this._init_add_new_field_wall();

        this.base_wall.refresh_position_and_look_at();

        this._create_entity_wall();
    },

    _create_entity_wall: function() {
        l(this.base_wall.object3D);
        l(this.base_wall);
        l(this.base_wall.object3D.position);

        this.entity_wall = this.base_wall.add_floating_wall_attachment(this.base_wall.width * .8, this.base_wall.height * .8, 0, 0, 5, false);
        this.entity_wall.set_background_color(COLOR_BLACK, true);

        //this.entity_wall = new FloatingWall(this.base_wall.width * .8, this.base_wall.height * .8, null, null, this.base_wall.normal, false, COLOR_BLACK);
        //this.entity_wall.attach_to(this.base_wall);
        //this.entity_wall.set_attachment_depth_offset(5);
    },

    /*__       ___  ___     __   ___       ___  __  ___  __   __
     |  \  /\   |  |__     /__` |__  |    |__  /  `  |  /  \ |__)
     |__/ /~~\  |  |___    .__/ |___ |___ |___ \__,  |  \__/ |  \ */
    date_selected: function(date_object) {
        this.date_selector.wall_date_selector.force_hide_self_and_all_child_attachments_recursively();
        this.select_date_button.update_text(date_object.to_string());
    },

    _show_date_selector: function() {
        if (!is_defined(this.date_selector)) {
            this.date_selector = new DateSelector(this.base_wall.world, this.date_selected.bind(this));
        }

        this.date_selector.wall_date_selector.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*     __   __           ___          ___    ___       __
      /\  |  \ |  \    |\ | |__  |  |    |__  | |__  |    |  \    |  |  /\  |    |
     /~~\ |__/ |__/    | \| |___ |/\|    |    | |___ |___ |__/    |/\| /~~\ |___ |___ */
    _init_add_new_field_wall: function() {
        if (is_defined(this.wall_add_new_field)) {
            this.wall_add_new_field.fully_remove_self_and_all_sub_attachments();
        }

        this.wall_add_new_field = new FloatingWall(200, 300, null, null, this.base_wall.world, false, COLOR_BLUE);
        this.wall_add_new_field.manual_visibility = true;
        this.wall_add_new_field.set_attachment_depth_offset(10);
        this.wall_add_new_field.attach_to(this.add_new_field_button);
        this.wall_add_new_field.add_close_button();
        this.wall_add_new_field.add_full_row_3D(-1, 'Add New Field', TYPE_TITLE);

        // All the field options.
        this.wall_add_new_field.add_full_row_2D(0, 'Default Fields', TYPE_CONSTANT);

        // Adding an emtpy row for spacing.
        this.wall_add_new_field.add_row();

        this._add_selectable_entity_field(ENTITY_PROPERTY_DUE_DATE);
        this._add_selectable_entity_field(ENTITY_PROPERTY_DUE_TIME);
        this._add_selectable_entity_field(ENTITY_PROPERTY_TAGS);
        this._add_selectable_entity_field(ENTITY_PROPERTY_NOTE);

        // Adding an emtpy row for spacing.
        this.wall_add_new_field.add_row();

        this.wall_add_new_field.add_full_row_2D(null, 'Or create a custom field', TYPE_CONSTANT);
        this.custom_field_name = this.wall_add_new_field.add_full_row_2D(null, 'Field Name', TYPE_INPUT);
        this.wall_add_new_field.add_row(null).add_2D_button([0, 1], 'Add custom field', null, this._custom_field_added.bind(this));

        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
    },

    _add_selectable_entity_field: function(field_name) {
        if (!this.wall_create_new_entity.has_row_with_name(field_name)) {
            this.wall_add_new_field.add_row(null, field_name).add_2D_button([0, 1], field_name, null, this._add_entity_field.bind(this, field_name));
        }
    },

    _delete_entity_field: function(field_name) {
        if (field_name === ENTITY_PROPERTY_DUE_DATE) {
            this.date_selector.wall_date_selector.detach_from_parent();
        }
        this.wall_create_new_entity.delete_row_by_name(field_name);
        this.base_wall.refresh_position_and_look_at();
    },

    _add_entity_field: function(field_name) {
        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();

        // Check if the field was already added.
        if (!this.wall_create_new_entity.has_row_with_name(field_name)) {

            // Get the row index of the add_field_button.
            var insert_index_for_row = this.wall_create_new_entity.get_row_with_name('add_new_field').row_number;

            var new_field_row = this.wall_create_new_entity.add_row(insert_index_for_row, field_name);
            new_field_row.add_2D_element([0, ONE_THIRD], field_name, TYPE_CONSTANT);

            var input_field;

            if (field_name === ENTITY_PROPERTY_DUE_DATE) {
                if (!is_defined(this.date_selector)) {
                    this.date_selector = new DateSelector(this.base_wall.world, this.date_selected.bind(this));
                }
                this.select_date_button = new_field_row.add_2D_button([ONE_THIRD, 1], 'Select Date', null, this._show_date_selector.bind(this));
                input_field = this.select_date_button;
                this.date_selector.wall_date_selector.attach_to(this.select_date_button);
                this.date_selector.refresh_dates();
                this.date_selector.wall_date_selector.force_hide_self_and_all_child_attachments_recursively();
            } else {
                input_field = new_field_row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);
            }

            // Add button to delete the entity field.
            var delete_entity_field_button = new Floating2DText(100, 'Delete Field', TYPE_BUTTON, this.base_wall.world, null, COLOR_RED);
            delete_entity_field_button.set_attachment_horizontal_offset(50 + input_field.width / 2, null);
            delete_entity_field_button.immune_to_attachment_deltas = true;
            delete_entity_field_button.attach_to(input_field);
            delete_entity_field_button.set_engage_function(this._delete_entity_field.bind(this, field_name));

            this.base_wall.refresh_position_and_look_at();
        }
    },

    _custom_field_added: function() {
        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
        var custom_field_name = this.custom_field_name.get_text();
        if (!custom_field_name.startsWith('ep_')) {
            custom_field_name = 'ep_' + custom_field_name;
        }
        this._add_entity_field(custom_field_name);
        // TODO : Add all the error checking needed!!!
    },

    _add_entity_field_button_pressed: function() {
        this._init_add_new_field_wall();
        this.wall_add_new_field.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*__   ___       ___  __  ___     ___      ___   ___        ___      __   ___
     /__` |__  |    |__  /  `  |     |__  |\ |  |  |  |  \ /     |  \ / |__) |__     |  |  /\  |    |
     .__/ |___ |___ |___ \__,  |     |___ | \|  |  |  |   |      |   |  |    |___    |/\| /~~\ |___ |___ */
    _init_select_entity_type_wall: function() {
        this.wall_select_entity_type = new FloatingWall(200, 100, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_YELLOW);
        this.wall_select_entity_type.manual_visibility = true;
        this.wall_select_entity_type.set_attachment_depth_offset(10);
        this.wall_select_entity_type.attach_to(this.entity_type_button);
        this.wall_select_entity_type.add_close_button();
        this.wall_select_entity_type.add_full_row_3D(-1, 'Select Entity Type', TYPE_TITLE);

        this.wall_select_entity_type.add_row(1).add_2D_button([0, 1], ENTITY_TYPE_BASE, null, this._entity_type_selected.bind(this, ENTITY_TYPE_BASE));
        this.wall_select_entity_type.add_row(2).add_2D_button([0, 1], ENTITY_TYPE_TASK, null, this._entity_type_selected.bind(this, ENTITY_TYPE_TASK));

        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
    },

    _entity_type_selected: function(entity_type) {
        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
        this.entity_type_button.update_text(entity_type);
        if (entity_type === ENTITY_TYPE_TASK) {
            this._add_entity_field(ENTITY_PROPERTY_DUE_DATE);
        }
    },

    _select_entity_type_button_pressed: function() {
        this.wall_select_entity_type.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*__   __   ___      ___  ___          ___          ___      ___   ___
     /  ` |__) |__   /\   |  |__     |\ | |__  |  |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
     \__, |  \ |___ /~~\  |  |___    | \| |___ |/\|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
    _init_create_new_entity_wall: function() {
        this.wall_create_new_entity = new FloatingWall(600, 400, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_SUCCESS);
        this.wall_create_new_entity.manual_visibility = true;
        this.wall_create_new_entity.set_attachment_depth_offset(10);
        this.wall_create_new_entity.add_full_row_3D(-1, 'Create New Entity', TYPE_TITLE);
        this.wall_create_new_entity.add_close_button();
        this.wall_create_new_entity.attach_to(this.create_new_entity_button);

        var entity_type_row = this.wall_create_new_entity.add_row(0, ENTITY_DEFAULT_PROPERTY_TYPE).add_2D_label_and_button(ONE_THIRD, ENTITY_DEFAULT_PROPERTY_TYPE, 'Entity', this._select_entity_type_button_pressed.bind(this));
        this.entity_type_button = entity_type_row[1];

        this.wall_create_new_entity.add_row(1, ENTITY_PROPERTY_NAME).add_2D_label_and_input(ONE_THIRD, ENTITY_PROPERTY_NAME);

        this.add_new_field_button = this.wall_create_new_entity.add_row(2, 'add_new_field').add_2D_button([0, 1], 'add new field', null, this._add_entity_field_button_pressed.bind(this));
        this.wall_create_new_entity.add_row(3).add_2D_button([0, 1], 'create entity', null, this._entity_created.bind(this));

        this.wall_create_new_entity.hide_self_and_all_child_attachments_recursively();
    },

    _entity_created: function() {
        l('TODO : CREATE THE ENTITY!!');


    },

    _create_new_entity_button_pressed: function() {
        this.wall_create_new_entity.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    }


};