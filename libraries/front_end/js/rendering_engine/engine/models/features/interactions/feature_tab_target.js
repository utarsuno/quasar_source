'use strict';

$_QE.prototype.FeatureTabTarget = function() {

    // Next tab target.
    this.next_tab_target    = null;
    this.tab_parent         = null;

    this.set_next_tab_target = function(tab_target) {
        this.next_tab_target = tab_target;
    };

};