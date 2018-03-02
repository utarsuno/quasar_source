'use strict';

function HomeWorld(static_world_entity) {
    this.__init__(static_world_entity);
}

HomeWorld.prototype = {

    __init__: function(static_world_entity) {
        // Inherit.
        World.call(this, static_world_entity);
        WorldInput.call(this);
        WorldState.call(this, new THREE.Vector3(0, 100, 0));
        WorldDynamicContent.call(this);
    },

    create: function() {
    },

    /*__   __        ___  __             ___            ___
     /__` /  ` |__| |__  |  \ |  | |    |__     \  / | |__  |  |
     .__/ \__, |  | |___ |__/ \__/ |___ |___     \/  | |___ |/\| */
    // TODO : REFACTOR THIS, GENERALIZE IT FOR ALL WORLDS!!!
    add_content_to_schedules: function() {
        for (var ew = 0; ew < this.entity_walls.length; ew++) {
            var entities = this.entity_walls[ew].get_all_entities();

            for (var e = 0; e < entities.length; e++) {
                var current_entity = entities[e];

                if (current_entity.has_property(ENTITY_PROPERTY_END_DATE_TIME)) {
                    var due_date_time = current_entity.get_value(ENTITY_PROPERTY_END_DATE_TIME);
                    due_date_time = due_date_time.split('+');
                    var due_date = due_date_time[0];

                    if (due_date !== NO_DATE_SELECTED) {
                        this.schedule_view.add_entity_to_day_view(due_date, current_entity);
                    }
                }
            }
        }
    }
};

