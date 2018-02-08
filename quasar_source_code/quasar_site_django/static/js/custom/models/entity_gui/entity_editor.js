'use strict';

const EDITOR_MODE_CREATE = 1;
const EDITOR_MODE_EDIT   = 2;

const ADD_NEW_FIELD_BUTTON_ROW = 'add_new_field_button';

const DELETABLE_ROW = 'deletable_row';

const TYPE_INPUT_DATE = 'input_date';
const TYPE_INPUT_TIME = 'input_time';
const NO_DATE_SELECTED = 'select date';
const NO_TIME_SELECTED = 'select time';

function EntityEditor(entity_wall) {
    this.__init__(entity_wall);
}

EntityEditor.prototype = {

    __init__: function(entity_wall_manager) {
        this.entity_wall_manager = entity_wall_manager;
        this.base_wall = this.entity_wall_manager.base_wall;
        this.world = this.base_wall.world;
        this.entity_wall = this.entity_wall_manager.entity_wall;

        this.current_mode = null;
    },

    entity_name_changed: function() {
        if (is_defined(this.current_mode)) {
            if (this.current_mode === EDITOR_MODE_EDIT) {
                this.wall_title.update_text('Editing : ' + this.entity_name_input.get_text());
            }
        }
    },

    create_or_save_changes_button_pressed: function() {
        if (this.current_mode === EDITOR_MODE_CREATE) {
            this._entity_created();
        } else {
            this._modify_entity();
        }
    },

    cancel_or_delete_button_pressed: function() {
        if (this.current_mode === EDITOR_MODE_CREATE) {
            this.wall_entity_editor.force_hide_self_and_all_child_attachments_recursively();
        } else {
            this.entity_wall_manager.delete_entity(this.entity_being_edited);
        }
    },

    delete_entity_field: function(field_name) {
        if (field_name === ENTITY_PROPERTY_START_DATE_TIME || field_name === ENTITY_PROPERTY_END_DATE_TIME) {
            this.date_selector.wall_date_selector.detach_from_parent();
            this.time_selector.wall_time_selector.detach_from_parent();
        }
        this.wall_entity_editor.delete_row_by_name(field_name);

        if (this.current_mode === EDITOR_MODE_EDIT) {
            this.entity_being_edited.delete_property(field_name);
        }

        this.base_wall.refresh_position_and_look_at();
    },

    create: function(edit_mode) {
        if (!is_defined(this.date_selector)) {
            // Both creating a new entity and editing an existing entity will potentially need to utilize the date selector.
            this.date_selector = new DateSelector(this.world, this.date_selected.bind(this));
        }
        if (!is_defined(this.time_selector)) {
            // Both creating a new entity and editing an existing entity will potentially need to utilize the time selector.
            this.time_selector = new TimeSelector(this.world, this.time_selected.bind(this));
        }

        if (!is_defined(this.wall_entity_editor)) {
            this.wall_entity_editor = new FloatingWall(600, 400, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_SUCCESS);
            this.wall_entity_editor.manual_visibility = true;
            this.wall_entity_editor.set_attachment_depth_offset(10);
            this.wall_entity_editor.add_close_button();

            this.wall_title = this.wall_entity_editor.add_row(-1).add_3D_element('HODL IOTA', TYPE_TITLE);

            // Both creating a new entity and editing an existing entity will contain a first row for entity type following by a row for entity name.
            this.row_entity_type = this.wall_entity_editor.add_row(null, ENTITY_DEFAULT_PROPERTY_TYPE);
            var entity_type_label = this.row_entity_type.add_2D_element([0, ONE_THIRD], ENTITY_DEFAULT_PROPERTY_TYPE, TYPE_CONSTANT, COLOR_YELLOW);
            entity_type_label.add_tag(TYPE_CONSTANT);
            this.entity_type_button = this.row_entity_type.add_2D_button([ONE_THIRD, 1], 'SET THIS VALUE!', null, null);
            this.entity_type_button.add_tag(TYPE_INPUT);

            // Both creating a new entity and editing an existing entity will contain a second row for the entity name.
            this.row_entity_name = this.wall_entity_editor.add_row(null, ENTITY_PROPERTY_NAME);
            var entity_name_label = this.row_entity_name.add_2D_element([0, ONE_THIRD], ENTITY_PROPERTY_NAME, TYPE_CONSTANT, COLOR_YELLOW);
            entity_name_label.add_tag(TYPE_CONSTANT);
            this.entity_name_input = this.row_entity_name.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);
            this.entity_name_input.add_tag(TYPE_INPUT);
            this.entity_name_input.set_value_post_changed_function(this.entity_name_changed.bind(this));

            // Both creating a new entity and editing an existing entity will contain an add a new field button.
            this.add_new_field_button = this.wall_entity_editor.add_row(null, ADD_NEW_FIELD_BUTTON_ROW).add_2D_button([0, 1], 'add new field', COLOR_BLUE, null);

            // Both creating a new entity and editing an existing entity will contain an create/save-changes button.
            this.create_or_save_changes_button = this.wall_entity_editor.add_row(null).add_2D_button([0, 1], 'SET MY TEXT', COLOR_GREEN, this.create_or_save_changes_button_pressed.bind(this));

            // Both creating a new entity and editing an existing entity will contain an delete/cancel button.
            this.cancel_or_delete_button = this.wall_entity_editor.add_row(null).add_2D_button([0, 1], 'SET MY TEXT', COLOR_RED, this.cancel_or_delete_button_pressed.bind(this));

            // Create the entity type selector.
            this.wall_entity_type_selector = new EntityTypeSelector(this);
            this.wall_entity_type_selector.set_display_button(this.entity_type_button);

            // Create the entity field creator.
            this.wall_entity_field_creater = new EntityFieldCreator(this);
            this.wall_entity_field_creater.set_display_button(this.add_new_field_button);
        } else {
            this.wall_entity_editor.detach_from_parent();
        }

        // Delete all previously made non-default entity field rows.
        this.date_selector.hide();
        var row_names_to_delete = [];
        for (var r = 0; r < this.wall_entity_editor.rows.length; r++) {
            if (this.wall_entity_editor.rows[r].has_element_with_tag(DELETABLE_ROW)) {
                row_names_to_delete.push(this.wall_entity_editor.rows[r].row_name);
            }
        }
        for (r = 0; r < row_names_to_delete.length; r++) {
            this.wall_entity_editor.delete_row_by_name(row_names_to_delete[r]);
        }

        if (edit_mode === EDITOR_MODE_CREATE) {
            this.current_mode = EDITOR_MODE_CREATE;

            this.wall_entity_editor.attach_to(this.create_new_entity_button);
            this.wall_title.update_text('Create New Entity');

            this.entity_type_button.update_text('Entity');
            this.entity_name_input.update_text('');
            this.create_or_save_changes_button.update_text('create entity');
            this.cancel_or_delete_button.update_text('cancel');
        } else {
            this.current_mode = EDITOR_MODE_EDIT;

            this.wall_entity_editor.attach_to(this.entity_being_edited_button);
            this.wall_title.update_text('Editing : ' + this.entity_being_edited.get_value(ENTITY_PROPERTY_NAME));

            this.create_or_save_changes_button.update_text('save changes');
            this.cancel_or_delete_button.update_text('delete entity');

            this.entity_type_button.update_text(this.entity_being_edited.get_value(ENTITY_DEFAULT_PROPERTY_TYPE));
            this.entity_name_input.update_text(this.entity_being_edited.get_value(ENTITY_PROPERTY_NAME));

            // TODO : Populate all the required entity field rows.
            var all_non_default_editable_fields = this.entity_being_edited.get_all_non_default_editable_fields();
            // Sort the fields alphabetically.
            all_non_default_editable_fields = all_non_default_editable_fields.sort(function(a, b) {
                return a[0] > b[0];
            });

            for (var f = 0; f < all_non_default_editable_fields.length; f++) {
                this.add_entity_field(all_non_default_editable_fields[f][0], all_non_default_editable_fields[f][1]);
            }
        }

        this.wall_entity_editor.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    add_entity_field: function(field_name, field_value) {
        // Check if the field was already added.
        if (!this.wall_entity_editor.has_row_with_name(field_name)) {

            // Get the row index of the 'add new field' button.
            var insert_index_for_row = this.wall_entity_editor.get_row_with_name(ADD_NEW_FIELD_BUTTON_ROW).row_number;

            var new_field_row = this.wall_entity_editor.add_row(insert_index_for_row, field_name);
            var field_row_label = new_field_row.add_2D_element([0, ONE_THIRD], field_name, TYPE_CONSTANT);
            field_row_label.add_tag(TYPE_CONSTANT);
            field_row_label.add_tag(DELETABLE_ROW);

            var input_field;

            if (field_name === ENTITY_PROPERTY_START_DATE_TIME || field_name === ENTITY_PROPERTY_END_DATE_TIME) {
                var select_date_button = new_field_row.add_2D_button([ONE_THIRD, TWO_THIRDS], NO_DATE_SELECTED, null, null);
                var select_time_button = new_field_row.add_2D_button([TWO_THIRDS, 1], NO_TIME_SELECTED, null, null);

                select_date_button.set_engage_function(this._show_date_selector.bind(this, select_date_button));
                select_time_button.set_engage_function(this._show_time_selector.bind(this, select_time_button));

                select_date_button.add_tag(TYPE_INPUT_DATE);
                select_time_button.add_tag(TYPE_INPUT_TIME);
                select_date_button.add_tag(DELETABLE_ROW);
                select_time_button.add_tag(DELETABLE_ROW);

                // This needs to get set for positioning of the delete field button.
                input_field = select_time_button;
            } else {
                input_field = new_field_row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);
                input_field.add_tag(TYPE_INPUT);
                input_field.add_tag(DELETABLE_ROW);
            }

            if (is_defined(field_value)) {

                if (field_name === ENTITY_PROPERTY_START_DATE_TIME || field_name === ENTITY_PROPERTY_END_DATE_TIME) {
                    var field_value_list = field_value.split('+');
                    select_date_button.update_text(field_value_list[0]);
                    select_time_button.update_text(field_value_list[1]);
                } else {
                    input_field.update_text(field_value);
                }
            }

            // Add button to delete the entity field.
            var delete_entity_field_button = new Floating2DText(100, 'delete field', TYPE_BUTTON, this.base_wall.world, null, COLOR_RED);
            delete_entity_field_button.set_attachment_horizontal_offset(50 + input_field.width / 2, null);
            delete_entity_field_button.immune_to_attachment_deltas = true;
            delete_entity_field_button.attach_to(input_field);
            delete_entity_field_button.set_engage_function(this.delete_entity_field.bind(this, field_name));
            this.base_wall.refresh_position_and_look_at();
        }
    },

    _opened_for_first_time: function() {
        if (is_defined(this.wall_entity_type_selector.wall_select_entity_type)) {
            this.wall_entity_type_selector.wall_select_entity_type.force_hide_self_and_all_child_attachments_recursively();
        }
        if (is_defined(this.wall_entity_field_creater.wall_add_new_field)) {
            this.wall_entity_field_creater.wall_add_new_field.force_hide_self_and_all_child_attachments_recursively();
        }
        if (is_defined(this.date_selector.wall_date_selector)) {
            this.date_selector.hide();
        }
        if (is_defined(this.time_selector.wall_time_selector)) {
            this.time_selector.hide();
        }
    },

    _get_all_entity_fields_and_values: function() {
        var entity_fields_and_values = [];
        var entity_fields = [];
        for (var f = 0; f < this.wall_entity_editor.rows.length; f++) {
            if (is_defined(this.wall_entity_editor.rows[f].row_name)) {
                var row_name = this.wall_entity_editor.rows[f].row_name;
                if (row_name.startsWith('ep_')) {
                    entity_fields.push(this.wall_entity_editor.rows[f]);
                }
            }
        }
        for (f = 0; f < entity_fields.length; f++) {
            var entity_property = entity_fields[f].get_all_elements_with_tag(TYPE_CONSTANT)[0].get_text();
            var entity_value = '';
            if (entity_property === ENTITY_PROPERTY_START_DATE_TIME || entity_property === ENTITY_PROPERTY_END_DATE_TIME) {
                var selected_date = entity_fields[f].get_all_elements_with_tag(TYPE_INPUT_DATE)[0].get_text();
                var selected_time = entity_fields[f].get_all_elements_with_tag(TYPE_INPUT_TIME)[0].get_text();
                entity_value = selected_date + '+' + selected_time;
            } else {
                entity_value = entity_fields[f].get_all_elements_with_tag(TYPE_INPUT)[0].get_text();
            }
            entity_fields_and_values.push([entity_property, entity_value]);
        }
        return entity_fields_and_values;
    },

    _hide_self_and_update: function() {
        this.wall_entity_editor.force_hide_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*___      ___   ___         ___  __    ___         __
     |__  |\ |  |  |  |  \ /    |__  |  \ |  |  | |\ | / _`
     |___ | \|  |  |  |   |     |___ |__/ |  |  | | \| \__> */
    edit_entity: function(entity, entity_row_button) {
        this.entity_being_edited_button = entity_row_button;
        this.entity_being_edited = entity;
        this.create(EDITOR_MODE_EDIT);
        this._opened_for_first_time();
    },

    _modify_entity: function() {
        var all_entities_fields_and_values = this._get_all_entity_fields_and_values();
        for (var f = 0; f < all_entities_fields_and_values.length; f++) {
            this.entity_being_edited.set_property(all_entities_fields_and_values[f][0], all_entities_fields_and_values[f][1]);
            this.entity_being_edited_button.update_text(this.entity_being_edited.get_value(ENTITY_PROPERTY_NAME));
        }
        this._hide_self_and_update();
    },

    /*___      ___   ___         __   __   ___      ___    __
     |__  |\ |  |  |  |  \ /    /  ` |__) |__   /\   |  | /  \ |\ |
     |___ | \|  |  |  |   |     \__, |  \ |___ /~~\  |  | \__/ | \| */
    _entity_created: function() {
        var entity_to_create = new Entity();
        entity_to_create.add_parent(this.entity_wall_manager.entity_wall_entity);

        var all_entities_fields_and_values = this._get_all_entity_fields_and_values();
        for (var f = 0; f < all_entities_fields_and_values.length; f++) {
            entity_to_create.set_property(all_entities_fields_and_values[f][0], all_entities_fields_and_values[f][1]);
        }
        this.entity_wall_manager.add_entity(entity_to_create);
        this._hide_self_and_update();
    },

    set_create_entity_display_button: function(button) {
        this.create_new_entity_button = button;
        this.create_new_entity_button.set_engage_function(this._create_new_entity_button_pressed.bind(this));
    },

    _create_new_entity_button_pressed: function() {
        this.create(EDITOR_MODE_CREATE);
        this._opened_for_first_time();
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    has_field: function(field_name) {
        return this.wall_entity_editor.has_row_with_name(field_name);
    },

    /*___          ___     __   ___       ___  __  ___  __   __
       |  |  |\/| |__     /__` |__  |    |__  /  `  |  /  \ |__)
       |  |  |  | |___    .__/ |___ |___ |___ \__,  |  \__/ |  \ */
    time_selected: function(hour, minute) {
        this.time_selector.hide();
        if (!is_defined(hour) && !is_defined(minute)) {
            this.last_used_select_time_button.update_text(NO_TIME_SELECTED);
        } else {
            this.last_used_select_time_button.update_text(hour + ':' + minute);
        }
    },

    _show_time_selector: function(select_time_button) {
        this.last_used_select_time_button = select_time_button;

        this.time_selector.wall_time_selector.detach_from_parent();
        this.time_selector.wall_time_selector.attach_to(select_time_button);
        this.time_selector.refresh_time_selector();
        this.time_selector.wall_time_selector.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*__       ___  ___     __   ___       ___  __  ___  __   __
     |  \  /\   |  |__     /__` |__  |    |__  /  `  |  /  \ |__)
     |__/ /~~\  |  |___    .__/ |___ |___ |___ \__,  |  \__/ |  \ */
    date_selected: function(date_object) {
        this.date_selector.hide();
        this.last_used_select_date_button.update_text(date_object.to_string());
    },

    _show_date_selector: function(select_date_button) {
        this.last_used_select_date_button = select_date_button;

        this.date_selector.wall_date_selector.detach_from_parent();
        this.date_selector.wall_date_selector.attach_to(select_date_button);
        this.date_selector.refresh_dates();
        this.date_selector.wall_date_selector.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    }

};