'use strict';

const THIS_DAY   = 'this_today';
const THIS_MONTH = 'this_month';

const MONTH_JANUARY   = 0;
const MONTH_FEBRUARY  = 1;
const MONTH_MARCH     = 2;
const MONTH_APRIL     = 3;
const MONTH_MAY       = 4;
const MONTH_JUNE      = 5;
const MONTH_JULY      = 6;
const MONTH_AUGUST    = 7;
const MONTH_SEPTEMBER = 8;
const MONTH_OCTOBER   = 9;
const MONTH_NOVEMBER  = 10;
const MONTH_DECEMBER  = 11;

const DAY_MONDAY      = 0;

const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function MonthInstance(month_number) {
    this.__init__(month_number);
}

// TODO : Match the design of the python time abstraction
// TODO : Match the design of the python time abstraction
// TODO : Match the design of the python time abstraction

MonthInstance.prototype = {

    __init__: function(month_key) {
        this.dates = [];

        this._year_number = new Date().getFullYear();
        if (month_key === THIS_MONTH) {
            this._month_number = new Date().getMonth();
        } else {
            this._month_number = month_key;
        }

        this._create_days_of_this_month();
    },

    _create_days_of_this_month: function() {
        this.dates.length = 0;
        var days_of_this_month = get_days_in_month(this._month_number, this._year_number);
        for (var d = 0; d < days_of_this_month.length; d++) {
            this.dates.push(new DayInstance(days_of_this_month[d]));

            var dates_in_past = this.get_dates_in_past();
            var dates_in_future = this.get_dates_in_future();

            // TODO : Eventually refactor this system.
            this.dates_in_past_colors = get_color_range_list(COLOR_SCHEDULE_PAST, COLOR_SCHEDULE_PRESENT, dates_in_past.length + 1);
            this.dates_in_future_colors = get_color_range_list(COLOR_SCHEDULE_PRESENT, COLOR_SCHEDULE_FUTURE, dates_in_future.length + 1);
        }
    },

    apply_delta: function(units, magnitude) {
        switch (units) {
        case DELTA_YEARS:
            this._year_number += magnitude;
            break;
        case DELTA_MONTHS:
            this._month_number += magnitude;
            while (this._month_number > 11) {
                this._month_number -= 11;
                this._year_number += 1;
            }
            while (this._month_number < 0) {
                this._month_number += 11;
                this._year_number -= 1;
            }
            break;
        }

        this._create_days_of_this_month();
    },

    get_day_color_by_index: function(index) {
        if (this.dates[index].in_present()) {
            return COLOR_SCHEDULE_PRESENT;
        } else if (this.dates[index].in_past()) {
            return this.dates_in_past_colors[index];
        } else {
            return this.dates_in_future_colors[index - 1 - this.dates_in_past_colors.length + 1];
        }
    },

    get_dates_in_past: function() {
        var past_dates = [];
        for (var d = 0; d < this.dates.length; d++) {
            if (this.dates[d].in_past()) {
                past_dates.push(this.dates[d]);
            }
        }
        return past_dates;
    },

    get_dates_in_future: function() {
        var future_dates = [];
        for (var d = 0; d < this.dates.length; d++) {
            if (this.dates[d].in_future()) {
                future_dates.push(this.dates[d]);
            }
        }
        return future_dates;
    },

    get_dates_in_present: function() {
        var present_dates = [];
        for (var d = 0; d < this.dates.length; d++) {
            if (this.dates[d].in_present()) {
                present_dates.push(this.dates[d]);
            }
        }
        return present_dates;
    },

    get_all_day_instances: function() {
        return this.dates;
    },

    /*     __       ___          __       ___
     |\/| /  \ |\ |  |  |__|    |  \  /\   |   /\
     |  | \__/ | \|  |  |  |    |__/ /~~\  |  /~~\ */
    get_month_number: function() {
        return this._month_number;
    }

};

function DayInstance(date_base) {
    this.__init__(date_base);
}

DayInstance.prototype = {

    __init__: function(date_base) {
        this.date = null;
        if (date_base === THIS_DAY) {
            this.date = get_date_object_from_today_with_n_day_offset(0);
        } else {
            this.date = date_base;
        }
    },

    in_past: function() {
        return this.date.getDate() < CURRENT_DAY_OBJECT.date.getDate();
    },

    in_future: function() {
        return this.date.getDate() > CURRENT_DAY_OBJECT.date.getDate();
    },

    in_present: function() {
        return this.date.getDate() === CURRENT_DAY_OBJECT.date.getDate();
    },

    apply_delta: function(units, magnitude) {
        switch (units) {
        case DELTA_YEARS:
            this.date.setFullYear(this.date.getFullYear() + magnitude);
            break;
        case DELTA_DAYS:
            this.date.setDate(this.date.getDate() + magnitude);
            break;
        case DELTA_MONTHS:
            this.date.setMonth(this.date.getMonth() + magnitude);
            break;
        }
    },

    to_string: function() {
        return (this.date.getMonth() + 1) + '.' + this.date.getDate() + '.' + this.date.getFullYear();
    },

    to_string_without_year: function() {
        return (this.date.getMonth() + 1) + '.' + this.date.getDate();
    },

    get_year_as_string: function() {
        return this.date.getFullYear();
    },

    // Base from : http://www.somethinghitme.com/2010/04/14/how-to-get-the-week-in-a-month-for-a-date-with-javascript/
    get_week_relative_to_current_month: function() {
        var first_day = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        return Math.ceil((this.date.getDate() + first_day) / 7);
    },

    /*__               __       ___
     |  \  /\  \ /    |  \  /\   |   /\
     |__/ /~~\  |     |__/ /~~\  |  /~~\ */
    get_day_as_word: function() {
        return DAY_NAMES[this.get_day_number_relative_to_current_week()];
    },

    get_day_number_relative_to_current_week: function() {
        return this.date.getDay();
    },

    get_day_number: function() {
        return this.date.getDate();
    },

    /*     __       ___          __       ___
     |\/| /  \ |\ |  |  |__|    |  \  /\   |   /\
     |  | \__/ | \|  |  |  |    |__/ /~~\  |  /~~\ */
    get_all_days_in_this_month: function() {

    },

    get_month_as_word: function() {
        return MONTH_NAMES[this.date.getMonth()];
    },

    get_month_full_data_string: function() {
        return this.get_month_as_word() + '(' + this.get_month_number_as_string() + ')';
    },

    get_month_number_as_string: function() {
        return (this.date.getMonth() + 1).toString();
    },

    get_month_number: function() {
        return this.date.getMonth();
    }

};

function get_date_object_from_today_with_n_day_offset(n) {
    var date = new Date();
    if (n !== 0) {
        date.setDate(date.getDate() + n);
    }
    return date;
}


// From : https://stackoverflow.com/questions/13146418/find-all-the-days-in-a-month-with-date-object
/**
 * @param {int} month : The month number, 0 based
 * @param {int} year  :The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function get_days_in_month(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}
