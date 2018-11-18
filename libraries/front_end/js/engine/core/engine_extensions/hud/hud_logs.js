'use strict';

$_QE.prototype.HUDLogs = function() {};

Object.assign(
    $_QE.prototype.HUDLogs.prototype,
    $_QE.prototype.HUDTextLines.prototype,
    {
        __init__: function(number_of_rows) {
            this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT);

            this.initialize_hud_element(number_of_rows, 1200, QE.FONT_ARIAL_12, GLOBAL_ID_HUD_CHAT);

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
