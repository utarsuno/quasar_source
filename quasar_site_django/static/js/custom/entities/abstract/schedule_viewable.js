'use strict';

function ScheduleViewable() {

    this.is_schedule_viewable = function() {
        if (this.has_property(ENTITY_PROPERTY_END_DATE_TIME)) {
            var due_date_time = this.get_value(ENTITY_PROPERTY_END_DATE_TIME).split('+');

            var due_date = due_date_time[0];
            var due_time = due_date_time[1];

            if (due_date !== NO_DATE_SELECTED) {
                return true;
            }
        }
        return false;
    };

    this.get_due_date = function() {
        var due_date_time = this.get_value(ENTITY_PROPERTY_END_DATE_TIME).split('+');
        var due_date = due_date_time[0];
        var due_time = due_date_time[1];
        return due_date;
    };

}