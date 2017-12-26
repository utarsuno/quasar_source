'use strict';

// Each world (that needs it) will contain a single instance of DateSelector to re-use.
function DateSelector(world) {
    this.__init__(world);
}

DateSelector.prototype = {

    __init__: function(world) {
        this.world = world;

        var w = 400;
        var h = 700;
        var p = new THREE.Vector3(-5000, -5000, -5000);
        var n = new THREE.Vector3(0, 0, 0);

        this.wall = new FloatingWall(w, h, p, n, this.world, false);
        // TODO : Fix the title movement!
        this.wall.add_3D_title('Select Date');
        this.wall.add_close_button();

        this.wall.add_floating_2d_text(.1, .9, 'Select Date', TYPE_TITLE_CONSTANT, 0);

        this.date = new MyDate(THIS_DAY);

        // Year.
        this.decrease_year_button = this.wall.add_floating_2d_text(0, .25, ICON_LEFT, TYPE_BUTTON, 3);
        this.decrease_year_button.set_engage_function(this.decrease_year.bind(this));
        this.year = this.wall.add_floating_2d_text(.25, .75, this.date.get_year_as_string(), TYPE_CONSTANT_TEXT, 3);
        this.increase_year_button = this.wall.add_floating_2d_text(.75, 1, ICON_RIGHT, TYPE_BUTTON, 3);
        this.increase_year_button.set_engage_function(this.increase_year.bind(this));

        // Month.
        this.decrease_month_button = this.wall.add_floating_2d_text(0, .25, ICON_LEFT, TYPE_BUTTON, 4);
        this.decrease_month_button.set_engage_function(this.decrease_month.bind(this));
        this.month = this.wall.add_floating_2d_text(.25, .75, this.date.get_month_full_data_string(), TYPE_CONSTANT_TEXT, 4);
        this.increase_month_button = this.wall.add_floating_2d_text(.75, 1, ICON_RIGHT, TYPE_BUTTON, 4);
        this.increase_month_button.set_engage_function(this.increase_month.bind(this));

        // Days.
        
    },

    show_at: function(floating_2D_text) {
        this.wall.show();

        var bp = floating_2D_text.get_position();
        var bnd = floating_2D_text.parent_floating_wall.normal_depth;
        var bn = floating_2D_text.parent_floating_wall.normal;

        this.wall.normal = bn;
        this.wall.normal_depth = bnd;

        //this.wall.object3D.position.set(bp.x + bn.x * bnd, bp.y + bn.y * bnd, bp.z + bn.z * bnd);
        //this.wall.object3D.lookAt(new THREE.Vector3(bp.x + bn.x * bnd * 2, bp.y + bn.y * bnd * 2, bp.z + bn.z * bnd * 2));

        this.wall.pfw_button = floating_2D_text;
        this.wall.update_position_with_offset_xyz(0, 0, 0);
        this.wall.update_normal(bn);
        this.wall.update_position_and_normal_for_all_floating_text();

    },

    // TODO:
    hide: function() {

    },

    // Year.
    decrease_year: function() {
        this.date.apply_delta(DELTA_YEARS, -1);
        this.year.update_text(this.date.get_year_as_string());
    },

    increase_year: function() {
        this.date.apply_delta(DELTA_YEARS, 1);
        this.year.update_text(this.date.get_year_as_string());
    },

    // Month.
    decrease_month: function() {
        this.date.apply_delta(DELTA_MONTHS, -1);
        this.month.update_text(this.date.get_month_full_data_string());
    },

    increase_month: function() {
        this.date.apply_delta(DELTA_MONTHS, 1);
        this.month.update_text(this.date.get_month_full_data_string());
    }

    // Days.

};
