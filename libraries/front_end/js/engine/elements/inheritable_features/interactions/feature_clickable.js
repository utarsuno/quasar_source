'use strict';

$_QE.prototype.FeatureClickable = function(engable) {

    this.feature_engable = engable;
    // TODO: Refactor (conflict with other feature types)
    this.feature_maintain_engage_when_tabbed_to = false;
    this.feature_clickable = true;

};
