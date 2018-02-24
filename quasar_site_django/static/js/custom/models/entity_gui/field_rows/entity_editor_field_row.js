'use strict';

// Abstract class.
function EntityEditorFieldRow(entity_editor) {

    this.entity_editor = entity_editor;
    this.wall 		   = this.entity_editor.wall_entity_editor;

    this.set_entity_property = function(entity_property) {
        if (entity_property.substring(0, 3) !== ENTITY_PROPERTY_START_TOKEN) {
            raise_exception_with_full_logging('Invalid entity property passed!');
        }
        this.entity_property = entity_property;
        this.label           = this.entity_property.substring(3);
    };

    this.create_row = function(row_index) {
        this.row = this.wall.add_row(row_index, this.entity_property);
    };

    this.create_label = function() {
        if (this.entity_property === ENTITY_DEFAULT_PROPERTY_TYPE || this.entity_property === ENTITY_PROPERTY_NAME) {
            this.label_color = COLOR_YELLOW;
        } else {
            this.label_color = null;
        }
        this.row.add_2D_element([0, ONE_THIRD], this.label, TYPE_CONSTANT, this.label_color);
    };

    this.create_delete_button = function() {
        this.row.add_2D_button([1, 1 + ONE_FOURTH], 'delete field', COLOR_RED, this.delete_entity_field_row.bind(this));
    };

    this.create = function(row_index, field_value) {
        this.create_row(row_index);
        this.create_label();
        this.create_input(field_value);
        if (this.entity_property !== ENTITY_DEFAULT_PROPERTY_TYPE && this.entity_property !== ENTITY_PROPERTY_NAME) {
            this.create_delete_button();
        }
    };

    this.delete_entity_field_row = function() {
        this.entity_editor.delete_entity_field(this.entity_property);
    };

    this.set_value_to_default = function() {
        if (this.entity_property === ENTITY_DEFAULT_PROPERTY_TYPE) {
            this.entity_type_button.update_text('Entity');
        } else if (this.entity_property === ENTITY_PROPERTY_NAME) {
            this.entity_name_input.update_text('');
        }
    };

    this.set_value_from_entity = function() {
        if (this.entity_property === ENTITY_DEFAULT_PROPERTY_TYPE) {
            this.entity_type_button.update_text(this.entity_editor.entity_being_edited.get_value(ENTITY_DEFAULT_PROPERTY_TYPE));
        } else if (this.entity_property === ENTITY_PROPERTY_NAME) {
            this.entity_name_input.update_text(this.entity_editor.entity_being_edited.get_value(ENTITY_PROPERTY_NAME));
        }
    };
}