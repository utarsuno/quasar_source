'use strict';

function EntityCreator(entity_wall) {
    this.__init__(entity_wall);
}

EntityCreator.prototype = {

    __init__: function(entity_wall) {
        this.entity_wall_manager = entity_wall;
        this.base_wall = this.entity_wall_manager.base_wall;
        this.world = this.base_wall.world;
        this.entity_wall = this.entity_wall_manager.entity_wall;
    },

    set_display_button: function(button) {
        this.create_new_entity_button = button;
        this.create_new_entity_button.set_engage_function(this._create_new_entity_button_pressed.bind(this));
    },

    _create_new_entity_button_pressed: function() {
        if (!is_defined(this.wall_create_new_entity)) {
            this.create();
        }

        this.wall_create_new_entity.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    create: function() {
        this.wall_create_new_entity = new FloatingWall(600, 400, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_SUCCESS);
        this.wall_create_new_entity.manual_visibility = true;
        this.wall_create_new_entity.set_attachment_depth_offset(10);
        this.wall_create_new_entity.add_full_row_3D(-1, 'Create New Entity', TYPE_TITLE);
        this.wall_create_new_entity.add_close_button();
        this.wall_create_new_entity.attach_to(this.create_new_entity_button);

        var entity_type_row = this.wall_create_new_entity.add_row(0, ENTITY_DEFAULT_PROPERTY_TYPE).add_2D_label_and_button(ONE_THIRD, ENTITY_DEFAULT_PROPERTY_TYPE, 'Entity', null);
        entity_type_row[0].add_tag(TYPE_CONSTANT);
        this.entity_type_button = entity_type_row[1];
        this.entity_type_button.add_tag(TYPE_INPUT);

        var name_label_and_input = this.wall_create_new_entity.add_row(1, ENTITY_PROPERTY_NAME).add_2D_label_and_input(ONE_THIRD, ENTITY_PROPERTY_NAME);
        name_label_and_input[0].add_tag(TYPE_CONSTANT);
        name_label_and_input[1].add_tag(TYPE_INPUT);

        this.add_new_field_button = this.wall_create_new_entity.add_row(2, 'add_new_field').add_2D_button([0, 1], 'add new field', COLOR_BLUE, null);
        this.wall_create_new_entity.add_row(3).add_2D_button([0, 1], 'create entity', COLOR_GREEN, this._entity_created.bind(this));

        // Create the entity type selector.
        this.wall_select_entity_type = new EntityTypeSelector(this);
        this.wall_select_entity_type.set_display_button(this.entity_type_button);

        // Create the entity field creator.
        this.wall_add_new_field = new EntityFieldCreator(this);
        this.wall_add_new_field.set_display_button(this.add_new_field_button);
    },

    add_entity_field: function(field_name) {
        // Check if the field was already added.
        if (!this.wall_create_new_entity.has_row_with_name(field_name)) {

            // Get the row index of the add_field_button.
            var insert_index_for_row = this.wall_create_new_entity.get_row_with_name('add_new_field').row_number;

            var new_field_row = this.wall_create_new_entity.add_row(insert_index_for_row, field_name);
            var field_row_label = new_field_row.add_2D_element([0, ONE_THIRD], field_name, TYPE_CONSTANT);
            field_row_label.add_tag(TYPE_CONSTANT);

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

            input_field.add_tag(TYPE_INPUT);

            // Add button to delete the entity field.
            var delete_entity_field_button = new Floating2DText(100, 'Delete Field', TYPE_BUTTON, this.base_wall.world, null, COLOR_RED);
            delete_entity_field_button.set_attachment_horizontal_offset(50 + input_field.width / 2, null);
            delete_entity_field_button.immune_to_attachment_deltas = true;
            delete_entity_field_button.attach_to(input_field);
            delete_entity_field_button.set_engage_function(this.delete_entity_field.bind(this, field_name));

            this.base_wall.refresh_position_and_look_at();
        }
    },

    delete_entity_field: function(field_name) {
        if (field_name === ENTITY_PROPERTY_DUE_DATE) {
            this.date_selector.wall_date_selector.detach_from_parent();
        }
        this.wall_create_new_entity.delete_row_by_name(field_name);
        this.base_wall.refresh_position_and_look_at();
    },

    _entity_created: function() {
        // Iterate through the create new entity fields.
        var entity_fields = [];
        for (var f = 0; f < this.wall_create_new_entity.rows.length; f++) {
            if (is_defined(this.wall_create_new_entity.rows[f].row_name)) {
                var row_name = this.wall_create_new_entity.rows[f].row_name;
                if (row_name.startsWith('ep_')) {
                    entity_fields.push(this.wall_create_new_entity.rows[f]);
                }
            }
        }

        var entity_to_create = new Entity();
        entity_to_create.add_parent(this.entity_wall_manager.entity_wall_entity);

        // TODO : Add needed custom logic for saving Due Date!!

        for (f = 0; f < entity_fields.length; f++) {
            var entity_property = entity_fields[f].get_all_elements_with_tag(TYPE_CONSTANT)[0].get_text();
            var entity_value    = entity_fields[f].get_all_elements_with_tag(TYPE_INPUT)[0].get_text();

            entity_to_create.set_property(entity_property, entity_value);
        }

        this.entity_wall_manager.add_entity(entity_to_create);

        // TODO : Reset the create new entity wall!

        this.wall_create_new_entity.force_hide_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();

        // TODO : Only delete the needed fields in the future.
        if (is_defined(this.wall_create_new_entity)) {
            this.wall_create_new_entity.fully_remove_self_and_all_sub_attachments();
            this.wall_create_new_entity = null;
        }
    },

    _reset_create_new_entity_wall: function() {
        // TODO :!!!
        l('TODO : Reset create new entity wall!');
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    has_field: function(field_name) {
        return this.wall_create_new_entity.has_row_with_name(field_name);
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
    }

};