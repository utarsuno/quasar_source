'use strict';

function MonthInstance(month_identifier, year_identifier) {
    this.__init__(month_identifier, year_identifier);
}

MonthInstance.prototype = {
    __init__: function(month_identifier, year_identifier) {
        this.month_identifier = month_identifier;
        this.year_identifier  = year_identifier;

        this.day_instances_created = false;

        // If both the month and year identifiers are not defined than use the current month.
        if (!is_defined(this.month_identifier) && !is_defined(this.year_identifier)) {
            this.set_to_current_month();
        } else if (!is_defined(this.year_identifier)) {
            // Use the current year and the month identifier.
            this.set_to_current_year_and_month_identifier();
        } else {
            // Use the year and month identifier.
            this.set_from_identifiers();
        }
    },


    /*     __   __       ___  ___  __   __
     |  | |__) |  \  /\   |  |__  |__) /__`
     \__/ |    |__/ /~~\  |  |___ |  \ .__/ */
    apply_delta: function(magnitude, units) {
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
    },

    update_month_identifier: function(month_identifier) {
        this.month_identifier = month_identifier;
        this.set_month_from_identifier();
    },

    update_year_identifier: function(year_identifier) {
        this.year_identifier = year_identifier;
        this.set_year_from_identifier();
    },

    /*__   ___ ___ ___  ___  __   __  
     /__` |__   |   |  |__  |__) /__` 
     .__/ |___  |   |  |___ |  \ .__/ */
    set_month_from_identifier: function() {
        if (is_string(this.month_identifier)) {
            this.month_number = get_month_number_from_string(this.month_identifier);
        } else if (this.month_identifier === TIME_TYPE_MONTH_CURRENT) {
            this.month_number = get_current_month_number();
        } else {
            this.month_number = this.month_identifier;
        }
    },

    set_year_from_identifier: function() {
        if (this.year_identifier === TIME_TYPE_YEAR_CURRENT) {
            this.year_number = get_current_year_number();
        } else {
            this.year_number = this.year_identifier;
        }
    },
     
    /*__   ___ ___ ___  ___  __   __  
     / _` |__   |   |  |__  |__) /__` 
     \__> |___  |   |  |___ |  \ .__/ */
    get_full_string: function() {
        return '(' + (this.month_number + 1) + ') ' + get_month_string_from_number(this.month_number) + ' ' + this.year_number;
    },

    get_year: function() {
        return this.year_number;
    },

    get_month_number: function() {
        return this.month_number;
    },

    get_month_string: function() {
        return get_month_string_from_number(this.month_number);
    },

    get_month_type: function() {
        if (this.month_identifier === TIME_TYPE_MONTH_CURRENT) {
            return 'Current Month';
        } else {
            return get_month_string_from_number(this.month_number);
        }
    },

    get_month_type_for_entity: function() {
        if (this.month_identifier === TIME_TYPE_MONTH_CURRENT) {
            return TIME_TYPE_MONTH_CURRENT;
        } else {
            return this.month_number;
        }
    },

    get_year_type: function() {
        if (this.year_identifier === TIME_TYPE_YEAR_CURRENT) {
            return 'Current Year';
        } else {
            return this.year_number;
        }
    },

    get_year_type_for_entity: function() {
        if (this.year_identifier === TIME_TYPE_YEAR_CURRENT) {
            return TIME_TYPE_YEAR_CURRENT;
        } else {
            return this.year_number;
        }
    },

    /*        ___               __      ___    __
     | |\ | |  |  |  /\  |    |  /  /\   |  | /  \ |\ |
     | | \| |  |  | /~~\ |___ | /_ /~~\  |  | \__/ | \| */
    set_from_identifiers: function() {
        this.set_month_from_identifier();
        this.set_year_from_identifier();
    },

    set_to_current_year_and_month_identifier: function() {
        this.year_number = get_current_year_number();
        this.set_month_from_identifier();
    },

    set_to_current_month: function() {
        this.year_number = get_current_year_number();
        this.month_number = get_current_month_number();
    }
};
