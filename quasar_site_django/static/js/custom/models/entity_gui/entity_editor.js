'use strict';

const EDITOR_MODE_CREATE = 1;
const EDITOR_MODE_EDIT   = 2;

const ADD_NEW_FIELD_BUTTON_ROW = 'add_new_field_button';

function EntityEditor(entity_event_subscriber, base_wall) {
    this.__init__(entity_event_subscriber, base_wall);
}

EntityEditor.prototype = {

    __init__: function(entity_event_subscriber, base_wall) {
        this.entity_event_subscriber = entity_event_subscriber;
        this.base_wall = base_wall;
        this.world = this.base_wall.world;
        this.current_mode = null;
    },

    create_or_save_changes_button_pressed: function() {
        if (this.current_mode === EDITOR_MODE_CREATE) {
            this._entity_created();
        } else {
            this._modify_entity();
        }
    },

    cancel_or_delete_button_pressed: function() {
        this.wall_entity_editor.detach_from_parent();
        this.wall_entity_editor.force_hide_self_and_all_child_attachments_recursively();
        if (this.current_mode === EDITOR_MODE_EDIT) {
            MANAGER_ENTITY.delete_entity_by_id(this.entity_id_being_edited);
        }
    },

    delete_entity_field: function(field_name) {
        delete this.entity_field_rows[field_name];
        this.wall_entity_editor.delete_row_by_name(field_name);

        if (this.current_mode === EDITOR_MODE_EDIT) {
            var entity_modify = MANAGER_ENTITY.get_entity_by_id(this.entity_id_being_edited);
            entity_modify.delete_property(field_name, true);
        }
    },

    create: function(edit_mode) {
        if (!is_defined(this.wall_entity_editor)) {
            this.wall_entity_editor = new FloatingWall(600, 400, null, null, this.world, false, COLOR_FLOATING_WALL_SUCCESS);
            this.wall_entity_editor.manual_visibility = true;
            this.wall_entity_editor.set_attachment_depth_offset(10);
            this.wall_entity_editor.add_close_button();

            this.wall_title = this.wall_entity_editor.add_row(-1).add_3D_element('HODL IOTA', TYPE_TITLE);

            this.entity_field_rows = {};

            // Default field : entity type selector.
            this.entity_field_rows[ENTITY_DEFAULT_PROPERTY_TYPE] = new FieldRowEntityType(this);
            this.entity_field_rows[ENTITY_DEFAULT_PROPERTY_TYPE].create(null);

            // Default field : entity name.
            this.entity_field_rows[ENTITY_PROPERTY_NAME] = new FieldRowName(this);
            this.entity_field_rows[ENTITY_PROPERTY_NAME].create(null);

            // Both creating a new entity and editing an existing entity will contain an add a new field button.
            this.add_new_field_button = this.wall_entity_editor.add_row(null, ADD_NEW_FIELD_BUTTON_ROW).add_2D_button([0, 1], 'add new field', COLOR_BLUE, null);

            // Both creating a new entity and editing an existing entity will contain an create/save-changes button.
            this.create_or_save_changes_button = this.wall_entity_editor.add_row(null).add_2D_button([0, 1], 'SET MY TEXT', COLOR_GREEN, this.create_or_save_changes_button_pressed.bind(this));

            // Both creating a new entity and editing an existing entity will contain an delete/cancel button.
            this.cancel_or_delete_button = this.wall_entity_editor.add_row(null).add_2D_button([0, 1], 'SET MY TEXT', COLOR_RED, this.cancel_or_delete_button_pressed.bind(this));

            // Create the entity field creator.
            this.wall_entity_field_creater = new EntityFieldCreator(this);
            this.wall_entity_field_creater.set_display_button(this.add_new_field_button);
        } else {
            this.wall_entity_editor.detach_from_parent();
        }

        // Delete all previously made non-default entity field rows.
        this.wall_entity_editor.set_auto_adjust_height(false);
        var field_rows_to_delete = [];
        for (var key in this.entity_field_rows) {
            if (this.entity_field_rows.hasOwnProperty(key)) {
                if (key !== ENTITY_DEFAULT_PROPERTY_TYPE && key !== ENTITY_PROPERTY_NAME) {
                    field_rows_to_delete.push(key);
                }
            }
        }
        for (var r = 0; r < field_rows_to_delete.length; r++) {
            this.wall_entity_editor.delete_row_by_name(field_rows_to_delete[r]);
            delete this.entity_field_rows[field_rows_to_delete[r]];
        }

        if (edit_mode === EDITOR_MODE_CREATE) {
            this.current_mode = EDITOR_MODE_CREATE;

            this.wall_entity_editor.attach_to(this.create_new_entity_button);
            this.wall_title.update_text('Create New Entity');

            this.entity_field_rows[ENTITY_DEFAULT_PROPERTY_TYPE].set_value_to_default();
            this.entity_field_rows[ENTITY_PROPERTY_NAME].set_value_to_default();

            this.create_or_save_changes_button.update_text('create entity');
            this.cancel_or_delete_button.update_text('cancel');
        } else {

            this.current_mode = EDITOR_MODE_EDIT;

            this.wall_entity_editor.attach_to(this.entity_being_edited_button);

            var entity_being_edited = MANAGER_ENTITY.get_entity_by_id(this.entity_id_being_edited);

            this.wall_title.update_text('Editing : ' + entity_being_edited.get_value(ENTITY_PROPERTY_NAME));

            this.create_or_save_changes_button.update_text('save changes');
            this.cancel_or_delete_button.update_text('delete entity');

            this.entity_field_rows[ENTITY_DEFAULT_PROPERTY_TYPE].set_value_from_entity();
            this.entity_field_rows[ENTITY_PROPERTY_NAME].set_value_from_entity();

            // TODO : Populate all the required entity field rows.
            var all_non_default_editable_fields = entity_being_edited.get_all_non_default_editable_fields();
            // Sort the fields alphabetically.
            all_non_default_editable_fields = all_non_default_editable_fields.sort(function(a, b) {
                return a[0] > b[0];
            });

            for (var f = 0; f < all_non_default_editable_fields.length; f++) {
                this.add_entity_field(all_non_default_editable_fields[f][0], all_non_default_editable_fields[f][1]);
            }
        }

        this.wall_entity_editor.set_auto_adjust_height(true);
        this.wall_entity_editor.auto_adjust_height_if_needed();
        this.wall_entity_editor.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    _add_entity_field: function(field_name) {
        if (field_name === ENTITY_PROPERTY_START_DATE_TIME || field_name === ENTITY_PROPERTY_END_DATE_TIME) {
            this.entity_field_rows[field_name] = new FieldRowDateTime(this, field_name);
        } else if (field_name === ENTITY_PROPERTY_COMPLETED) {
            this.entity_field_rows[field_name] = new FieldRowCompleted(this);
        } else {
            this.entity_field_rows[field_name] = new FieldRowRegular(this, field_name);
        }
        return this.entity_field_rows[field_name];
    },

    add_entity_field: function(field_name, field_value) {
        // Check if the field was already added.
        if (!this.wall_entity_editor.has_row_with_name(field_name)) {

            // Get the row index of the 'add new field' button.
            var insert_index_for_row = this.wall_entity_editor.get_row_with_name(ADD_NEW_FIELD_BUTTON_ROW).row_number;

            var new_entity_field = this._add_entity_field(field_name);
            new_entity_field.create(insert_index_for_row, field_value);
        }
    },

    _opened_for_first_time: function() {
        this.entity_field_rows[ENTITY_DEFAULT_PROPERTY_TYPE].hide_extra_elements();
    },

    _hide_self_and_update: function() {
        this.wall_entity_editor.force_hide_self_and_all_child_attachments_recursively();
    },

    /*___      ___   ___         ___  __    ___         __
     |__  |\ |  |  |  |  \ /    |__  |  \ |  |  | |\ | / _`
     |___ | \|  |  |  |   |     |___ |__/ |  |  | | \| \__> */
    edit_entity: function(entity_relative_id, entity_row_button) {
        this.entity_being_edited_button = entity_row_button;
        this.entity_id_being_edited = entity_relative_id;
        this.create(EDITOR_MODE_EDIT);
        this._opened_for_first_time();
    },

    _modify_entity: function() {
        var entity_being_edited = MANAGER_ENTITY.get_entity_by_id(this.entity_id_being_edited);
        var all_entities_fields_and_values = this._get_all_entity_fields_and_values();
        for (var f = 0; f < all_entities_fields_and_values.length; f++) {
            entity_being_edited.set_property(all_entities_fields_and_values[f][0], all_entities_fields_and_values[f][1], true);
            this.entity_being_edited_button.update_text(entity_being_edited.get_value(ENTITY_PROPERTY_NAME));
        }
        this._hide_self_and_update();
    },

    /*___      ___   ___         __   __   ___      ___    __
     |__  |\ |  |  |  |  \ /    /  ` |__) |__   /\   |  | /  \ |\ |
     |___ | \|  |  |  |   |     \__, |  \ |___ /~~\  |  | \__/ | \| */
    _entity_created: function() {
        var entity_properties = {};
        var all_entities_fields_and_values = this._get_all_entity_fields_and_values();
        for (var f = 0; f < all_entities_fields_and_values.length; f++) {
            entity_properties[all_entities_fields_and_values[f][0]] = all_entities_fields_and_values[f][1];
        }
        var entity_created = new Entity(entity_properties, true);
        this.entity_event_subscriber.entity_added(entity_created);
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
    in_creation_mode: function() {
        if (is_defined(this.current_mode)) {
            return this.current_mode === EDITOR_MODE_CREATE;
        }
        return false;
    },

    in_editing_mode: function() {
        if (is_defined(this.current_mode)) {
            return this.current_mode === EDITOR_MODE_EDIT;
        }
        return false;
    },

    _get_all_entity_fields_and_values: function() {
        var entity_fields_and_values = [];
        for (var key in this.entity_field_rows) {
            if (this.entity_field_rows.hasOwnProperty(key)) {
                if (key.startsWith(ENTITY_PROPERTY_START_TOKEN)) {
                    entity_fields_and_values.push([key, this.entity_field_rows[key].get_value()]);
                }
            }
        }
        return entity_fields_and_values;
    },

    has_field: function(field_name) {
        return this.wall_entity_editor.has_row_with_name(field_name);
    }

};