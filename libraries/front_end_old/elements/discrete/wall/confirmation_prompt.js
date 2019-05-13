$_QE.prototype.ConfirmationPrompt = function(parent_button, no_response, yes_response) {
    this.__init__floating_rows();

    this._no_response  = no_response;
    this._yes_response = yes_response;

    this.set_foreground_color(QE.COLOR_GRAY_DARK, 0.80);
    this.set_dimensions(512, 80);

    //this._event_function = this.open.bind(this);
    this.parent_button   = parent_button;
};

Object.assign(
    $_QE.prototype.ConfirmationPrompt.prototype,
    $_QE.prototype.WallFloating.prototype,
    {
        _close_prompt: function(response) {
            this.set_to_invisible();
            if (response) {
                this._yes_response();
            } else {
                this._no_response();
            }
        },

        open: function() {
            if (this.flag_is_off(EFLAG_IS_CREATED)) {
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
            this._test0 = this.add_text_row({
                ARG_TEXT            : 'Are you sure?',
                ARG_COLOR_FOREGROUND: QE.COLOR_RGB_YELLOW,
                ARG_FONT            : QE.FONT_ARIAL_20_BOLD,
                ARG_ALIGNMENT_TEXT  : TEXT_ALIGNMENT_CENTER
            });

            this._buttons = this.add_buttons_row(QE.FONT_ARIAL_20_BOLD, [
                {text: 'No!' , color: QE.COLOR_RGB_GREEN_LIGHT, event: this._close_prompt.bind(this, false)},
                {text: 'Yes!', color: QE.COLOR_RGB_RED        , event: this._close_prompt.bind(this, true)}
            ]);
        },

        _create: function() {
            this.parent_button.add_attachment(this, true, true);
            this.set_offset_depth(50);
        },
    }
);
