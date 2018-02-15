'use strict';

function FieldRowEntityType(entity_editor) {
    this.__init__(entity_editor);
}

FieldRowEntityType.prototype = {

    __init__: function(entity_editor) {
        // Inherit.
        EntityEditorFieldRow.call(this, entity_editor);
        this.set_entity_property(ENTITY_DEFAULT_PROPERTY_TYPE);
    },

    hide_extra_elements: function() {
        if (is_defined(this.wall_entity_type_selector.wall_select_entity_type)) {
            this.wall_entity_type_selector.wall_select_entity_type.force_hide_self_and_all_child_attachments_recursively();
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    create_input: function() {
        this.entity_type_button = this.row.add_2D_button([ONE_THIRD, 1], 'VALUE NOT SET', null, null);

        this.wall_entity_type_selector = new EntityTypeSelector(this.entity_editor);
        this.wall_entity_type_selector.set_display_button(this.entity_type_button);

        this.hide_extra_elements();
    },

    get_value: function() {
        return this.entity_type_button.get_text();
    }
};