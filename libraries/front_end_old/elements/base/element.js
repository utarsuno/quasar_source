$_QE.prototype.Element = function() {};

Object.assign(
    $_QE.prototype.Element.prototype,
    {
        initialize_element_data: function() {
            this.initialize_events_and_flags();
        },

        get_object: function() {
            if (this.group != null) {
                return this.group;
            }
            return this.mesh;
        },

        _update_element_animation: function(delta) {
            if (this.flag_is_on(EFLAG_IS_IN_ANIMATION)) {
                if (this.flag_is_on(EFLAG_IS_IN_REVERSED_ANIMATION)) {
                    this.animation_step_reverse(delta);
                } else {
                    this.animation_step_forward(delta);
                }
            }
        },

        _arg_is_on: function(args, key) {
            return args[key] != null && args[key];
        },

        _args_both_not_null: function(args, key0, key1) {
            return args[key0] != null && args[key1] != null;
        },

        _arg_is_off: function(args, key) {
            return args[key] != null && !args[key];
        },
    }
);

/*
    this.is_enabled = function() {
        return this.flags_are_on_and_off(EFLAG_IS_STATE_ENABLED, EFLAG_IS_STATE_LOCKED);
    };

    this.lock = function() {
        if (this.flag_is_off(EFLAG_IS_STATE_LOCKED)) {
            this.flag_set_on(EFLAG_IS_STATE_LOCKED);
            this.trigger_event(ELEMENT_EVENT_ON_LOCKED);
        }
    };

    this.unlock = function() {
        if (this.flag_is_on(EFLAG_IS_STATE_LOCKED)) {
            this.flag_set_off(EFLAG_IS_STATE_LOCKED);
            this.trigger_event(ELEMENT_EVENT_ON_UN_LOCKED);
        }
    };

    this.enable = function() {
        if (this.flag_is_off(EFLAG_IS_ENABLED)) {
            this.flag_set_on(EFLAG_IS_ENABLED);
            this.trigger_event(ELEMENT_EVENT_ON_ENABLE);
        }
    };

    this.disable = function() {
        if (this.flag_is_on(EFLAG_IS_ENABLED)) {
            this.flag_set_off(EFLAG_IS_ENABLED);
            this.trigger_event(ELEMENT_EVENT_ON_DISABLE);
        }
    };
 */


