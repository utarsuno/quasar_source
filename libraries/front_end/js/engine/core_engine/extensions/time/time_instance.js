'use strict';

$_QE.prototype.TimeInstance = function(date) {
    this.__init__(date);
};

$_QE.prototype.TimeInstance.prototype = {

    _update_internal_values: function() {
        this.year         = this.d.getFullYear();
        this.month        = this.d.getMonth();
        this.day          = this.d.getDay();
        this.day_of_month = this.d.getUTCDate();
        this.hours        = this.d.getHours();
        if (this.hours == 0) {
            this.hours = '00';
        } else if (this.hours < 10) {
            this.hours = '0' + this.hours.toString();
        } else {
            this.hours = this.hours.toString();
        }
        this.minutes = this.d.getMinutes();
        if (this.minutes == 0) {
            this.minutes = '00';
        } else if (this.minutes < 10) {
            this.minutes = '0' + this.minutes.toString();
        } else {
            this.minutes = this.minutes.toString();
        }
        this.seconds = this.d.getSeconds();
        if (this.seconds == 0) {
            this.seconds = '00';
        } else if (this.seconds < 10) {
            this.seconds = '0' + this.seconds.toString();
        } else {
            this.seconds = this.seconds.toString();
        }
    },

    __init__: function(date=null) {
        if (date == null) {
            this.d = new Date();
        } else {
            this.d = date;
        }
        this._update_internal_values();
    },

    refresh: function() {
        this.d = new Date();
        this._update_internal_values();
    },

    // Based from : https://stackoverflow.com/questions/13146418/find-all-the-days-in-a-month-with-date-object
    get_number_of_days: function() {
        let date           = new Date(this.year, this.month, 1);
        let number_of_days = 0;
        while (date.getMonth() == this.month) {
            date.setDate(date.getDate() + 1);
            number_of_days += 1;
        }
        return number_of_days;
    },

    _get_military_time: function() {
        return this.hours + ':' + this.minutes + ':' + this.seconds;
    },

    _get_month_str_full: function() {
        return this._get_month_str() + '{' + (this.month + 1) + '}';
    },

    _get_day_str_full: function() {
        return this._get_day_str() + '{' + this.day_of_month + '}';
    },

    _get_day_str: function() {
        switch(this.day) {
        case DAY_VAL_MONDAY:
            return DAY_STR_MONDAY;
        case DAY_VAL_TUESDAY:
            return DAY_STR_TUESDAY;
        case DAY_VAL_WEDNESDAY:
            return DAY_STR_WEDNESDAY;
        case DAY_VAL_THURSDAY:
            return DAY_STR_THURSDAY;
        case DAY_VAL_FRIDAY:
            return DAY_STR_FRIDAY;
        case DAY_VAL_SATURDAY:
            return DAY_STR_SATURDAY;
        case DAY_VAL_SUNDAY:
            return DAY_STR_SUNDAY;
        }
    },

    _get_month_str: function(n) {
        switch(this.month) {
        case MONTH_VAL_JANUARY:
            return MONTH_STR_JANUARY;
        case MONTH_VAL_FEBRUARY:
            return MONTH_STR_FEBRUARY;
        case MONTH_VAL_MARCH:
            return MONTH_STR_MARCH;
        case MONTH_VAL_APRIL:
            return MONTH_STR_APRIL;
        case MONTH_VAL_MAY:
            return MONTH_STR_MAY;
        case MONTH_VAL_JUNE:
            return MONTH_STR_JUNE;
        case MONTH_VAL_JULY:
            return MONTH_STR_JULY;
        case MONTH_VAL_AUGUST:
            return MONTH_STR_AUGUST;
        case MONTH_VAL_SEPTEMBER:
            return MONTH_STR_SEPTEMBER;
        case MONTH_VAL_OCTOBER:
            return MONTH_STR_OCTOBER;
        case MONTH_VAL_NOVEMBER:
            return MONTH_STR_NOVEMBER;
        case MONTH_VAL_DECEMBER:
            return MONTH_STR_DECEMBER;
        }
    },
};

