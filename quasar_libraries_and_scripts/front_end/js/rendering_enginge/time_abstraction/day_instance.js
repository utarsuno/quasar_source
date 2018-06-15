'use strict';

function DayInstance(day_number, week_number, day_of_the_week, month_instance_parent) {
    this.__init__(day_number, week_number, day_of_the_week, month_instance_parent);
}

DayInstance.prototype = {

    __init__: function(day_number, week_number, day_of_the_week, month_instance_parent) {
        this.day_number = day_number;
        this.week_number = week_number;
        this.day_of_the_week = day_of_the_week;
        this.month_instance = month_instance_parent;
    },

    to_full_string: function() {
        return this.day_number + '.' + (this.month_instance.get_month_number() + 1) + '.' + this.month_instance.get_year();
    }
};