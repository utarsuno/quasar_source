'use strict';

$_QE.prototype.Singleton = function(object) {
    this._create_singleton(object);
};

Object.assign(
    $_QE.prototype.Singleton.prototype,
    {
        set_alias: function(alias) {
            this._alias = alias;
        },

        _create_singleton: function(object) {
            this.set_object(object);
            this._alias = null;
            this.engine = QE;
            this.engine.manager_world.singleton_add(this);
        },

        set_object: function(object) {
            this._object     = object;
            this._is_element = this._object.flags_are_on_and_off != null;
        },

        world_leave: function(world) {
            if (this._alias === SINGLETON_SKY_BOX_GRAY) {
                QE._shader_disable_background_gray();
            }
            if (this._is_element) {
                world.remove_element(this._object);
            } else {
                world.scene.remove(this._object);
            }
        },

        _world_enter: function(world) {
            if (this._alias === SINGLETON_SKY_BOX_GRAY) {
                QE._shader_enable_background_gray();
            }
            if (this._is_element) {
                if (this._object.flag_is_off(EFLAG_IS_IN_WORLD)) {
                    world.add_element(this._object);
                }
            } else {
                world.scene.add(this._object);
            }
        },

        world_enter: function(world) {
            let s;
            for (s = 0; s < world.needed_singletons.length; s++) {
                if (world.needed_singletons[s] === this._alias) {
                    this._world_enter(world);
                }
            }
        },

        on_add_to_singletons: function() {
            if (this._is_element) {
                this._object.flag_set_on(EFLAG_IS_SINGLETON);
                this._object.flag_set_on(EFLAG_IS_IN_ELEMENTS_SINGLETON);
            }
        },
    }
);
