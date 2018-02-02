'use strict';

function EntityTypeSelector(base_wall) {
    this.__init__(base_wall);
}

EntityTypeSelector.prototype = {
    __init__: function(base_wall) {
        this.base_wall = base_wall;

        this.wall_select_entity_type = new FloatingWall(200, 100, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_YELLOW);
        this.wall_select_entity_type.manual_visibility = true;
        this.wall_select_entity_type.set_attachment_depth_offset(10);
        this.wall_select_entity_type.attach_to(this.entity_type_button);
        this.wall_select_entity_type.add_close_button();
        this.wall_select_entity_type.add_full_row_3D(-1, 'Select Entity Type', TYPE_TITLE);

        this.wall_select_entity_type.add_row(1).add_2D_button([0, 1], ENTITY_TYPE_BASE, null, this.entity_type_selected.bind(this, ENTITY_TYPE_BASE));
        this.wall_select_entity_type.add_row(2).add_2D_button([0, 1], ENTITY_TYPE_TASK, null, this.entity_type_selected.bind(this, ENTITY_TYPE_TASK));

        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
    },

    entity_type_selected: function(entity_type) {
        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
        this.base_wall.entity_type_button.update_text(entity_type);
        if (entity_type === ENTITY_TYPE_TASK) {
            this._add_entity_field(ENTITY_PROPERTY_DUE_DATE);
        }
    },

    select_entity_type_button_pressed: function() {
        this.wall_select_entity_type.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    }
};