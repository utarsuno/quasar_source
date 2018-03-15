'use strict';

function ViewableEntities() {

    /*    ___          ___         ___            __  ___    __        __
     |  |  |  | |    |  |  \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     \__/  |  | |___ |  |   |     |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    this.get_day_view_for_date = function(date) {
        for (var d = 0; d < this.simple_day_views.length; d++) {
            if (this.simple_day_views[d].day_instance.day_number === date) {
                return this.simple_day_views[d];
            }
        }
        raise_exception_with_full_logging('Day view not found!');
    };

    this.is_entity_viewable_for_this_month = function(entity) {
        var due = entity.get_due_date().split('.');
        var due_month = parseInt(due[1]) - 1;
        var due_year = parseInt(due[2]);
        return due_month === this.month_instance.get_month_number() && this.month_instance.get_year() === due_year;
    };

    /*__   __        __   __           __   __       ___  ___  __
     /  ` /  \ |    /  \ |__)    |  | |__) |  \  /\   |  |__  /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |__/ /~~\  |  |___ .__/ */
    this.update_color_for_entity = function(entity) {
        for (var d = 0; d < this.simple_day_views.length; d++) {
            if (this.simple_day_views[d].has_entity(entity)) {
                this.simple_day_views[d].update_color_for_entity(entity);
            }
        }
    };

    /*___      ___   ___         ___       ___      ___  __                     __               __
     |__  |\ |  |  |  |  \ /    |__  \  / |__  |\ |  |  /__`    |__|  /\  |\ | |  \ |    | |\ | / _`
     |___ | \|  |  |  |   |     |___  \/  |___ | \|  |  .__/    |  | /~~\ | \| |__/ |___ | | \| \__> */
    this.on_entity_property_removed = function(entity, property) {
        // Double check if the entity is still viewable for this month.
        if (!this.on_entity_added_allowed_to_be_added(entity)) {
            // Since this entity is no longer viewable for this schedule, remove it from this month view.
            this.entity_deleted(entity);
        }

        // Check if the color needs to be updated.
        if (property === ENTITY_PROPERTY_COMPLETED) {
            this.update_color_for_entity();
        }
    };

    this.on_foreign_entity_property_set_or_changed = function(entity, property) {
        // Check if this foreign entity can now be added to this month view.
        if (this.on_entity_added_allowed_to_be_added(entity)) {
            // Add the entity.
            this.entity_added(entity);
        }
    };

    this.on_entity_property_set_or_changed = function(entity, property) {
        // Check if the entity color needs to change.
        if (property === ENTITY_PROPERTY_COMPLETED) {
            this.update_color_for_entity();
        }
    };

    this.on_entity_added = function(entity) {
        var due = entity.get_due_date().split('.');
        var due_date = parseInt(due[0]);

        var day_view = this.get_day_view_for_date(due_date);
        day_view.add_entity(entity);
    };

    this.on_entity_deleted = function(entity) {
        for (var d = 0; d < this.simple_day_views.length; d++) {
            if (this.simple_day_views[d].has_entity(entity)) {
                this.simple_day_views[d].remove_entity(entity);
            }
        }
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