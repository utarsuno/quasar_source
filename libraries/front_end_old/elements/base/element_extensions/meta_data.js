$_QE.prototype._ElementEvent = function() {
    this.events          = {};
    this.max_event_depth = 1;
    this.revive();
};
$_QE.prototype._ElementEvent.prototype = {

    _update_max_event_depth: function(order) {
        if (order + 2 > this.max_event_depth) {
            this.max_event_depth = order + 2;
        }
    },

    _add_event: function(event_function, event_order='-1') {
        this._update_max_event_depth(Number(event_order));

        // Add new key to 'events' if needed.
        if (!(event_order in this.events)) {
            this.events[event_order] = [];
        }

        // Add the actual event function.
        this.events[event_order].push(event_function);
    },

    revive: function() {
        this.alive = true;
    },

    kill: function() {
        let e;
        for (e in this.events) {
            if (this.events.hasOwnProperty(e)) {
                let f;
                for (f = 0; f < this.events[e].length; f++) {
                    this.events[e][f] = undefined;
                }
                this.events[e] = undefined;
            }
        }
        this.alive           = false;
        this.events          = {};
        this.max_event_depth = 1;
    },

    _trigger_layer: function(layer, data) {
        if (layer in this.events) {
            let f;
            for (f = 0; f < this.events[layer].length; f++) {
                this.events[layer][f](data);
            }
        } else {
            QE.warning('The layer {' + layer + '} was not found in events!');
        }
    },

    trigger: function(data) {
        if (this.max_event_depth > 1) {
            let layer;
            for (layer = 0; layer < this.max_event_depth - 1; layer++) {
                this._trigger_layer(layer.toString(), data);
            }
        }
        this._trigger_layer('-1', data);
    },
};

Object.assign(
    $_QE.prototype.Element.prototype,
    $_QE.prototype.BitwiseFlagsMax60.prototype,
    {
        initialize_events_and_flags: function() {
            this._events = {};
            this.flags   = new Uint32Array(2);
            this.flag_set_on(EFLAG_IS_VISIBLE);
        },

        // ------------------------------------------------------------------------

        clear_event: function(key) {
            if (key in this._events) {
                this._events[key].kill();
            }
        },

        set_event: function(key, event_function, event_order='-1') {
            if (!this._has_event(key)) {
                this._create_event(key);
            }
            this._events[key]._add_event(event_function, event_order);
        },

        trigger_event: function(key, data=null) {
            if (this._has_event(key)) {
                this._events[key].trigger(data);
            }
        },

        // ------------------------------------------------------------------------

        _has_event: function(key) {
            if (key in this._events) {
                return this._events[key].alive;
            }
            return false;
        },

        _create_event: function(key) {
            if (key in this._events) {
                if (!this._events[key].alive) {
                    this._events[key].revive();
                }
            } else {
                this._events[key] = new $_QE.prototype._ElementEvent();
            }
        },
    }
);

