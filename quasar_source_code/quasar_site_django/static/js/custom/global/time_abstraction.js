'use strict';

// TODO : create a universal constant here.
const THIS_DAY   = 'this_today';
const THIS_MONTH = 'this_month';
// TODO : create the other deltas needed.

const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function MyDates(dates_base) {
    this.__init__(dates_base);
}

// TODO : Match the design of the python time abstraction
// TODO : Match the design of the python time abstraction
// TODO : Match the design of the python time abstraction

MyDates.prototype = {

    __init__: function(dates_base) {
        this.dates = [];
        if (dates_base === THIS_MONTH) {
            var days_of_this_month = get_all_days_in_current_month();
            for (var d = 0; d < days_of_this_month.length; d++) {
                this.dates.push(new MyDate(days_of_this_month[d]));

                var dates_in_past = this.get_dates_in_past();
                var dates_in_future = this.get_dates_in_future();

                this.dates_in_past_colors = get_color_range_list(COLOR_SCHEDULE_PAST, COLOR_SCHEDULE_PRESENT, dates_in_past.length + 1);
                this.dates_in_future_colors = get_color_range_list(COLOR_SCHEDULE_PRESENT, COLOR_SCHEDULE_FUTURE, dates_in_future.length + 1);
            }
        }
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

    get_all_dates: function() {
        return this.dates;
    }

};

function MyDate(date_base) {
    this.__init__(date_base);
}

MyDate.prototype = {

    __init__: function(date_base) {
        this.now = new Date();
        this.date = null;
        if (date_base === THIS_DAY) {
            this.date = get_date_object_from_today_with_n_day_offset(0);
        } else {
            this.date = date_base;
        }
    },

    in_past: function() {
        return this.date.getDate() < this.now.getDate();
    },

    in_future: function() {
        return this.date.getDate() > this.now.getDate();
    },

    in_present: function() {
        return this.date.getDate() == this.now.getDate();
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

    get_month_as_word: function() {
        return MONTH_NAMES[this.date.getMonth()];
    },

    get_month_full_data_string: function() {
        return this.get_month_as_word() + '(' + this.get_month_number_as_string() + ')';
    },

    get_month_number_as_string: function() {
        return (this.date.getMonth() + 1).toString();
    }
};

// Solution modified from : https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_date_string_from_today_with_n_day_offset(n) {
    var date = get_date_object_from_today_with_n_day_offset(n);
    var day   = date.getDate();
    var month = date.getMonth() + 1;
    var year  = date.getFullYear();
    return month + '.' + day + '.' + year;
}

function get_date_object_from_today_with_n_day_offset(n) {
    var date = new Date();
    if (n !== 0) {
        date.setDate(date.getDate() + n);
    }
    return date;
}

// TODO : check if still needed
function get_just_date_object_of_date_of_n_days_offset(n) {
    var date = new Date();
    var result = new Date(date);
    result.setDate(result.getDate() + n);
    return result;
}

// TODO : check if still needed
function get_list_of_dates_consisting_of_this_and_next_week() {
    var dates      = [];
    var date       = new Date(); // Right now instance.
    var day_offset = date.getDay();

    if (day_offset == 0) {
        day_offset = 6;
    } else {
        day_offset--;
    }

    for (var i = 0; i < 14; i++) {
        dates.push(get_today_with_n_days_offset(i - day_offset));
    }
    return dates;
}

// TODO : check if still needed
function get_day_of_week_as_word(d) {
    if (is_string(d)) {
        // TODO : !!!
        l('TODO! Get the day of week as word for the following input :');
        l(d);
    } else {
        switch (d.getDay()){
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        }
    }
}

// TODO : check if still needed
// GLOBAL_FUNCTION
function get_current_month() {
    return new Date().getMonth();
}

// TODO : check if still needed
// GLOBAL_FUNCTION
function get_current_year() {
    return new Date().getFullYear();
}

// TODO : check if still needed
// GLOBAL_FUNCTION
function get_all_days_in_current_month() {
    return get_days_in_month(get_current_month(), get_current_year());
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
