'use strict';

function HomeWorld() {
    this.__init__();
}

HomeWorld.prototype = {

    __init__: function() {
        // Inherit from World.
        World.call(this);
    },

    create: function() {
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
            var entity_wall = new EntityWall(this, entity_walls[ew]);
            this.entity_walls.push(entity_wall);
        }



        //this.schedule_view = new ScheduleView(this);
        //this.schedule_view.create_year_schedule_view();
        //this.add_content_to_schedules();
    },

    prepare_for_save: function() {
        // TODO : Return a boolean indicating if anything needs to be saved.
        for (var r = 0; r < this.root_attachables.length; r++) {
            this.root_attachables[r].update_values_for_entity();
        }
    },

    enter_world: function() {
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);
    },

    exit_world: function() {
    },

    /*__   __        ___  __             ___            ___
     /__` /  ` |__| |__  |  \ |  | |    |__     \  / | |__  |  |
     .__/ \__, |  | |___ |__/ \__/ |___ |___     \/  | |___ |/\| */
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

