'use strict';

$_QE.prototype.HUDLogs = function() {};

Object.assign(
    $_QE.prototype.HUDLogs.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        __init__: function(number_of_rows) {
            this._initialize_renderer_text_reference_canvas(number_of_rows, 1200, QE.FONT_ARIAL_12, GLOBAL_ID_HUD_CHAT);

            // Temp.
            this.rows[0].set_text('Nexus Local!');

            return this;
        },

        add_message: function(message) {
            this.shift_rows_up();
            this.set_bottom_row(message);
        },
    }

);
