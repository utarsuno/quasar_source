'use strict';

function FieldRowDateTime(entity_editor, specific_type) {
    this.__init__(entity_editor, specific_type);
}

FieldRowDateTime.prototype = {
    __init__: function(entity_editor, specific_type) {
        // Inherit.
        EntityEditorFieldRow.call(this, entity_editor);
        if (specific_type !== ENTITY_PROPERTY_START_DATE_TIME && specific_type !== ENTITY_PROPERTY_END_DATE_TIME) {
            raise_exception_with_full_logging('Invalid type passed to FieldRowDateTime!');
        }
        this.set_entity_property(specific_type);
    },

    /*___          ___     __   ___       ___  __  ___  __   __
       |  |  |\/| |__     /__` |__  |    |__  /  `  |  /  \ |__)
       |  |  |  | |___    .__/ |___ |___ |___ \__,  |  \__/ |  \ */
    time_selected: function(hour, minute) {
        this.time_selector.hide();
        if (!is_defined(hour) && !is_defined(minute)) {
            this.select_time_button.update_text(NO_TIME_SELECTED);
        } else {
            this.select_time_button.update_text(hour + ':' + minute);
        }
    },

    _show_time_selector: function() {
        this.time_selector.wall_time_selector.attach_to(this.select_time_button);
        this.time_selector.refresh_time_selector();
        this.time_selector.wall_time_selector.force_display_self_and_all_child_attachments_recursively();
        this.entity_editor.base_wall.refresh_position_and_look_at();
    },

    /*__       ___  ___     __   ___       ___  __  ___  __   __
     |  \  /\   |  |__     /__` |__  |    |__  /  `  |  /  \ |__)
     |__/ /~~\  |  |___    .__/ |___ |___ |___ \__,  |  \__/ |  \ */
    date_selected: function(date_object) {
        this.date_selector.hide();
        if (date_object === NO_DATE_SELECTED) {
            this.select_date_button.update_text(NO_DATE_SELECTED);
        } else {
            this.select_date_button.update_text(date_object.to_string());
        }
    },

    _show_date_selector: function() {
        this.date_selector.wall_date_selector.attach_to(this.select_date_button);
        this.date_selector.refresh_dates();
        this.date_selector.wall_date_selector.force_display_self_and_all_child_attachments_recursively();
        this.entity_editor.base_wall.refresh_position_and_look_at();
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    create_input: function(field_value) {
        this.date_selector = new DateSelector(this.entity_editor.world, this.date_selected.bind(this));
        this.time_selector = new TimeSelector(this.entity_editor.world, this.time_selected.bind(this));
        this.date_selector.hide();
        this.time_selector.hide();

        this.select_date_button = this.row.add_2D_button([ONE_THIRD, TWO_THIRDS], NO_DATE_SELECTED, null, this._show_date_selector.bind(this));
        this.select_time_button = this.row.add_2D_button([TWO_THIRDS, 1], NO_TIME_SELECTED, null, this._show_time_selector.bind(this));

        if (is_defined(field_value)) {
            var field_value_list = field_value.split('+');
            this.select_date_button.update_text(field_value_list[0]);
            this.select_time_button.update_text(field_value_list[1]);
        }
    },

    get_value: function() {
        return this.select_date_button.get_text() + '+' + this.select_time_button.get_text();
    }

};