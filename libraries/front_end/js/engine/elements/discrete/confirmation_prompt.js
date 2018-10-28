'use strict';

$_QE.prototype.ConfirmationPrompt = function(parent_button) {
    this.initialize_floating_element_data();
    this.initialize_wall_rows();

    this.set_colors(QE.COLOR_RED, QE.COLOR_GREEN);


    //this.set_dimensions(256, 128);
    this.set_dimensions(512, 256);


    l('Created ConfirmationPrompt!');
    this._event_function = this.get_response.bind(this);
    this.parent_button   = parent_button;
};

Object.assign(
    $_QE.prototype.ConfirmationPrompt.prototype,
    $_QE.prototype.WallFloating.prototype,
    {

        get_response: function() {
            this.open();
        },

        open: function() {
            l('OPENED CONFIRMATION PROMPT!');
            if (!this.get_flag(EFLAG_CREATED)) {
                this._create();
            }
        },

        create: function() {
            l('Create called!');
            this.create_wall_mesh(FEATURE_MATERIAL_COLOR_FANCY);

            // use_close=true, use_settings=true, use_help=true)
            this.add_title_bar('TEST', ASSET_ICON_WARNING, false, false, true);


            this._row = this.create_row(.5, false, 64);

            //this._row.create_icon(ASSET_ICON_WRENCH, QE.COLOR_BLUE, -1);
            this._row.create_text2d('Yes!', QE.COLOR_BLUE, -1, 25);
            this._row.create_text2d('No!', QE.COLOR_RED, 1, 10);
            this._row.create_icon(ASSET_ICON_TELEPORT, QE.COLOR_BLACK, 2, 2);
            this._row.create_icon(ASSET_ICON_CROSS, QE.COLOR_BLUE, 3, 2);

            this._row2 = this.create_row(0, false, 64);
            this._row2.create_icon(ASSET_ICON_TERMINAL, QE.COLOR_WHITE, -1, 4);
            this._row2.create_icon(ASSET_ICON_TELEPORT, QE.COLOR_GREEN, 1, 5);
            this._row2.create_icon(ASSET_ICON_TELEPORT, QE.COLOR_BLUE, 1, 5);
            this._row2.create_icon(ASSET_ICON_TELEPORT, QE.COLOR_BLACK, 1, 5);
        },

        _create: function() {
            l('CREATED CONFIRMATION PROMPT!');
            this.parent_button.add_attachment(this, true, true);

            this.set_offset_depth(25);

            //this.add_to_world(this.parent_button.world, false, false, true);
        },
    }
);
