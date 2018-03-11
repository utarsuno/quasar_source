'use strict';

function ViewableEntities() {

    this.viewable_entities = {};

    this.add_viewable_entity = function(entity) {
        l('TRYING TO ADD THIS ENTITY!');
        l(entity);

        var due = entity.get_due_date().split('.');
        var due_date = parseInt(due[0]);
        var due_month = parseInt(due[1]) - 1;
        var due_year = parseInt(due[2]);

        l('MONTH INSTANCE');
        l(this.month_instance.get_month_number());
        l(this.month_instance.get_year());

        l('ENTITY INSTANCE!');
        l(due_date);
        l(due_month);
        l(due_year);

        if (this.month_instance.get_month_number() === due_month && this.month_instance.get_year() === due_year) {
            var day_view = this.get_day_view_for_date(due_date);

            this.viewable_entities[entity.get_relative_id()] = [entity, day_view];

            day_view.add_entity(entity);
        }
    };

}