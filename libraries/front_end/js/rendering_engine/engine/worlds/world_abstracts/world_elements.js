'use strict';

$_QE.prototype.WorldElements = function() {

    this.currently_looked_at_object = null;

    this.look_away_from_currently_looked_at_object = function() {
        this.currently_looked_at_object.look_away();
        if (this.currently_looked_at_object.uses_cursor) {
            this.floating_cursor.detach();
        }
        this.currently_looked_at_object = null;
    };


};