'use strict';

function FieldRowCompleted(entity_editor) {
    this.__init__(entity_editor);
}

FieldRowCompleted.prototype = {

    __init__: function(entity_editor) {
        // Inherit.
        EntityEditorFieldRow.call(this, entity_editor);
        this.set_entity_property(ENTITY_PROPERTY_COMPLETED);

        this.completed = false;
    },

    _mark_completed_as: function(completed) {
        var refresh_needed = false;

        if (completed) {
            if (!this.completed) {
                this.completed = true;
                this.completed_check_mark.detach_from_parent();
                this.mark_as_completed_button.add_attachment(this.completed_check_mark);
                refresh_needed = true;
            }
        } else {
            if (this.completed) {
                this.completed = false;
                this.completed_check_mark.detach_from_parent();
                this.mark_as_not_completed_button.add_attachment(this.completed_check_mark);
            }
        }

        if (refresh_needed) {
            this.entity_editor.base_wall.refresh_position_and_look_at();
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    create_input: function(field_value) {
        this.mark_as_not_completed_button = this.row.add_2D_button([ONE_THIRD, TWO_THIRDS], 'no', COLOR_RED, this._mark_completed_as.bind(this, false));
        this.mark_as_completed_button = this.row.add_2D_button([TWO_THIRDS, 1], 'yes', COLOR_GREEN, this._mark_completed_as.bind(this, true));

        this.completed_check_mark = new Floating2DText(16, ICON_CHECKMARK, TYPE_ICON, this.world);
        this.completed_check_mark.set_attachment_depth_offset(2);
        this.completed_check_mark.set_attachment_horizontal_offset(null, -HALF);

        if (is_defined(field_value)) {
            if (field_value === 'yes') {
                this._mark_completed_as(true);
            } else {
                this._mark_completed_as(false);
            }
        } else {
            this.mark_as_not_completed_button.add_attachment(this.completed_check_mark);
        }
    },

    get_value: function() {
        if (this.completed) {
            return 'no';
        }
        return 'yes';
    }
};