'use strict';

function HomeWorld(static_world_entity) {
    this.__init__(static_world_entity);
}

HomeWorld.prototype = {

    __init__: function(static_world_entity) {
        // Inherit.
        World.call(this, static_world_entity);
        WorldInput.call(this);
        WorldState.call(this, new THREE.Vector3(0, 100, 0));
        WorldDynamicContent.call(this);
    },

    create: function() {
    }
};

