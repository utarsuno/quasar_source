'use strict';

function ScheduleView(world) {
    this.__init__(world);
}

ScheduleView.prototype = {

    __init__: function(world) {
        this.world = world;

        this.month_days = new MonthInstance(THIS_MONTH);
        l(this.month_days.get_month_number());
    }

};