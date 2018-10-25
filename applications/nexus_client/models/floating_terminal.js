'use strict';

$_NL.prototype.FloatingTerminal = function(number_of_rows, font, title) {

    this.__init__(1024, number_of_rows, font);

    this.create = function() {
        this.initialize_gui();

        // Needed?
        this.hide();
        //

        this.create_wall_mesh(FEATURE_MATERIAL_CANVAS_FANCY);

        //this.set_max_rows(number_of_rows);
        //this.set_bottom_row_as_input(this._on_enter_event.bind(this));
        //$_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, true, this._on_enter_event.bind(this));

        this.add_title_bar(title, ASSET_ICON_TERMINAL);

        this._default_row = new $_QE.prototype.FeatureRow();
        this._default_row.create_row(this, this.height, 0.5, true);

        // Temp.
        this.rows[0].set_text('Nexus Local!');

        let self = this;
        this.set_value_post_changed_event(function(t) {
            self.rows[0].set_text(t);
        });
    };
};

Object.assign(
    $_NL.prototype.FloatingTerminal.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.FeatureText.prototype,
    {
        constructor: $_NL.prototype.FloatingTerminal,

        add_message: function(message) {
            this.shift_rows_up();
            this.set_bottom_row(message);
        },

        _on_enter_event: function() {
            //if (this.get_text_length_without_whitespaces() != 0) {
            this.shift_rows_up();
            this.clear();
            //this.add_text_line_to_bottom(this.get_text_and_clear(), COLOR_CANVAS_TEAL);
            //}
        },

        __init__: function(width, number_of_rows, font) {
            this.text = '';

            this.initialize_floating_element_data();
            this.initialize_wall_rows();

            this.set_colors(QE.COLOR_GREEN, COLOR_CANVAS_GRAY);

            this.set_properties(number_of_rows, 1024, font, 'floating_terminal', true);
            this.initialize_gui(null, null, true);

            $_QE.prototype.FeatureTyping.call(this, this._on_enter_event.bind(this));
            this.set_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK, true);
            return this;
        },
    }
);

