'use strict';

function FieldRowRegular(entity_editor, field_type) {
    this.__init__(entity_editor, field_type);
}

FieldRowRegular.prototype = {

    __init__: function(entity_editor, field_type) {
        // Inherit.
        EntityEditorFieldRow.call(this, entity_editor);
        this.set_entity_property(field_type);
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    create_input: function(field_value) {
        this.input_field = this.row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);

        if (is_defined(field_value)) {
            this.input_field.update_text(field_value);
        }
    },

    get_value: function() {
        return this.input_field.get_text();
    }

};