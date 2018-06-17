'use strict';

function YearIdentifier(year_identifier) {

    /*     __   __       ___  ___  __   __
     |  | |__) |  \  /\   |  |__  |__) /__`
     \__/ |    |__/ /~~\  |  |___ |  \ .__/ */
    this.update_year_identifier = function(year_identifier) {
        this.year_identifier = year_identifier;
        this.set_year_from_identifier();
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_year_from_identifier = function() {
        if (this.year_identifier === TIME_TYPE_YEAR_CURRENT) {
            this.year_number = get_current_year_number();
        } else {
            this.year_number = this.year_identifier;
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_year_type = function() {
        if (this.year_identifier === TIME_TYPE_YEAR_CURRENT) {
            return 'Current Year';
        } else {
            return this.year_number;
        }
    };

    this.get_year_type_for_entity = function() {
        if (this.year_identifier === TIME_TYPE_YEAR_CURRENT) {
            return TIME_TYPE_YEAR_CURRENT;
        } else {
            return this.year_number;
        }
    };

    this.get_year = function() {
        return this.year_number;
    };

    /*__   __        __  ___  __        __  ___  __   __
     /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
     \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.year_identifier = year_identifier;
    this.set_year_from_identifier();
}
