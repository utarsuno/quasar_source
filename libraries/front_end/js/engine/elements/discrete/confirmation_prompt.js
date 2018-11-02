'use strict';

$_QE.prototype.ConfirmationPrompt = function(parent_button) {
    this.initialize_floating_element_data();
    this.initialize_wall_rows();

    this.set_foreground_color(QE.COLOR_RED, 0.25);

    //this.set_dimensions(512, 256);

    this.set_dimensions(400, 200);

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

            //this._prompt = this.create_row(.95, false, 32);
            //this._prompt.create_text2d('Are you sure you want to delete?', COLOR_CANVAS_YELLOW, QE.FONT_ARIAL_24, 0);

            // Testing area.
            this._test0 = this.add_text_row('this.add_text_row(...);', QE.COLOR_RGB_YELLOW, QE.FONT_ARIAL_24);
            this._test1 = this.add_text_row('hello', QE.COLOR_RGB_YELLOW, QE.FONT_ARIAL_24);
            this._test2 = this.add_text_row('this text should go off the wall hello', QE.COLOR_RGB_YELLOW, QE.FONT_ARIAL_24);


            //this._buttons = this.create_row(.5, false, 64);
            //this._buttons.create_button('Yes!', COLOR_CANVAS_RED, 4, 5, this.parent_button._yes_response);
            //this._buttons.create_button('No!', COLOR_CANVAS_GREEN, 3, 5, this._close_prompt.bind(this));

            this._buttons = this.add_buttons_row(QE.FONT_ARIAL_24, [
                {text : 'No!' , color: QE.COLOR_RGB_GREEN_LIGHT, event: this._close_prompt.bind(this)},
                {text : 'Yes!', color: QE.COLOR_RGB_RED        , event: this.parent_button._yes_response}
            ]);
        },

        _create: function() {
            this.parent_button.add_attachment(this, true, true);
            this.set_offset_depth(25);
        },
    }
);
