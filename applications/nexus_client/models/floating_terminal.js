'use strict';

$_NL.prototype.FloatingTerminal = function(number_of_rows, font, title) {

    this.__init__(1024, number_of_rows * font.height);

    this.create = function() {
        //this.create_as_canvas('floating_terminal');
        this.set_font(QE.FONT_ARIAL_16);
        this.initialize_gui();
        // Needed?
        this.hide();

        this.create_wall_mesh();

        //
        //this.set_flag(EFLAG_CREATED, true);
        //
        //this.set_max_rows(number_of_rows);
        //this.set_bottom_row_as_input(this._on_enter_event.bind(this));
        //$_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, true, this._on_enter_event.bind(this));

        this.add_title_bar(title, ASSET_ICON_TERMINAL);
        this.check_if_in_interactive();

        //
        this._default_row = new $_QE.prototype.FeatureRow(this, this.height, 0.5, true);
    };
};

Object.assign(
    $_NL.prototype.FloatingTerminal.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    {
        constructor: $_NL.prototype.FloatingTerminal,

        _on_enter_event: function() {
            if (this.get_text_length_without_whitespaces() != 0) {
                //this.add_text_line_to_bottom(this.get_text_and_clear(), COLOR_CANVAS_TEAL);
            }
        },

        __init__: function(width, height) {
            this.set_colors(QE.COLOR_GREEN, COLOR_CANVAS_GRAY);

            this.create_as_canvas('floating_terminal');
            this.set_dimensions(width, height);

            $_QE.prototype.FeatureInteractive.call(this, true);
            return this;
        },
    }
);

