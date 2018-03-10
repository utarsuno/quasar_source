'use strict';

function MonthView(world, entity_to_load_from) {
    this.__init__(world, entity_to_load_from);
}

// TODO : Create the various month types.

MonthView.prototype = {

    __init__: function(world, entity_to_load_from) {
        if (is_defined(entity_to_load_from)) {
            this.load_from_entity(world, entity_to_load_from);
        } else {
            this.create_new(world);
        }

        // Get the current month type.
        this.current_month_type = this.month_view_entity.get_value(ENTITY_PROPERTY_MONTH_TYPE);
        if (this.current_month_type === MONTH_TYPE_CURRENT) {
            this.month_instance = new MonthInstance(THIS_MONTH);
        } else {
            this.month_instance = new MonthInstance(this.month_view_entity.get_value(parseInt(ENTITY_PROPERTY_NAME)));
        }
        this.add_base_wall_functionality();

        this.base_wall.only_moveable = true;
        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();
    },

    update_title: function() {
        this.title.update_text(this.month_instance.to_string());
    },

    /*__   ___ ___ ___         __   __
     /__` |__   |   |  | |\ | / _` /__`    |  |  /\  |    |
     .__/ |___  |   |  | | \| \__> .__/    |/\| /~~\ |___ |___ */
    month_type_selected: function(month_type) {
        if (month_type === MONTH_TYPE_CURRENT) {
            this.month_instance = new MonthInstance(THIS_MONTH);
        } else {
            this.month_instance = new MonthInstance(get_month_number_from_string(month_type));
        }
        this.update_title();
        this.month_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    create_month_type_selector: function() {
        this.month_type_selector_wall = this.month_type_button.add_floating_wall_attachment(400, 400, null, null, 10, false);
        this.month_type_selector_wall.add_close_button();
        this.month_type_selector_wall.set_auto_adjust_height(true);
        this.month_type_selector_wall.manual_visibility = true;

        var row = this.month_type_selector_wall.add_row();
        row.add_2D_button([0, 1], MONTH_TYPE_CURRENT, null, this.month_type_selected.bind(this, MONTH_TYPE_CURRENT));

        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_JANUARY, null, this.month_type_selected.bind(this, MONTH_JANUARY));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_FEBRUARY, null, this.month_type_selected.bind(this, MONTH_FEBRUARY));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_MARCH, null, this.month_type_selected.bind(this, MONTH_MARCH));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_APRIL, null, this.month_type_selected.bind(this, MONTH_APRIL));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_MAY, null, this.month_type_selected.bind(this, MONTH_MAY));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_JUNE, null, this.month_type_selected.bind(this, MONTH_JUNE));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_JULY, null, this.month_type_selected.bind(this, MONTH_JULY));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_AUGUST, null, this.month_type_selected.bind(this, MONTH_AUGUST));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_SEPTEMBER, null, this.month_type_selected.bind(this, MONTH_SEPTEMBER));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_OCTOBER, null, this.month_type_selected.bind(this, MONTH_OCTOBER));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_NOVEMBER, null, this.month_type_selected.bind(this, MONTH_NOVEMBER));
        row = this.month_type_selector_wall.add_row().add_2D_button([0, 1], MONTH_DECEMBER, null, this.month_type_selected.bind(this, MONTH_DECEMBER));

        this.month_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    show_month_type_selector: function() {
        this.month_type_selector_wall.force_display_self_and_all_child_attachments_recursively();
    },

    create_settings_wall: function() {
        this.settings_wall = this.base_wall.add_floating_wall_attachment(800, 400, null, [25, HALF], 10, false);
        this.settings_wall.add_close_button();
        this.settings_wall.set_auto_adjust_height(true);
        this.settings_wall.manual_visibility = true;

        var settings_row = this.settings_wall.add_row();
        settings_row.add_2D_element([0, ONE_THIRD], 'Month Type :', TYPE_CONSTANT);
        this.month_type_button = settings_row.add_2D_button([ONE_THIRD, 1], this.current_month_type, null, this.show_month_type_selector.bind(this));

        this.settings_wall.force_hide_self_and_all_child_attachments_recursively();

        this.create_month_type_selector();
    },

    show_settings_wall: function() {
        this.settings_wall.force_display_self_and_all_child_attachments_recursively();
    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    add_base_wall_functionality: function() {
        this.create_settings_wall();

        // Create the settings button.
        var row = this.base_wall.add_row(-1);
        var icon_width = 16 / this.base_wall.width;

        var settings_button = row.add_2D_element([1 - icon_width, 1], ICON_SETTINGS, TYPE_ICON);
        this.base_wall.world.interactive_objects.push(settings_button);
        settings_button.engable = false;
        settings_button.set_engage_function(this.show_settings_wall.bind(this));

        // Add the title.
        this.title = row.add_3D_element(this.month_instance.to_string(), TYPE_TITLE, null);


        // TODO : Load the month.
        // TODO : Load all entity data from the world!!!
    },

    create_new: function(world) {
        var data = get_player_blink_spot(1000);
        this.base_wall = new FloatingWall(2000, 1000, data[0], data[1], world, true);
        this.base_wall.set_to_saveable(world.entity);

        this.month_view_entity = new Entity();
        this.month_view_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_MONTH_VIEW);
        this.month_view_entity.set_property(ENTITY_PROPERTY_MONTH_TYPE, MONTH_TYPE_CURRENT);
        this.month_view_entity.add_parent(this.base_wall.get_self_entity());
    },

    load_from_entity: function(world, entity) {
        this.month_view_entity = entity;

        // Load the base wall.
        this.base_wall = new FloatingWall(2000, 1000, null, null, world, true);
        this.base_wall.load_from_entity_data(this.month_view_entity.get_parent());
    }

};
