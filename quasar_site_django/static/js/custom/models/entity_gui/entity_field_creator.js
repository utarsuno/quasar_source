'use strict';

function EntityFieldCreator(entity_editor) {
    this.__init__(entity_editor);
}

EntityFieldCreator.prototype = {

    __init__: function(entity_editor) {
        this.entity_editor = entity_editor;
        this.base_wall = this.entity_editor.base_wall;
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

        this.wall_add_new_field = new FloatingWall(200, 350, null, null, this.entity_editor.world, false, COLOR_BLUE);
        this.wall_add_new_field.manual_visibility = true;
        this.wall_add_new_field.set_auto_adjust_height(true);
        this.wall_add_new_field.set_attachment_depth_offset(10);
        this.wall_add_new_field.attach_to(this.add_new_field_button);
        this.wall_add_new_field.add_close_button();
        this.wall_add_new_field.add_full_row_3D(-1, 'Add New Field', TYPE_TITLE);

        // All the field options.
        this.wall_add_new_field.add_full_row_2D(0, 'Default Fields', TYPE_CONSTANT);

        this._add_selectable_entity_field(ENTITY_PROPERTY_TAGS);
        this._add_selectable_entity_field(ENTITY_PROPERTY_NOTE);
        this._add_selectable_entity_field(ENTITY_PROPERTY_COMPLETED);

        // Adding an emtpy row for spacing.
        this.wall_add_new_field.add_row();

        this.wall_add_new_field.add_full_row_2D(null, 'Time Fields', TYPE_CONSTANT);

        // All the time related field options.
        this._add_selectable_entity_field(ENTITY_PROPERTY_START_DATE_TIME);
        this._add_selectable_entity_field(ENTITY_PROPERTY_END_DATE_TIME);
        this._add_selectable_entity_field(ENTITY_PROPERTY_TIME_NEEDED);
        this._add_selectable_entity_field(ENTITY_PROPERTY_TIME_DURATION);

        // Adding an emtpy row for spacing.
        this.wall_add_new_field.add_row();

        this.wall_add_new_field.add_full_row_2D(null, 'Or create a custom field', TYPE_CONSTANT);
        this.custom_field_name = this.wall_add_new_field.add_row(null).add_2D_element([0, 1], 'Field Name Here', TYPE_INPUT);
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
        this.entity_editor.add_entity_field(field_name);
        this.base_wall.refresh_position_and_look_at();
    },

    _add_selectable_entity_field: function(field_name) {
        if (!this.entity_editor.has_field(field_name)) {
            this.wall_add_new_field.add_row(null, field_name.substring(3)).add_2D_button([0, 1], field_name, null, this.add_entity_field.bind(this, field_name));
        }
    }

};