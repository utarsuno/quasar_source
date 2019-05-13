$_QE.prototype.LLNodeRowElement = function(object) {
    this._object = object;
};

Object.assign(
    $_QE.prototype.LLNodeRowElement.prototype,
    $_QE.prototype.LLNodeInteractive.prototype,
    {
        update_horizontal_position: function() {
            if (this._object.flag_is_on(EFLAG_IS_FORMAT_X_END)) {
                if (this._node_next != null) {
                    this._object.set_offset_horizontal(1, -0.5, this._node_next._get_x_additional_offset() - this._node_next._get_width());
                } else {
                    this._object.set_offset_horizontal(1, -0.5);
                }
            } else if (this._object.flag_is_on(EFLAG_IS_FORMAT_X_START)) {
                if (this._node_prev != null) {
                    this._object.set_offset_horizontal(0, 0.5, this._node_prev._get_x_additional_offset() + this._node_prev._get_width());
                } else {
                    this._object.set_offset_horizontal(0, 0.5);
                }
            } else {
                this._object.set_offset_horizontal(0.5, -.5);
            }
        },

        _get_width: function() {
            return this._object.width;
        },

        _get_x_additional_offset: function() {
            return this._object.position_offsets[2];
        },

        is_interactive: function() {
            return this._object.flag_is_on(EFLAG_IS_INTERACTIVE);
        },

        update_node: function() {
            this._object.trigger_event(ELEMENT_EVENT_ON_NODE_UPDATE, this);
        },

        increment_and_update: function() {
            this.increment();
            this.update_node();
        },

        decrement_and_update: function() {
            this.decrement();
            this.update_node();
        },

        // Animations.

        _get_relative_y: function() {
            return this._object.get_object().position.y;
        },

        _get_relative_z: function() {
            return this._object.get_object().position.z;
        },

        _set_opacity: function(o) {
            this._object.set_opacity(o);
        },

        _set_relative_y_z: function(time) {
            this._object.get_object().position.y = THREE.Math.lerp(this._animation_y_start, this._animation_y_end, time);
            this._object.get_object().position.z = THREE.Math.lerp(this._animation_z_start, this._animation_z_end, time);
            this._object.refresh();
        },

        _set_relative_y: function(time) {
            this._object.get_object().position.y = THREE.Math.lerp(this._animation_y_start, this._animation_y_end, time);
            //this._object.get_object().position.y = y;
            // TEMPORARY.
            this._object.refresh();
        },

        _set_relative_z: function(time) {
            this._object.get_object().position.z = THREE.Math.lerp(this._animation_z_start, this._animation_z_end, time);
            //this._object.get_object().position.y = y;
            // TEMPORARY.
            this._object.refresh();
        },
    }
);

/*
// Animations.

        _reset_relative_y: function() {
            this._object.get_object().position.y = this._animation_y_end;
            this._object.refresh();
        },

 */