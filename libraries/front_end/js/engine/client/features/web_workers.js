'use strict';

$_QE.prototype.ClientFeatureWebWorkers = function() {
    $_QE.prototype.ClientFeature.call(this, CLIENT_FEATURE_WEB_WORKERS, 'Web Workers', false, !!window.Worker);
};