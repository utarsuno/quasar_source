'use strict';

$_QE.prototype.FeatureSingleton = function(world_manager) {
    this.is_singleton = true;
    world_manager.singletons.push(this);
};