'use strict';

$_NL.prototype.FloatingTerminal = function(is_base, number_of_rows, font, title) {

    this.set_colors(QE.COLOR_GREEN, COLOR_CANVAS_GRAY);

    $_QE.prototype.CanvasGUI2D.call(this, 'floating_terminal', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    //$_QE.prototype.FeatureTextLines.call(this, number_of_rows, true);

    $_QE.prototype.WallFloating.call(this, is_base, 1024, number_of_rows * font[1]);

    $_QE.prototype.FeatureInteractive.call(this, null, null, null, null, true);


    //$_QE.prototype.FeatureTabTarget.call(this);
    //$_QE.prototype.FeatureMouseMove.call(this);

    this._on_enter_event = function() {
        if (this.get_text_length_without_whitespaces() != 0) {
            this.add_text_line_to_bottom(this.get_text_and_clear(), COLOR_CANVAS_TEAL);
        }
    };

    this.create = function() {
        this.initialize_gui(this.width, this.height, null, null, null, true, false, font);

        this.create_wall_mesh();

        //
        this.set_flag(EFLAG_CREATED, true);
        //

        $_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, true, this._on_enter_event.bind(this));

        this.add_title_bar(title, ASSET_ICON_TERMINAL);
        this.check_if_in_interactive();

        //
        this._default_row = new $_QE.prototype.FeatureRow(this, this.height, 0.5, true);
    };
};

Object.assign(
    $_NL.prototype.FloatingTerminal.prototype,
    $_QE.prototype.FeatureColor.prototype
);