'use strict';

function EntityFieldCreator(entity_creator_or_editor) {
    this.__init__(entity_creator_or_editor);
}

EntityFieldCreator.prototype = {

    __init__: function(entity_creator_or_editor) {
        this.entity_creator_or_editor = entity_creator_or_editor;
        this.base_wall = entity_creator_or_editor.base_wall;
    },

    set_display_button: function(button) {
        this.add_new_field_button = button;
        this.add_new_field_button.set_engage_function(this._add_entity_field_button_pressed.bind(this));
    },

    _add_entity_field_button_pressed: function() {
        this.create();
        this.wall_add_new_field.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    create: function() {
        if (is_defined(this.wall_add_new_field)) {
            this.wall_add_new_field.fully_remove_self_and_all_sub_attachments();
        }

        this.wall_add_new_field = new FloatingWall(200, 300, null, null, this.entity_creator_or_editor.world, false, COLOR_BLUE);
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
        this.wall_add_new_field.add_row(null).add_2D_button([0, 1], 'Add custom field', null, this._add_selectable_custom_entity_field.bind(this));
    },

    _add_selectable_custom_entity_field: function() {
        var custom_field_name = this.custom_field_name.get_text();
        if (!custom_field_name.startsWith('ep_')) {
            custom_field_name = 'ep_' + custom_field_name;
        }
        this.add_entity_field(custom_field_name);
        // TODO : Add all the error checking needed!!!
    },

    add_entity_field: function(field_name) {
        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
        this.entity_creator_or_editor.add_entity_field(field_name);
    },

    _add_selectable_entity_field: function(field_name) {
        if (!this.entity_creator_or_editor.has_field(field_name)) {
            this.wall_add_new_field.add_row(null, field_name).add_2D_button([0, 1], field_name, null, this.add_entity_field.bind(this, field_name));
        }
    }

};