'use strict';

function ScheduleView(world) {
    this.__init__(world);
}

ScheduleView.prototype = {

    __init__: function(world) {
        this.world = world;

        this.months = {};
        this.months[MONTH_JANUARY]   = new MonthInstance(MONTH_JANUARY);
        this.months[MONTH_FEBRUARY]  = new MonthInstance(MONTH_FEBRUARY);
        this.months[MONTH_MARCH]     = new MonthInstance(MONTH_MARCH);
        this.months[MONTH_APRIL]     = new MonthInstance(MONTH_APRIL);
        this.months[MONTH_MAY]       = new MonthInstance(MONTH_MAY);
        this.months[MONTH_JUNE]      = new MonthInstance(MONTH_JUNE);
        this.months[MONTH_JULY]      = new MonthInstance(MONTH_JULY);
        this.months[MONTH_AUGUST]    = new MonthInstance(MONTH_AUGUST);
        this.months[MONTH_SEPTEMBER] = new MonthInstance(MONTH_SEPTEMBER);
        this.months[MONTH_OCTOBER]   = new MonthInstance(MONTH_OCTOBER);
        this.months[MONTH_NOVEMBER]  = new MonthInstance(MONTH_NOVEMBER);
        this.months[MONTH_DECEMBER]  = new MonthInstance(MONTH_DECEMBER);

        this.today = new DayInstance(THIS_DAY);
        this.current_month = this.today.get_month_number();

        // TODO : Get all the days and add them into an entire list in order.
        this.all_days = [];
        this.all_days_reference = {};
    },

    add_entity_to_day_view: function(date, entity) {
        this.all_days_reference[date].add_entity(entity);
    },

    add_days_from_month: function(month, record_start_index) {
        var all_dates = month.get_all_day_instances();
        for (var d = 0; d < all_dates.length; d++) {
            if (d === 0 && record_start_index) {
                this.start_index = all_dates[d].get_day_number_relative_to_current_week();
            }
            var day_view = new DayView(this, all_dates[d], this.start_index + this.total_offset);
            this.all_days.push(day_view);
            this.all_days_reference[day_view.day_instance.to_string()] = day_view;
            this.total_offset += 1;
        }
    },

    create_year_schedule_view: function() {
        this.total_offset = 0;
        this.add_days_from_month(this.months[MONTH_JANUARY], true);
        this.add_days_from_month(this.months[MONTH_FEBRUARY], false);
        this.add_days_from_month(this.months[MONTH_MARCH], false);
        this.add_days_from_month(this.months[MONTH_APRIL], false);
        this.add_days_from_month(this.months[MONTH_MAY], false);
        this.add_days_from_month(this.months[MONTH_JUNE], false);
        this.add_days_from_month(this.months[MONTH_JULY], false);
        this.add_days_from_month(this.months[MONTH_AUGUST], false);
        this.add_days_from_month(this.months[MONTH_SEPTEMBER], false);
        this.add_days_from_month(this.months[MONTH_OCTOBER], false);
        this.add_days_from_month(this.months[MONTH_NOVEMBER], false);
        this.add_days_from_month(this.months[MONTH_DECEMBER], false);

        // The monday-sunday index of the first day of this year.
        this.start_index = null;

        // Create the DayView walls.
        for (var d = 0; d < this.all_days.length; d++) {
            this.all_days[d].create();
        }
    }

};