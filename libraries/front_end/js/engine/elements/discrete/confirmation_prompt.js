'use strict';

$_QE.prototype.ConfirmationPrompt = function(parent_button) {
    this.initialize_floating_element_data();
    this.initialize_wall_rows();

    this.set_foreground_color(QE.COLOR_GRAY_DARK, 0.85);

    //this.set_dimensions(512, 256);

    //this.set_dimensions(513, 24 * 4);
    this.set_dimensions(512, 40 * 2);

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

            this.add_title_bar(null, ASSET_ICON_WARNING, false, true, true);
            this.title_bar.icon.set_foreground_color(QE.COLOR_RED);

            // Testing area.
            this._test0 = this.add_text_row('Are you sure?', QE.COLOR_RGB_YELLOW, QE.FONT_ARIAL_20_BOLD, TEXT_ALIGNMENT_CENTER);

            this._buttons = this.add_buttons_row(QE.FONT_ARIAL_20_BOLD, [
                {text: 'No!' , color: QE.COLOR_RGB_GREEN_LIGHT, event: this._close_prompt.bind(this)},
                {text: 'Yes!', color: QE.COLOR_RGB_RED        , event: this.parent_button._yes_response}
            ]);
        },

        _create: function() {
            this.parent_button.add_attachment(this, true, true);
            this.set_offset_depth(25);
        },
    }
);
