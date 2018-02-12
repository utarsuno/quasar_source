'use strict';

const WIDTH = 500;
const HEIGHT = 800;
const POSITION_RADIUS = 4000;

function DayView(schedule_view, day_instance, index) {
    this.__init__(schedule_view, day_instance, index);
}

DayView.prototype = {

    __init__: function(schedule_view, day_instance, index) {
        this.schedule_view = schedule_view;
        this.day_instance = day_instance;
        this.index = index;
    },

    create: function() {
        //l(this.day_instance.get_day_number_relative_to_current_week());
        l(this.index);
        l('Row :' + Math.floor(this.index / 28));

    }

};


