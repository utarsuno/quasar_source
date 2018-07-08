'use strict';

// Abstract class.
function EntityEditorFieldRow(entity_editor) {

    this.entity_editor = entity_editor;
    this.wall 		   = this.entity_editor.wall_entity_editor;

    this.leftmost_input = null;
    this.rightmost_input = null;

    this.set_entity_property = function(entity_property) {
        if (entity_property.substring(0, 2) !== ENTITY_PROPERTY_START_TOKEN) {
            raise_exception_with_full_logging('Invalid entity property passed!');
        }
        this.entity_property = entity_property;
    };

    this.create_row = function(row_index) {
        this.row = this.wall.add_row(row_index, this.entity_property);
    };

    this.create_label = function(input) {
        let label_text = get_entity_property_full_name(this.entity_property);
        //var label = input.add_label_left(label_text);
        //input.add_label_left(this.label);

        this.leftmost_input.add_label_left(label_text);
    };

    this.create = function(row_index, field_value) {
        this.create_row(row_index);
        let input = this.create_input(field_value);
        this.create_label(input);
        if (this.entity_property !== ENTITY_DEFAULT_PROPERTY_TYPE && this.entity_property !== ENTITY_PROPERTY_NAME) {
            //input.add_button_right(120, 'delete field', this.delete_entity_field_row.bind(this), COLOR_RED);
            this.rightmost_input.add_button_right(120, 'delete field', this.delete_entity_field_row.bind(this), COLOR_RED);
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
        // TODO : Eventually optimize this.
        let entity_being_edited = MANAGER_ENTITY.get_entity_by_id(this.entity_editor.entity_id_being_edited);

        if (this.entity_property === ENTITY_DEFAULT_PROPERTY_TYPE) {
            this.entity_type_button.update_text(entity_being_edited.get_value(ENTITY_DEFAULT_PROPERTY_TYPE));
        } else if (this.entity_property === ENTITY_PROPERTY_NAME) {
            this.entity_name_input.update_text(entity_being_edited.get_value(ENTITY_PROPERTY_NAME));
        }
    };

}