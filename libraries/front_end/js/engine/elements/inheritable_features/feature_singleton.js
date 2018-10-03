'use strict';

$_QE.prototype.FeatureSingleton = function(world_manager) {
    world_manager.singletons.push(this);
};