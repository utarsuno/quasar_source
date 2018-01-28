'use strict';

function HomeWorld() {
    this.__init__();
}

const MONTH_VIEW_RADIUS = 3000;

HomeWorld.prototype = {

    __init__: function() {
        // Inherit from World.
        World.call(this);
    },

    create: function() {
        // Create the current month view.
        this.load_schedule();

        // Load all the floating pictures.
        var floating_pictures = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_PICTURE);
        for (var p = 0; p < floating_pictures.length; p++) {
            var fp = new FloatingPicture(floating_pictures[p], this, true);

            // TODO : Add this floating picture to root attachables?
        }

        var entity_walls = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_WALL);
        for (var ew = 0; ew < entity_walls.length; ew++) {
            var entity_wall = new EntityWall(this, entity_walls[ew]);
        }

        // TODO : Load all entity walls.
    },

    prepare_for_save: function() {


        for (var r = 0; r < this.root_attachables.length; r++) {
            this.root_attachables[r].update_values_for_entity();
        }


        /*
        for (var i = 0; i < this.entity_walls.length; i++) {
            this.entity_walls[i].prepare_for_save();
        }
        */
    },

    enter_world: function() {
        CURRENT_PLAYER.disengage();
        if (!GUI_PAUSED_MENU.currently_displayed) {
            CURRENT_PLAYER.enable_controls();
        }
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);

        /*
        if (!this.schedule_loaded) {
            this.load_schedule();
            this.load_date_selector();
        }
        */
    },

    exit_world: function() {
    },

    /*__   __        ___  __             ___            ___
     /__` /  ` |__| |__  |  \ |  | |    |__     \  / | |__  |  |
     .__/ \__, |  | |___ |__/ \__/ |___ |___     \/  | |___ |/\| */
    add_content_to_schedules: function() {
        l('TODO : Add content to schedules');
        /*
        var dates_in_past = this.month_days.get_dates_in_past();
        var dates_in_present = this.month_days.get_dates_in_present();
        var dates_in_future = this.month_days.get_dates_in_future();

        var all_entities = MANAGER_ENTITY.get_all_entities_with_property(ENTITY_PROPERTY_DUE_DATE);

        var d;
        for (d = 0; d < all_entities.length; d++) {
            l(all_entities[d]);
        }

        for (d = 0; d < dates_in_future.length; d++) {
            l('Checking');
            l(dates_in_future[d]);
        }
        */
    },

    create_month_day_wall: function(day, index, total_number_of_days, present) {
        var w = 500;
        var h = 1000;

        var percentage = index / total_number_of_days;
        var x_position = cos(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;
        var z_position = sin(percentage * TWO_PIE) * MONTH_VIEW_RADIUS;

        var p = new THREE.Vector3(x_position, 1000, z_position);
        var n = new THREE.Vector3(-x_position, 0, -z_position);

        var month_day_wall = new FloatingWall(w, h, p, n, this, false);

        month_day_wall.add_row_3D_text(false, -1, day.get_day_number(), TYPE_SUPER_TITLE, this.month_days.get_day_color_by_index(index));

        if (present) {
            month_day_wall.add_row_3D_text(false, -2, 'Today', TYPE_SUPER_TITLE, this.month_days.get_day_color_by_index(index));
        }

        month_day_wall.refresh_position_and_look_at();

        return month_day_wall;
    },

    load_schedule: function() {
        // The 360 schedule view.
        this.month_day_walls = [];
        this.month_days = new MonthInstance(THIS_MONTH);

        var dates_in_past = this.month_days.get_dates_in_past();
        var dates_in_present = this.month_days.get_dates_in_present();
        var dates_in_future = this.month_days.get_dates_in_future();

        var day_index = 0;
        var d;
        for (d = 0; d < dates_in_past.length; d++) {
            this.month_day_walls.push(this.create_month_day_wall(dates_in_past[d], day_index, this.month_days.dates.length, false));
            day_index += 1;
        }
        this.month_day_walls.push(this.create_month_day_wall(dates_in_present[0], day_index, this.month_days.dates.length, true));
        day_index += 1;
        for (d = 0; d < dates_in_future.length; d++) {
            this.month_day_walls.push(this.create_month_day_wall(dates_in_future[d], day_index, this.month_days.dates.length, false));
            day_index += 1;
        }
    }
};

