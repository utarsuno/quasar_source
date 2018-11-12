'use strict';

$_NL.prototype.FloatingTerminal = function(number_of_rows, font, title) {

    this.__init__(1024, number_of_rows, font);

    this.create = function() {
        this.create_wall_mesh(FEATURE_MATERIAL_CANVAS_FANCY);

        this.add_title_bar(title, ASSET_ICON_TERMINAL);

        this._default_row = this.create_row_interactive(0.5);

        // Temp.
        this.rows[1].set_text('Nexus Local!');

        let self = this;
        this.set_value_post_changed_event(function(t) {
            self.rows[0].set_text(t);
        });

        // TODO: Temporary solution.
        this.mesh.renderOrder = 1;
    };
};

Object.assign(
    $_NL.prototype.FloatingTerminal.prototype,
    $_QE.prototype.DomCanvasInternalTexture.prototype,
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

            this.set_flag(EFLAG_MOUSE_MOVEABLE, true);
            this.set_flag(EFLAG_MOUSE_SCALEABLE, true);

            this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT, 0.85);
            //this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT, 0.5);
            this.set_background_color(COLOR_CANVAS_GRAY);

            this.initialize_dom_canvas(number_of_rows, width, font);

            $_QE.prototype.FeatureTyping.call(this, this._on_enter_event.bind(this));
            this.set_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK, true);
            // TODO: ensure input not receiving unless engaged!


            return this;
        },
    }
);

