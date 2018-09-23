'use strict';

$_QE.prototype.FeatureSingleton = function() {

    this.is_singleton = true;

    this.world = null;

    $_QE.prototype.FeatureRecycle.call(this);

    this._in_world = false;

    this.world_leave = function() {
        if (this._in_world) {
            this.world.remove_from_scene(this.object3D);

            if (this._in_world_elements_interactive != null) {
                if (this._in_world_elements_interactive) {
                    this.world.remove_from_elements_interactive(this);
                }
            }

            if (this._in_world_elements_root != null) {
                if (this._in_world_elements_root) {
                    this.world.remove_from_elements_root(this);
                }
            }

            this._in_world = false;
            if (this.on_world_leave != null) {
                this.on_world_leave();
            }
        }
    };

    this.world_enter = function(world) {
        if (!this._in_world) {
            this._world_enter(world);
        } else {
            this.world_leave();
            this._world_enter(world);
        }
    };

    this._world_enter = function(world) {
        this.world = world;
        this.world.add_to_scene(this.object3D);

        if (this._in_world_elements_interactive != null) {
            if (!this._in_world_elements_interactive) {
                this.world.add_element_interactive(this);
            }
        }

        if (this._in_world_elements_root != null) {
            if (this._in_world_elements_root) {
                this.world.add_element_root(this);
            }
        }

        this._in_world = true;
    };

};