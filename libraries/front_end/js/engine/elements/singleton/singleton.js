'use strict';

$_QE.prototype.Singleton = function(object, engine) {
    this._create_singleton(object, engine);
};

Object.assign(
    $_QE.prototype.Singleton.prototype,
    {
        set_alias: function(alias) {
            this._alias = alias;
        },

        _create_singleton: function(object, engine) {
            this.set_object(object);
            this._excludes = null;
            this._includes = null;

            this._alias    = null;

            if (engine != null) {
                this.engine = engine;
            } else {
                this.engine = QE;
            }

            this.engine.manager_world.singleton_add(this);
        },

        set_object: function(object) {
            this._object     = object;
            this._is_element = this._object.flags_are_on_and_off != null;
        },

        world_exclude: function(world) {
            if (this._excludes == null) {
                this._excludes = [];
            }
            this._excludes.push(world);
        },

        world_include: function(world) {
            if (this._includes == null) {
                this._includes = [];
            }
            this._includes.push(world);
        },

        world_leave: function(world) {
            if (this._is_element) {
                world.remove_element(this._object);
            } else {
                world.scene.remove(this._object);
            }
        },

        _world_enter: function(world) {
            if (this._is_element) {
                if (this._object.flag_is_off(EFLAG_IS_IN_WORLD)) {
                    world.add_element(this._object);
                }
            } else {
                world.scene.add(this._object);
            }
        },

        world_enter: function(world) {
            if (this._includes == null && this._excludes == null) {
                this._world_enter(world);
            } else if (this._excludes == null) {
                let w;
                for (w = 0; w < this._includes.length; w++) {
                    if (this._includes[w] == world) {
                        this._world_enter(world);
                        break;
                    }
                }
            } else if (this._includes == null) {
                let w;
                for (w = 0; w < this._excludes.length; w++) {
                    if (this._excludes[w] == world) {
                        return;
                    }
                }
                this._world_enter(world);
            } else {
                l('TODO: Cover this case!');
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
