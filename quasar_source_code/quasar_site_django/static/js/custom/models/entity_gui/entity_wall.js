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
        this.wall_add_new_field.add_full_row_3D(-1, 'Add New Field', TYPE_TITLE);

        // All the field options.
        this.wall_add_new_field.add_full_row_2D(0, 'Default Fields', TYPE_CONSTANT);

        // Adding an emtpy row for spacing.
        this.wall_add_new_field.add_row();

        this._add_selectable_entity_field(ENTITY_PROPERTY_DUE_DATE);
        this._add_selectable_entity_field(ENTITY_PROPERTY_DUE_TIME);
        this._add_selectable_entity_field(ENTITY_PROPERTY_TAGS);
        this._add_selectable_entity_field(ENTITY_PROPERTY_NOTE);

        // Adding an emtpy row for spacing.
        this.wall_add_new_field.add_row();

        this.wall_add_new_field.add_full_row_2D(null, 'Or create a custom field', TYPE_CONSTANT);
        this.custom_field_name = this.wall_add_new_field.add_full_row_2D(null, 'Field Name', TYPE_INPUT);
        this.wall_add_new_field.add_row(null).add_2D_button([0, 1], 'Add custom field', null, this._custom_field_added.bind(this));

        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();
    },

    _add_selectable_entity_field: function(field_name) {
        if (!this.wall_create_new_entity.has_row_with_name(field_name)) {
            this.wall_add_new_field.add_row(null, field_name).add_2D_button([0, 1], field_name, null, this._add_entity_field.bind(this, field_name));
        }
    },

    _delete_entity_field: function(row_number, field_name) {
        if (field_name === ENTITY_PROPERTY_DUE_DATE) {
            l(this.date_selector.wall_date_selector.attachment_parent);
            this.date_selector.wall_date_selector.detach_from_parent();
            l(this.date_selector.wall_date_selector.attachment_parent);
        }

        this.wall_create_new_entity.delete_row(row_number);

        this.last_entity_field_row -= 1;

        var remove_index = -1;
        for (var f = 0; f < this.current_entity_fields.length; f++) {
            if (this.current_entity_fields[f] === field_name) {
                remove_index = f;
                break;
            }
        }
        if (remove_index !== NOT_FOUND) {
            this.current_entity_fields.splice(remove_index, 1);
        }
    },

    _add_entity_field: function(field_name) {
        this.wall_add_new_field.hide_self_and_all_child_attachments_recursively();

        // Check if the field was already added.
        if (!this.wall_create_new_entity.has_row_with_name(field_name)) {

            // Get the row index of the add_field_button.
            var insert_index_for_row = this.wall_create_new_entity.get_row_with_name('add_new_field').row_number;

            var new_field_row = this.wall_create_new_entity.add_row(insert_index_for_row, field_name);
            new_field_row.add_2D_element([0, ONE_THIRD], field_name, TYPE_CONSTANT);

            var input_field;

            if (field_name === ENTITY_PROPERTY_DUE_DATE) {
                if (!is_defined(this.date_selector)) {
                    this.date_selector = new DateSelector(this.base_wall.world, this.date_selected.bind(this));
                }
                this.select_date_button = new_field_row.add_2D_button([ONE_THIRD, 1], 'Select Date', null, this._show_date_selector.bind(this));
                input_field = this.select_date_button;
                this.date_selector.wall_date_selector.attach_to(this.select_date_button);
                this.date_selector.refresh_dates();
                this.date_selector.wall_date_selector.force_hide_self_and_all_child_attachments_recursively();
            } else {
                input_field = new_field_row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);
            }

            // Add button to delete the entity field.
            var delete_entity_field_button = new Floating2DText(100, 'Delete Field', TYPE_BUTTON, this.base_wall.world, null, COLOR_RED);
            delete_entity_field_button.set_attachment_horizontal_offset(50 + input_field.width / 2, null);
            delete_entity_field_button.attach_to(input_field);
            //delete_entity_field_button.set_engage_function(this._delete_entity_field.bind(this, this.last_entity_field_row + 1, field_name));

            this.base_wall.refresh_position_and_look_at();
        }
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
        this.wall_select_entity_type = new FloatingWall(200, 100, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_YELLOW);
        this.wall_select_entity_type.manual_visibility = true;
        this.wall_select_entity_type.set_attachment_depth_offset(10);
        this.wall_select_entity_type.attach_to(this.entity_type_button);
        this.wall_select_entity_type.add_close_button();
        this.wall_select_entity_type.add_full_row_3D(-1, 'Select Entity Type', TYPE_TITLE);

        this.wall_select_entity_type.add_row(1).add_2D_button([0, 1], ENTITY_TYPE_BASE, null, this._entity_type_selected.bind(this, ENTITY_TYPE_BASE));
        this.wall_select_entity_type.add_row(2).add_2D_button([0, 1], ENTITY_TYPE_TASK, null, this._entity_type_selected.bind(this, ENTITY_TYPE_TASK));

        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
    },

    _entity_type_selected: function(entity_type) {
        this.wall_select_entity_type.hide_self_and_all_child_attachments_recursively();
        this.entity_type_button.update_text(entity_type);
        if (entity_type === ENTITY_TYPE_TASK) {
            this._add_entity_field(ENTITY_PROPERTY_DUE_DATE);
        }
    },

    _select_entity_type_button_pressed: function() {
        this.wall_select_entity_type.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    },

    /*__   __   ___      ___  ___          ___          ___      ___   ___
     /  ` |__) |__   /\   |  |__     |\ | |__  |  |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
     \__, |  \ |___ /~~\  |  |___    | \| |___ |/\|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
    _init_create_new_entity_wall: function() {
        this.wall_create_new_entity = new FloatingWall(600, 400, null, null, this.base_wall.world, false, COLOR_FLOATING_WALL_SUCCESS);
        this.wall_create_new_entity.manual_visibility = true;
        this.wall_create_new_entity.set_attachment_depth_offset(10);
        this.wall_create_new_entity.add_full_row_3D(-1, 'Create New Entity', TYPE_TITLE);
        this.wall_create_new_entity.add_close_button();
        this.wall_create_new_entity.attach_to(this.create_new_entity_button);

        var entity_type_row = this.wall_create_new_entity.add_row(0, ENTITY_DEFAULT_PROPERTY_TYPE).add_2D_label_and_button(ONE_THIRD, ENTITY_DEFAULT_PROPERTY_TYPE, 'Entity', this._select_entity_type_button_pressed.bind(this));
        this.entity_type_button = entity_type_row[1];

        this.wall_create_new_entity.add_row(1, ENTITY_PROPERTY_NAME).add_2D_label_and_input(ONE_THIRD, ENTITY_PROPERTY_NAME);

        this.add_new_field_button = this.wall_create_new_entity.add_row(2, 'add_new_field').add_2D_button([0, 1], 'add new field', null, this._add_entity_field_button_pressed.bind(this));
        this.wall_create_new_entity.add_row(3).add_2D_button([0, 1], 'create entity', null, this._entity_created.bind(this));

        this.wall_create_new_entity.hide_self_and_all_child_attachments_recursively();
    },

    _entity_created: function() {
        l('TODO : CREATE THE ENTITY!!');
    },

    _create_new_entity_button_pressed: function() {
        this.wall_create_new_entity.display_self_and_all_child_attachments_recursively();
        this.base_wall.refresh_position_and_look_at();
    }


};