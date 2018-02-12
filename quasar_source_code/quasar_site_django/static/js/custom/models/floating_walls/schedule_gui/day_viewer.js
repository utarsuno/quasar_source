'use strict';

function DayView(schedule_view, day_instance) {
    this.__init__(schedule_view, day_instance);
}

DayView.prototype = {

    __init__: function(schedule_view, day_instance) {
        this.schedule_view = schedule_view;
        this.day_instance = day_instance;
    },

    create: function() {
    	l('Need to create this day view!');
    	l(this.day_instance.get_day_number_relative_to_current_week());
    }

};


