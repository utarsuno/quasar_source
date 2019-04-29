'use strict';

$_QE.prototype.FloatingRows = function() {};

Object.assign(
    $_QE.prototype.FloatingRows.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.LinkedListRows.prototype,
    {
        __init__floating_rows: function(flag_to_set_on) {
            this.__init__floating_element();
            if (flag_to_set_on != null) {
                this.flag_set_on(flag_to_set_on);
            }
            this.__init__ll_interactive($_QE.prototype.LLNodeRow);
        },

    }

);


