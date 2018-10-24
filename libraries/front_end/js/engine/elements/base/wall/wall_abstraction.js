'use strict';

$_QE.prototype.WallAbstraction = function() {};

Object.assign(
    $_QE.prototype.WallAbstraction.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.DoublyLinkedListRows.prototype,
    {
        initialize_wall_rows: function() {
            this.initialize_interactive_linked_list();
        },
    }
);

