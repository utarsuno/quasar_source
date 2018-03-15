'use strict';

const INDEX_OF_ENTITY = 0;
const INDEX_OF_ENTITY_BUTTON = 1;

function DayViewSimple(day_instance, base_wall) {
    this.__init__(day_instance, base_wall);
}

DayViewSimple.prototype = {

    __init__: function(day_instance, base_wall) {
        this.day_instance = day_instance;
        this.base_wall    = base_wall;

        var position_width = this.base_wall.width / 7;
        var position_height = this.base_wall.height / 6;

        var width = (this.base_wall.width - 100) / 7;
        var height = (this.base_wall.height - 100) / 6;

        // Create the day view.
        this.day_view = new FloatingWall(width, height, null, null, this.base_wall.world, false);
        this.day_view.set_attachment_depth_offset(5);
        this.day_view.set_attachment_horizontal_offset(position_width * this.day_instance.day_of_the_week + width / 2, -HALF);
        this.day_view.set_attachment_vertical_offset(-(position_height * this.day_instance.week_number - height / 4), HALF);

        this.day_view.add_row(0).add_3D_element(this.day_instance.day_number, TYPE_TITLE, null);

        this.day_view.attach_to(this.base_wall);

        this.entities = {};

        // Wall used for editing existing entities.
        this.wall_entity_editor = new EntityEditor(this, this.base_wall);
    },

    _edit_entity: function(entity_relative_id, entity_button) {
        this.wall_entity_editor.edit_entity(entity_relative_id, entity_button);
    },

    update_color_for_entity: function(entity) {
        var entity_id = entity.get_relative_id();

        this.entities[entity_id][INDEX_OF_ENTITY_BUTTON].set_default_color(entity.get_color_for_schedule_view());
    },

    remove_entity: function(entity) {
        var entity_id = entity.get_relative_id();
        delete this.entities[entity_id];
        this.day_view.delete_row_by_name(entity_id);
        // TODO : Sort the day view rows.
        this.base_wall.refresh_position_and_look_at();
    },

    has_entity: function(entity) {
        var entity_id = entity.get_relative_id();
        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                if (this.entities[id][INDEX_OF_ENTITY].get_relative_id() === entity_id) {
                    return true;
                }
            }
        }
        return false;
    },

    add_entity: function(entity) {
        var entity_id = entity.get_relative_id();

        this.entities[entity_id] = [entity, null];

        // Schedule color for this entity.
        var entity_color = entity.get_color_for_schedule_view();

        var row = this.day_view.add_row(null, entity.get_relative_id());
        var entity_button = row.add_2D_button([0, 1], entity.get_value(ENTITY_PROPERTY_NAME), entity_color, null);

        entity_button.set_engage_function(this._edit_entity.bind(this, entity_id, entity_button));

        this.entities[entity_id][INDEX_OF_ENTITY_BUTTON] = entity_button;

        this.base_wall.refresh_position_and_look_at();
    }

};