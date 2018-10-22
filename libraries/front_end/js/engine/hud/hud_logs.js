'use strict';

$_QE.prototype.HUDLogs = function() {};

Object.assign(
    $_QE.prototype.HUDLogs.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        __init__: function(number_of_rows) {
            this.set_properties(number_of_rows, 600, QE.FONT_ARIAL_12, GLOBAL_ID_HUD_CHAT);
            this.initialize_gui(0, 10);

            // Temp.
            this.rows[0].set_text('Nexus Local!');

            return this;
        },

        add_message: function(message) {
            let r;
            for (r = this.rows.length - 2; r > -1; r--) {
                this.rows[r + 1].set_text(this.rows[r].text);
            }
            this.rows[0].set_text(message);
        },
    }

);
