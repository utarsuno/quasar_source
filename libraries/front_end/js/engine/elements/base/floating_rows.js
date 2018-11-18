'use strict';

$_QE.prototype.FloatingRows = function() {};

Object.assign(
    $_QE.prototype.FloatingRows.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.LinkedListRows.prototype,
    {
        initialize_wall_rows: function() {
            this.initialize_interactive_linked_list($_QE.prototype.LinkedListNodeRow);
        },

        initialize_wall_rows_animated: function() {
            this.initialize_interactive_linked_list($_QE.prototype.LinkedListNodeRowAnimated);
        },

    }

);


