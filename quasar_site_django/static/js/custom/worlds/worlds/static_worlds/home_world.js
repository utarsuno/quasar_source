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
        WorldObjectSavingAndLoading.call(this);
    },

    create: function() {

        // TODO : REMOVE ALL THIS CODE. IT SHOULD BE GENERALIZED FOR ALL WORLDS!

        // Used for debugging for now.
        this.floating_pictures = [];
        this.entity_walls =  [];

        // Load all the floating pictures.
        var floating_pictures = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_PICTURE);
        for (var p = 0; p < floating_pictures.length; p++) {
            var fp = new FloatingPicture(floating_pictures[p], this, true);

            this.floating_pictures.push(fp);

            // TODO : Add this floating picture to root attachables?
        }

        var entity_walls = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_ENTITY_WALL);
        for (var ew = 0; ew < entity_walls.length; ew++) {
            l('Creating a new entity wall!');
            var entity_wall = new EntityWall(this, entity_walls[ew]);
            this.entity_walls.push(entity_wall);
        }



        //this.schedule_view = new ScheduleView(this);
        //this.schedule_view.create_year_schedule_view();
        //this.add_content_to_schedules();
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

