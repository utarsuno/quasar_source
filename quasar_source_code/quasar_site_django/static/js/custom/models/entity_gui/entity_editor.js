'use strict';

function EntityEditor(entity_wall_manager) {
    this.__init__(entity_wall_manager);
}

EntityEditor.prototype = {

    __init__: function(entity_wall_manager) {
        this.entity_wall_manager = entity_wall_manager;
        this.world = this.entity_wall_manager.base_wall.world;
    },

    edit_entity: function(entity, entity_row_button) {
        this.entity_button = entity_row_button;
        this.entity_name = entity.get_value(ENTITY_PROPERTY_NAME);
        this.current_entity = entity;
        this.create();
    },

    create: function() {
        if (is_defined(this.wall_select_entity_type)) {
            this.wall_select_entity_type.detach_from_parent();
        } else {
            this.wall_select_entity_type = new EntityTypeSelector(this);
        }

        if (!is_defined(this.wall_add_new_field)) {
            this.wall_add_new_field = new EntityFieldCreator(this);
        }

        if (is_defined(this.wall_edit_entity)) {
            // Detach from any existing button.
            this.wall_edit_entity.detach_from_parent();
            this.wall_edit_entity.fully_remove_self_and_all_sub_attachments();
        }

        this.wall_edit_entity = new FloatingWall(300, 400, null, null, this.world, false, COLOR_FLOATING_WALL_HIGHLIGHT);
        this.wall_edit_entity.manual_visibility = true;
        this.wall_edit_entity.set_attachment_depth_offset(10);
        this.wall_edit_entity.attach_to(this.entity_button);
        this.wall_edit_entity.add_close_button();
        this.wall_edit_entity.add_full_row_3D(-1, 'Editing : ' + this.entity_name, TYPE_TITLE);

        // TODO : Create all the fields that can be edited.
        var all_editable_fields = this.current_entity.get_all_editable_fields();

        var index_of_entity_name;
        var entity_name;

        var index_of_entity_type;
        var entity_type;

        var f;

        // The first field should be the entity type.
        for (f = 0; f < all_editable_fields.length; f++) {
            if (all_editable_fields[f][0] === ENTITY_DEFAULT_PROPERTY_TYPE) {
                index_of_entity_type = f;
                entity_type = all_editable_fields[f][1];
                break;
            }
        }
        all_editable_fields.splice(index_of_entity_type, 1);

        // The second field should be the entity name.
        for (f = 0; f < all_editable_fields.length; f++) {
            if (all_editable_fields[f][0] === ENTITY_PROPERTY_NAME) {
                index_of_entity_name = f;
                entity_name = all_editable_fields[f][1];
                break;
            }
        }
        all_editable_fields.splice(index_of_entity_name, 1);

        // The remaining fields should be displayed alphabetically.
        all_editable_fields = all_editable_fields.sort(function(a, b) {
            return a[0] > b[0];
        });

        // Add the entity type field.
        var field_row;
        field_row = this.wall_edit_entity.add_row(null);
        field_row.add_2D_element([0, ONE_THIRD], ENTITY_DEFAULT_PROPERTY_TYPE, TYPE_CONSTANT, COLOR_YELLOW);
        var select_entity_type = field_row.add_2D_button([ONE_THIRD, 1], entity_type, null, null);
        this.wall_select_entity_type.set_display_button(select_entity_type);

        // Add the entity name field.
        field_row = this.wall_edit_entity.add_row(null);
        field_row.add_2D_element([0, ONE_THIRD], ENTITY_PROPERTY_NAME, TYPE_CONSTANT, COLOR_YELLOW);
        field_row.add_2D_element([ONE_THIRD, 1], entity_name, TYPE_INPUT);

        // Now add the remaining fields.
        for (f = 0; f < all_editable_fields.length; f++) {
            field_row = this.wall_edit_entity.add_row(null);
            field_row.add_2D_element([0, ONE_THIRD], all_editable_fields[f][0], TYPE_CONSTANT);
            field_row.add_2D_element([ONE_THIRD, 1], all_editable_fields[f][1], TYPE_INPUT);

            // TODO : Code for the date selector.
        }

        // TODO : Create the add field button.
        var add_field_button = this.wall_edit_entity.add_row(null).add_2D_button([0, 1], 'add field', COLOR_BLUE, null);
        this.wall_add_new_field.set_display_button(add_field_button);

        // TODO : Create the save changes button.
        this.wall_edit_entity.add_row(null).add_2D_button([0, 1], 'save changes', COLOR_GREEN, null);

        // TODO : Create the delete entity button.
        this.wall_edit_entity.add_row(null).add_2D_button([0, 1], 'delete entity', COLOR_RED, this._delete_entity.bind(this));

        this.wall_edit_entity.force_display_self_and_all_child_attachments_recursively();
        this.entity_wall_manager.base_wall.refresh_position_and_look_at();
    },

    add_entity_field: function(entity_field) {

    },

    has_field: function(field_name) {
        return this.wall_edit_entity.has_row_with_name(field_name);
    },

    _save_changes: function() {
        l('TODO : Save changes!');
    },

    _delete_entity: function() {
        this.wall_edit_entity.force_hide_self_and_all_child_attachments_recursively();
        this.entity_wall_manager.delete_entity(this.current_entity);
    }
};