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

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    // Base from : http://www.somethinghitme.com/2010/04/14/how-to-get-the-week-in-a-month-for-a-date-with-javascript/
    get_week_relative_to_current_month: function() {
        //return Math.ceil((this.day_number + this.month_instance.first_day_of_this_month) / 7);
    }

};