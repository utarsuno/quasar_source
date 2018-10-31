'use strict';

$_QE.prototype.ConfirmationPrompt = function(parent_button) {
    this.initialize_floating_element_data();
    this.initialize_wall_rows();

    this.set_colors(QE.COLOR_RED, QE.COLOR_RED);

    this.set_dimensions(512, 256);

    this._event_function = this.open.bind(this);
    this.parent_button   = parent_button;
};

Object.assign(
    $_QE.prototype.ConfirmationPrompt.prototype,
    $_QE.prototype.WallFloating.prototype,
    {
        _close_prompt: function() {
            this.set_to_invisible();
            this.parent_button._no_response();
        },

        open: function() {
            if (!this.get_flag(EFLAG_CREATED)) {
                this._create();
            } else {
                this.set_to_visible();
            }
        },

        create: function() {
            this.create_wall_mesh(FEATURE_MATERIAL_COLOR_TRANSPARENT);

            this.add_title_bar('TEST', ASSET_ICON_WARNING, false, true, true);

            this._prompt = this.create_row(.95, false, 32);
            this._prompt.create_text2d('Are you sure you want to delete?', QE.COLOR_RED, 0, 10);

            this._buttons = this.create_row(.5, false, 64);
            this._buttons.create_button('Yes!', COLOR_CANVAS_RED, 4, 5, this.parent_button._yes_response);
            this._buttons.create_button('No!', COLOR_CANVAS_GREEN, 3, 5, this._close_prompt.bind(this));
        },

        _create: function() {
            this.parent_button.add_attachment(this, true, true);
            this.set_offset_depth(25);
            this.set_opacity(.5);
        },
    }
);
