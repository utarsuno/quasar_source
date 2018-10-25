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


/*
const TIME_TYPE_YEAR_CURRENT  = 21;
const TIME_TYPE_YEAR_STATIC   = 22;
const TIME_TYPE_MONTH_CURRENT = 23;
const TIME_TYPE_MONTH_STATIC  = 24;
const TIME_TYPE_DAY_CURRENT   = 25;
const TIME_TYPE_DAY_STATIC    = 26;


 MonthInstance.prototype = {

    //updates
    apply_delta: function(units, magnitude) {
        let previous_year_number = this.year_number;
        let previous_month_number = this.month_number;
        switch (units) {
        case TIME_DELTA_YEARS:
            this.year_number += magnitude;
            break;
        case TIME_DELTA_MONTHS:
            this.month_number += magnitude;
            while (this.month_number > 11) {
                this.month_number -= 11;
                this.year_number += 1;
            }
            while (this.month_number < 0) {
                this.month_number += 11;
                this.year_number -= 1;
            }
            break;
        }
        if (previous_month_number !== this.month_number || previous_year_number !== this.year_number) {
            this.day_instances.length = 0;
        }
    },

    //getters
    get_all_day_instances: function() {
        if (this.day_instances.length === 0) {
            this.set_last_day_of_this_month();

            let current_week = 5;
            if (this.last_day_of_this_month <= 28) {
                current_week = 4;
            }

            let current_day_of_week = this.last_day_of_this_month_day_of_the_week;

            for (let d = this.last_day_of_this_month; d > 0; d--) {
                this.day_instances.push(new DayInstance(d, current_week, current_day_of_week, this));

                current_day_of_week -= 1;
                if (current_day_of_week < 0) {
                    current_day_of_week = 6;
                    current_week -= 1;
                }
            }
        }
        return this.day_instances;
    },
};

 */