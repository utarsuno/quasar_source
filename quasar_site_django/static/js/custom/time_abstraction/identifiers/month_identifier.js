'use strict';

function MonthIdentifier(month_identifier) {

    /*     __   __       ___  ___  __   __
     |  | |__) |  \  /\   |  |__  |__) /__`
     \__/ |    |__/ /~~\  |  |___ |  \ .__/ */
    this.update_month_identifier = function(month_identifier) {
        this.month_identifier = month_identifier;
        this.set_month_from_identifier();
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_all_day_instances = function() {
        var raw_days = get_days_in_month(this.month_number, this.year_number);
        for (var d = 0; d < raw_days.length; d++) {
            this.day_instances.push(new DayInstance(raw_days[d], this));
        }
    };

    this.set_month_from_identifier = function() {
        if (is_string(this.month_identifier)) {
            this.month_number = get_month_number_from_string(this.month_identifier);
        } else if (this.month_identifier === TIME_TYPE_MONTH_CURRENT) {
            this.month_number = get_current_month_number();
        } else {
            this.month_number = this.month_identifier;
        }
    };

    this.set_last_day_of_this_month = function() {
        var d = new Date(this.year_number, this.month_number + 1, 0);
        this.last_day_of_this_month_day_of_the_week = d.getDay() - 1;
        if (this.last_day_of_this_month_day_of_the_week === -1) {
            this.last_day_of_this_month_day_of_the_week = 6;
        }
        this.last_day_of_this_month = d.getDate();
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_month_type = function() {
        if (this.month_identifier === TIME_TYPE_MONTH_CURRENT) {
            return 'Current Month';
        } else {
            return get_month_string_from_number(this.month_number);
        }
    };

    this.get_month_type_for_entity = function() {
        if (this.month_identifier === TIME_TYPE_MONTH_CURRENT) {
            return TIME_TYPE_MONTH_CURRENT;
        } else {
            return this.month_number;
        }
    };

    this.get_month_number = function() {
        return this.month_number;
    };

    this.get_month_string = function() {
        return get_month_string_from_number(this.month_number);
    };

    /*__   __        __  ___  __        __  ___  __   __
     /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
     \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.month_identifier = month_identifier;
    this.set_month_from_identifier();
}
