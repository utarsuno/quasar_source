'use strict';

$_QE.prototype.FloatingRows = function() {};

Object.assign(
    $_QE.prototype.FloatingRows.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.LinkedListRows.prototype,
    {
        __init__floating_rows: function() {
            this.__init__floating_element();
            this.__init__ll_interactive($_QE.prototype.LLNodeRow);
        },

    }

);


