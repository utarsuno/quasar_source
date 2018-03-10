'use strict';

function MonthInstance(month_identifier, year_identifier) {
    this.__init__(month_identifier, year_identifier);
}

MonthInstance.prototype = {
    __init__: function(month_identifier, year_identifier) {
        // Inherit.
        MonthIdentifier.call(this, month_identifier);
        YearIdentifier.call(this, year_identifier);

        this.day_instances = [];
    },

    /*     __   __       ___  ___  __   __
     |  | |__) |  \  /\   |  |__  |__) /__`
     \__/ |    |__/ /~~\  |  |___ |  \ .__/ */
    apply_delta: function(magnitude, units) {
        var previous_year_number = this.year_number;
        var previous_month_number = this.month_number;
        switch (magnitude) {
        case TIME_DELTA_YEARS:
            this.year_number += units;
            break;
        case TIME_DELTA_MONTHS:
            this.month_number += units;
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

    /*__   ___ ___ ___  ___  __   __  
     / _` |__   |   |  |__  |__) /__` 
     \__> |___  |   |  |___ |  \ .__/ */
    get_all_day_instances: function() {
        if (this.day_instances.length === 0) {
            this.set_first_day_of_this_month();
            this.set_last_day_of_this_month();

            var length = this.last_day_of_this_month - this.first_day_of_this_month;
            for (var d = 0; d < length; d++) {
                this.day_instances.push(new DayInstance(this.first_day_of_this_month + d, this));
            }
        }
        return this.day_instances;
    },

    get_full_string: function() {
        return '(' + (this.month_number + 1) + ') ' + get_month_string_from_number(this.month_number) + ' ' + this.year_number;
    }
};
