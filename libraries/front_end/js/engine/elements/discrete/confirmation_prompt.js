'use strict';

$_QE.prototype.ConfirmationPrompt = function(parent_button) {
    this.initialize_floating_element_data();
    //this.set_colors(QE.COLOR_GREEN, QE.COLOR_RED);
    this.set_colors(QE.COLOR_RED, QE.COLOR_GREEN);
    this.set_dimensions(256, 128);
    this.initialize_wall_rows();

    l('Created ConfirmationPrompt!');
    this._event_function = this.get_response.bind(this);
    this.parent_button = parent_button;
};

Object.assign($_QE.prototype.ConfirmationPrompt.prototype,
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

            this.add_title_bar('TEST', ASSET_ICON_WARNING);
        },

        _create: function() {
            l('CREATED CONFIRMATION PROMPT!');
            this.parent_button.add_attachment(this, true, true);
            //this.add_to_world(this.parent_button.world, false, false, true);
        },
    }
);
