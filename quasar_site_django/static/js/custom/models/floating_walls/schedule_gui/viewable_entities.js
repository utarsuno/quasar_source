'use strict';

function ViewableEntities() {

    this.add_viewable_entity = function(entity) {
        var due = entity.get_due_date().split('.');
        var due_date = parseInt(due[0]);

        var day_view = this.get_day_view_for_date(due_date);
        day_view.add_entity(entity);
    };

    this.remove_viewable_entity = function(entity) {
        for (var d = 0; d < this.simple_day_views.length; d++) {
            if (this.simple_day_views[d].has_entity(entity)) {
                this.simple_day_views[d].remove_entity(entity);
            }
        }
    };

    this.get_day_view_for_date = function(date) {
        for (var d = 0; d < this.simple_day_views.length; d++) {
            if (this.simple_day_views[d].day_instance.day_number === date) {
                return this.simple_day_views[d];
            }
        }
        raise_exception_with_full_logging('Day view not found!');
    };

    /*___      ___   ___         ___       ___      ___  __                     __               __
     |__  |\ |  |  |  |  \ /    |__  \  / |__  |\ |  |  /__`    |__|  /\  |\ | |  \ |    | |\ | / _`
     |___ | \|  |  |  |   |     |___  \/  |___ | \|  |  .__/    |  | /~~\ | \| |__/ |___ | | \| \__> */
    this.is_entity_viewable_for_this_month = function(entity) {
        var due = entity.get_due_date().split('.');
        var due_month = parseInt(due[1]) - 1;
        var due_year = parseInt(due[2]);
        return due_month === this.month_instance.get_month_number() && this.month_instance.get_year() === due_year;
    };

    this.on_entity_added_allowed_to_be_added = function(entity) {
        if (entity.is_schedule_viewable()) {
            if (this.is_entity_viewable_for_this_month(entity)) {
                return true;
            }
        }
        return false;
    };
}