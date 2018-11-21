'use strict';

$_QE.prototype.FloatingRows = function() {};

Object.assign(
    $_QE.prototype.FloatingRows.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.LinkedListRows.prototype,
    {
        initialize_self_with_rows: function() {
            this.initialize_floating_element_data();
            this.initialize_interactive_linked_list($_QE.prototype.LLNodeRow);
        },

    }

);


