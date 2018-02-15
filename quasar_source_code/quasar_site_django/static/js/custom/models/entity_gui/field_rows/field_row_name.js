'use strict';

function FieldRowName(entity_editor) {
    this.__init__(entity_editor);
}

FieldRowName.prototype = {

    __init__: function(entity_editor) {
        // Inherit.
        EntityEditorFieldRow.call(this, entity_editor);
        this.set_entity_property(ENTITY_PROPERTY_NAME);
    },

    entity_name_changed: function() {
        if (this.entity_editor.in_editing_mode()) {
            this.entity_editor.wall_title.update_text('Editing : ' + this.entity_name_input.get_text());
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    create_input: function() {
        this.entity_name_input = this.row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);
        this.entity_name_input.set_value_post_changed_function(this.entity_name_changed.bind(this));
    },

    get_value: function() {
        return this.entity_name_input.get_text();
    }
};