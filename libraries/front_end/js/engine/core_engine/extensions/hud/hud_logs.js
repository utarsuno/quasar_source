'use strict';

$_QE.prototype.HUDLogs = function() {};

Object.assign(
    $_QE.prototype.HUDLogs.prototype,
    $_QE.prototype.HUDTextLines.prototype,
    {
        __init__: function(number_of_rows) {
            this.__init__hud_element({
                ARG_NUMBER_OF_ROWS  : number_of_rows,
                ARG_WIDTH           : 1200,
                ARG_DOM_ELEMENT_ID  : GLOBAL_ID_HUD_CHAT,
                ARG_COLOR_FOREGROUND: QE.COLOR_RGB_GREEN_LIGHT
            });

            this.set_bottom_row('Nexus Local {v0.6617}, TODO: Fetch version dynamically!');

            return this;
        },

    }

);
