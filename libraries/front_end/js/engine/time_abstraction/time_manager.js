'use strict';

$_QE.prototype.TimeManager = function() {
    this.__init__();
};

$_QE.prototype.TimeManager.prototype = {

    current_time: null,

    __init__: function() {
        this.current_time = new $_QE.prototype.TimeInstance();
    },

    refresh: function() {
        this.current_time.refresh();
    },

    get_current_date_header: function() {
        return this.current_time._get_day_str_full() + ' ' + this.current_time._get_month_str_full() + ' ' + this.current_time.year;
    },

    get_current_time_header: function() {
        return this.current_time._get_military_time();
    },

};


