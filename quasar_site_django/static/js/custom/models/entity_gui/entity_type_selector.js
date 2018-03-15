'use strict';

function EntityTypeSelector(entity_editor) {
    this.__init__(entity_editor);
}

EntityTypeSelector.prototype = {
    __init__: function(entity_editor) {
        this.entity_editor = entity_editor;
    },

    set_display_button: function(button) {
        this.entity_type_button = button;
        this.entity_type_button.set_engage_function(this.select_entity_type_button_pressed.bind(this));
    },

    select_entity_type_button_pressed: function() {
        if (!is_defined(this.wall_select_entity_type)) {
            this.create();
        }

        this.wall_select_entity_type.force_display_self_and_all_child_attachments_recursively();
    },

    create: function() {
        this.wall_select_entity_type = new FloatingWall(200, 100, null, null, this.entity_editor.world, false, COLOR_FLOATING_WALL_YELLOW);
        this.wall_select_entity_type.manual_visibility = true;
        this.wall_select_entity_type.set_auto_adjust_height(true);
        this.wall_select_entity_type.set_attachment_depth_offset(10);
        this.wall_select_entity_type.attach_to(this.entity_type_button);
        this.wall_select_entity_type.add_close_button();
        this.wall_select_entity_type.add_full_row_3D(-1, 'Select Entity Type', TYPE_TITLE);

        this.wall_select_entity_type.add_row(1).add_2D_button([0, 1], ENTITY_TYPE_BASE, null, this.entity_type_selected.bind(this, ENTITY_TYPE_BASE));
        this.wall_select_entity_type.add_row(2).add_2D_button([0, 1], ENTITY_TYPE_TASK, null, this.entity_type_selected.bind(this, ENTITY_TYPE_TASK));
    },

    entity_type_selected: function(entity_type) {
        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
        this.entity_type_button.update_text(entity_type);
        if (entity_type === ENTITY_TYPE_TASK) {
            this.entity_editor.add_entity_field(ENTITY_PROPERTY_END_DATE_TIME);
            this.entity_editor.add_entity_field(ENTITY_PROPERTY_START_DATE_TIME);
            this.entity_editor.add_entity_field(ENTITY_PROPERTY_COMPLETED);
        }
    }

};