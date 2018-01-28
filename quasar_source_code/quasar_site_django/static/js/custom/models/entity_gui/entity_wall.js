'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    __init__: function(world, entity) {
        this.date_selector = null;

        if (!is_defined(entity)) {
            var pp = CURRENT_PLAYER.get_position();
            var pn = CURRENT_PLAYER.get_direction();
            var p = new THREE.Vector3(pp.x + pn.x * 200, pp.y + pn.y * 200, pp.z + pn.z * 200);
            var n = new THREE.Vector3(-pn.x, 0, -pn.z);

            this.base_wall = new FloatingWall(400, 600, p, n, world, true);

            this.base_wall.add_row_3D_text(false, -1, 'Entity Wall', TYPE_INPUT);

            this.base_wall.set_to_saveable();
        } else {
            this.base_wall = new FloatingWall(400, 600, null, null, world, true);

            this.base_wall.set_entity(entity);

            var width = this.base_wall.get_value(ENTITY_PROPERTY_WIDTH);
            var height = this.base_wall.get_value(ENTITY_PROPERTY_HEIGHT);
            var position = this.base_wall.get_value(ENTITY_PROPERTY_POSITION);
            var normal = this.base_wall.get_value(ENTITY_PROPERTY_NORMAL);

            this.base_wall.width = width;
            this.base_wall.height = height;
            this.base_wall.set_position(position.x, position.y, position.z);
            this.base_wall.set_normal(normal.x, normal.y, normal.z);

            this.base_wall.dimensions_changed();

            var rows_2D = this.base_wall.get_value(ENTITY_PROPERTY_2D_ROWS);
            var rows_3D = this.base_wall.get_value(ENTITY_PROPERTY_3D_ROWS);

            // Parse the 2D rows.
            if (is_defined(rows_2D)) {
                rows_2D = rows_2D.split('@');
                for (var r2 = 0; r2 < rows_2D.length; r2++) {
                    l('PARSE THE FOLLOWING 2D ROW!!!');
                    l(rows_2D[r2]);
                    if (rows_2D[r2] !== '') {

                        // INDEX {ROW}          - 0
                        // INDEX {X_START}      - 1
                        // INDEX {X_END}        - 2
                        // INDEX {TEXT}         - 3
                        // INDEX {TYPE}         - 4
                        // INDEX {COLOR}        - 5
                        // INDEX {SYNTAX_RULES} - 6

                        var d = rows_2D[r2].split('+');

                        this.base_wall.add_row_2D_text([d[1], d[2]], d[0], d[3], d[4], d[6], d[5]);
                    }
                }
            }

            // Parse the 3D rows.
            if (is_defined(rows_3D)) {
                rows_3D = rows_3D.split('@');
                for (var r3 = 0; r3 < rows_3D.length; r3++) {
                    l('PARSE THE FOLLOWING 3D ROW!!!');
                    l(rows_3D[r3]);
                    if (rows_3D[r3] !== '') {

                        // INDEX {ROW}      - 0
                        // INDEX {CENTERED} - 1
                        // INDEX {TEXT}     - 2
                        // INDEX {TYPE}     - 3
                        // INDEX {COLOR}    - 4

                        var d = rows_3D[r3].split('+');

                        if (d[1] === 'true' || d[1] === 'True') {
                            d[1] = true;
                        } else if (d[1] === 'false' || d[1] === 'False') {
                            d[1] = false;
                        }

                        this.base_wall.add_row_3D_text(d[1], d[0], d[2], d[3], d[4]);
                    }
                }
            }

            this.base_wall.refresh_position_and_look_at();
        }

        // Create the standard functionality of the entity wall.
        this.create_new_entity_button = this.base_wall.add_row_2D_text([0, 1], 0, 'Create New Entity', TYPE_BUTTON, null, COLOR_GREEN);
        this.create_new_entity_button.set_engage_function(this._create_new_entity_button_pressed.bind(this));


        // Regardless if created or loaded the following operations must be taken.
        // TODO : This should be automatic? Remove the need to explicitly need to write this code.
        this.base_wall.world.root_attachables.push(this.base_wall);

        this._init_create_new_entity_wall();
        this._init_select_entity_type_wall();
        this._init_add_new_field_wall();

        this.base_wall.refresh_position_and_look_at();
    },

    /*__       ___  ___     __   ___       ___  __  ___  __   __
     |  \  /\   |  |__     /__` |__  |    |__  /  `  |  /  \ |__)
     |__/ /~~\  |  |___    .__/ |___ |___ |___ \__,  |  \__/ |  \ */
    date_selected: function(date_object) {
        this.date_selector.wall_date_selector.force_hide_self_and_all_child_attachments_recursively();
        this.select_date_button.update_text(date_object.to_string());
    },

    _show_date_selector: function() {
        if (!is_defined(this.date_selector)) {
            this.date_selector = new DateSelector(this.base_wall.world, this.date_selected.bind(this));
        }

        this.date_selector.wall_date_selector.force_display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*     __   __           ___          ___    ___       __
      /\  |  \ |  \    |\ | |__  |  |    |__  | |__  |    |  \    |  |  /\  |    |
     /~~\ |__/ |__/    | \| |___ |/\|    |    | |___ |___ |__/    |/\| /~~\ |___ |___ */
    _init_add_new_field_wall: function() {
        if (is_defined(this.wall_add_new_field)) {
            this.wall_add_new_field.fully_remove_self_and_all_sub_attachments();
        }

        this.wall_add_new_field = new FloatingWall(200, 300, null, null, this.base_wall.world, false, COLOR_BLUE);
        this.wall_add_new_field.manual_visibility = true;
        this.wall_add_new_field.set_attachment_depth_offset(10);
        this.wall_add_new_field.attach_to(this.add_new_field_button);
        this.wall_add_new_field.add_close_button();
        this.wall_add_new_field.add_row_3D_text(false, -1, 'Add New Field', TYPE_TITLE);

        // All the field options.
        this.wall_add_new_field.add_row_2D_text([0, 1], 1, 'Default Fields', TYPE_CONSTANT);

        this.current_entity_field_row = 2;
        this._add_selectable_entity_field(ENTITY_PROPERTY_DUE_DATE);
        this._add_selectable_entity_field(ENTITY_PROPERTY_DUE_TIME);
        this._add_selectable_entity_field(ENTITY_PROPERTY_TAGS);
        this._add_selectable_entity_field(ENTITY_PROPERTY_NOTE);

        this.wall_add_new_field.add_row_2D_text([0, 1], this.current_entity_field_row + 2, 'Or create a custom field', TYPE_CONSTANT);
        this.custom_field_name = this.wall_add_new_field.add_row_2D_text([0, 1], this.current_entity_field_row + 3, 'Field Name', TYPE_INPUT);
        this.add_custom_field_button = this.wall_add_new_field.add_row_2D_text([0, 1], this.current_entity_field_row + 4, 'Add Custom Field', TYPE_BUTTON);
        this.add_custom_field_button.set_engage_function(this._custom_field_added.bind(this));

        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
    },

    _add_selectable_entity_field: function(field_name) {
        if (this.current_entity_fields.indexOf(field_name) === NOT_FOUND) {
            var button = this.wall_add_new_field.add_row_2D_text([0, 1], this.current_entity_field_row, field_name, TYPE_BUTTON);
            button.set_engage_function(this._add_entity_field.bind(this, field_name));
            this.current_entity_field_row += 1;
        }
    },

    _add_entity_field: function(field_name) {
        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
        this.wall_create_new_entity.insert_row_2D_text([0, ONE_THIRD], this.last_entity_field_row + 1, field_name, TYPE_CONSTANT);

        if (field_name === ENTITY_PROPERTY_DUE_DATE) {
            this.select_date_button = this.wall_create_new_entity.add_row_2D_text([ONE_THIRD, 1], this.last_entity_field_row + 1, 'Select Date', TYPE_BUTTON);
            this.date_selector.wall_date_selector.attach_to(this.select_date_button);
            this.select_date_button.set_engage_function(this._show_date_selector.bind(this));
            //select_date_button.set_engage_function(this.date_selector.display_self_and_all_child_attachments_recursively);
        } else {
            this.wall_create_new_entity.add_row_2D_text([ONE_THIRD, 1], this.last_entity_field_row + 1, '', TYPE_INPUT);
        }

        this.last_entity_field_row += 1;

        this.current_entity_fields.push(field_name);

        this.base_wall.refresh_position_and_look_at();
    },

    _custom_field_added: function() {
        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
        var custom_field_name = this.custom_field_name.get_text();
        if (!custom_field_name.startsWith('ep_')) {
            custom_field_name = 'ep_' + custom_field_name;
        }
        this._add_entity_field(custom_field_name);
        // TODO : Add all the error checking needed!!!
    },

    _add_entity_field_button_pressed: function() {
        this._init_add_new_field_wall();
        this.wall_add_new_field.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*__   ___       ___  __  ___     ___      ___   ___        ___      __   ___
     /__` |__  |    |__  /  `  |     |__  |\ |  |  |  |  \ /     |  \ / |__) |__     |  |  /\  |    |
     .__/ |___ |___ |___ \__,  |     |___ | \|  |  |  |   |      |   |  |    |___    |/\| /~~\ |___ |___ */
    _init_select_entity_type_wall: function() {
        this.wall_select_entity_type = new FloatingWall(300, 400, null, null, this.base_wall.world, false, COLOR_YELLOW);
        this.wall_select_entity_type.manual_visibility = true;
        this.wall_select_entity_type.set_attachment_depth_offset(10);
        this.wall_select_entity_type.attach_to(this.create_new_entity_select_entity_type_button);
        this.wall_select_entity_type.add_close_button();
        this.wall_select_entity_type.add_row_3D_text(false, -1, 'Select Entity Type', TYPE_TITLE);
        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
    },

    _select_entity_type_button_pressed: function() {
        this.wall_select_entity_type.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*__   __   ___      ___  ___          ___          ___      ___   ___
     /  ` |__) |__   /\   |  |__     |\ | |__  |  |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
     \__, |  \ |___ /~~\  |  |___    | \| |___ |/\|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
    _init_create_new_entity_wall: function() {
        this.current_entity_fields = [];

        this.wall_create_new_entity = new FloatingWall(600, 400, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_SUCCESS);
        this.wall_create_new_entity.manual_visibility = true;
        this.wall_create_new_entity.set_attachment_depth_offset(10);
        this.wall_create_new_entity.add_row_3D_text(false, -1, 'Create New Entity', TYPE_TITLE, COLOR_GREEN);
        this.wall_create_new_entity.add_close_button();
        this.wall_create_new_entity.attach_to(this.create_new_entity_button);

        this.create_new_entity_select_entity_type_button = this.wall_create_new_entity.add_row_2D_text([0, .75], 0, 'Select Base Entity Type', TYPE_BUTTON);
        this.create_new_entity_select_entity_type_button.set_engage_function(this._select_entity_type_button_pressed.bind(this));
        this.wall_create_new_entity.add_row_2D_text([0, ONE_THIRD], 1, ENTITY_DEFAULT_PROPERTY_TYPE, TYPE_CONSTANT);
        this.wall_create_new_entity.add_row_2D_text([ONE_THIRD, 1], 1, 'Default', TYPE_CONSTANT);

        this.wall_create_new_entity.add_row_2D_text([0, ONE_THIRD], 2, ENTITY_PROPERTY_NAME, TYPE_CONSTANT);
        this.wall_create_new_entity.add_row_2D_text([ONE_THIRD, 1], 2, '', TYPE_INPUT);

        this.current_entity_fields.push(ENTITY_PROPERTY_NAME);
        this.current_entity_fields.push(ENTITY_DEFAULT_PROPERTY_TYPE);

        this.last_entity_field_row = 2;

        this.add_new_field_button = this.wall_create_new_entity.add_row_2D_text([0, 1], 3, 'Add new field', TYPE_BUTTON);
        this.add_new_field_button.set_engage_function(this._add_entity_field_button_pressed.bind(this));
        this.wall_create_new_entity.add_row_2D_text([0, 1], 4, 'Create Entity', TYPE_BUTTON);

        this.wall_create_new_entity.hide_self_and_all_child_attachments_recursively();
    },

    _create_new_entity_button_pressed: function() {
        this.wall_create_new_entity.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    }


};