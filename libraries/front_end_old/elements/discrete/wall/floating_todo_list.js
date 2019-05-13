// TEMPROARY LOCATION.
$_QE.prototype.perform_global_save = function() {
    let roots = QE.manager_world.current_world.elements_root;
    let r;
    for (r = 0; r < roots.length; r++) {
        let e = roots[r];
        if (e._global_id != null) {
            /*
            let data = e.get_save_data();
            QE.manager_web_sockets.send_request({
                _WEB_SOCKET_KEY_TYPE: _WEB_SOCKET_TYPE_DATA_UPDATE,
                _WEB_SOCKET_KEY_DATA: data
            });
            */
        }
    }
};

$_QE.prototype.FloatingTodoList = function(args) {
    if (QE._global_table_id == null) {
        QE._global_table_id = 0;
    }

    this._global_id = 'tID' + QE._global_table_id.toString();

    this._todo_rows = {};
    this._num_todo_rows = 0;
    this.__init__floating_todo_list(args);
};

Object.assign(
    $_QE.prototype.FloatingTodoList.prototype,
    $_QE.prototype.WallFloating.prototype,
    {
        constructor: $_QE.prototype.FloatingTodoList,

        get_save_data: function() {
            //let button = this._todo_rows[row_id].get_element_by_position(-2);

            let rows_data = {};
            let r;
            for (r in this._todo_rows) {
                if (this._todo_rows.hasOwnProperty(r)) {
                    let text = '';
                    text += this._todo_rows[r].get_element_by_position(-8).text + ';';
                    text += this._todo_rows[r].get_element_by_position(-7).text + ';';
                    text += this._todo_rows[r].get_element_by_position(-6).text + ';';
                    text += this._todo_rows[r].get_element_by_position(-5).text + ';';
                    text += this._todo_rows[r].get_element_by_position(-4).text + ';';
                    text += this._todo_rows[r].get_element_by_position(-3).text;
                    rows_data[r] = text;
                }
            }

            let save_data = {
                'tID' : this._global_id,
                'p'   : this.get_world_position().toArray().toString().split(',').join(';'),
                'n'   : this.get_normal().toArray().toString().split(',').join(';'),
                'rows': rows_data
            };

            return save_data;
        },

        __init__floating_todo_list: function(args) {
            this.text = args[ARG_TEXT];

            this.__init__floating_rows();

            this.set_dimensions(2048 + 1024, 1024 + 512);

            this.flag_set_on(EFLAG_IS_MOUSE_MOVABLE);
            this.flag_set_on(EFLAG_IS_MOUSE_SCALABLE);

            this.set_foreground_color(QE.COLOR_GRAY_DARK, 0.70);

            $_QE.prototype.FeatureOnlyMoveable.call(this);

            this._parse_arguments_on_constructor_end_floating_element(args);

            /*
            QE.manager_web_sockets.send_message({
                _WEB_SOCKET_KEY_TYPE: _WEB_SOCKET_TYPE_DATA_UPDATE,
                _WEB_SOCKET_KEY_DATA: 'SDFADSFDSF
            });
            */

            return this;
        },

        create: function() {
            this.create_wall_mesh(FEATURE_MATERIAL_COLOR_TRANSPARENT);

            this.add_title_bar(this.text, ASSET_ICON_CALENDAR, false, false, true);

            //this._default_row = this.create_row_interactive(0.5);


            //let headers = this.create_row(this, 64, 1.0);

            this.headers = new $_QE.prototype.FeatureRow();
            this.headers.create_row(this, 40, 1 - (30 / (1024 - 128)), false);

            this._add_column_header(-8,  256, 'TaskID');
            this._add_column_header(-7, 1024, 'Description');
            this._add_column_header(-6,  256, 'Time');
            this._add_column_header(-5,  256, 'Difficulty');
            this._add_column_header(-4,  256, 'Importance');
            this._add_column_header(-3,  256, 'Completed %');
            this._add_column_header(-2,  256, 'A C T I O N');

            this._add_new_todo_row();
        },

        _add_column_header: function(index, width, text) {
            this.headers.create_text2d(index, 1, {
                ARG_INTERACTIVE     : false,
                ARG_WIDTH           : width,
                ARG_FONT            : QE.FONT_ARIAL_20_BOLD,
                ARG_TEXT            : text,
                ARG_COLOR_FOREGROUND: QE.COLOR_RGB_YELLOW,
                ARG_ALIGNMENT_TEXT  : TEXT_ALIGNMENT_CENTER
            });
        },

        _add_new_todo_row: function() {
            let row_id = 'rID' + this._num_todo_rows.toString();

            let r = this._create_row(false, null, 40);
            this._add_row_cell(r, -8,  256, '?');
            this._add_row_cell(r, -7, 1024, '?');
            this._add_row_cell(r, -6,  256, '?');
            this._add_row_cell(r, -5,  256, '?');
            this._add_row_cell(r, -4,  256, '?');
            this._add_row_cell(r, -3,  256, '?');
            this._add_row_cell(r, -2,  256, null, row_id);

            this._todo_rows[row_id] = r;
            this._num_todo_rows += 1;
        },

        _add_row_cell: function(row, index, width, text, row_id) {
            if (text == null) {
                row.create_button(index, 1, {
                    ARG_INTERACTIVE     : true,
                    ARG_WIDTH           : width,
                    ARG_FONT            : QE.FONT_ARIAL_20_BOLD,
                    ARG_TEXT            : 'Create',
                    ARG_COLOR_FOREGROUND: QE.COLOR_RGB_GREEN,
                    ARG_COLOR_BACKGROUND: QE.COLOR_RGB_WHITE,
                    ARG_ALIGNMENT_TEXT  : TEXT_ALIGNMENT_CENTER,
                    ARG_EVENT_ACTION    : this._todo_row_was_added.bind(this, row_id)
                });
            } else {
                row.create_text2d(index, 1, {
                    ARG_INTERACTIVE     : true,
                    ARG_WIDTH           : width,
                    ARG_FONT            : QE.FONT_ARIAL_20_BOLD,
                    ARG_TEXT            : text,
                    ARG_COLOR_FOREGROUND: QE.COLOR_RGB_WHITE,
                    ARG_ALIGNMENT_TEXT  : TEXT_ALIGNMENT_CENTER
                });
            }
        },

        _todo_row_was_added: function(row_id) {
            let button = this._todo_rows[row_id].get_element_by_position(-2);
            button.update_text('TODO!!');
            button.set_foreground_color(QE.COLOR_RGB_RED);

            this._add_new_todo_row();
        },
    }
);

