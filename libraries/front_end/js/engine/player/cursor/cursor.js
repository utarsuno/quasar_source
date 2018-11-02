'use strict';

const CURSOR_FLAG_ENGAGED = 0; // #pre-process_global_constant
const CURSOR_FLAG_MOVING  = 1; // #pre-process_global_constant
const CURSOR_FLAG_SCALING = 2; // #pre-process_global_constant
const CURSOR_FLAG_DEFAULT = 3; // #pre-process_global_constant

$_QE.prototype.PlayerCursor = function(player) {

    this.player = player;

    this._initialize_default_cursor();
    this._initialize_icon_cursor();

    this.in_mouse_action = function() {
        return this.get_flag(CURSOR_FLAG_SCALING) || this.get_flag(CURSOR_FLAG_MOVING);
    };

    this.finish_mouse_action = function() {
        l('TODO: FINISH MOUSE ACTION!');
    };

    this.set_xy_based_off_of = function(position) {
        let _object;
        if (this.attached_to.group != null) {
            _object = this.attached_to.group;
        } else {
            _object = this.attached_to.mesh;
        }

        this._dy = ((position.y - _object.position.y) / this.attached_to.height) + 0.5;
        // Optimize later.
        let lr = this.attached_to.get_left_right();
        let right_x = _object.position.x - (lr.x * (this.attached_to.width / 2));
        let right_z = _object.position.z - (lr.z * (this.attached_to.width / 2));
        let delta_right = Math.sqrt((right_x - position.x) * (right_x - position.x) + (right_z - position.z) * (right_z - position.z));
        this._dx = (delta_right / this.attached_to.width);
    };
};


Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.BooleanFlagsStatic.prototype,
    {
        flags                  : new Uint32Array(2),
        _previous_move_position: new THREE.Vector3(),
        attached_to            : null,
        _dx                    : null,
        _dy                    : null,

        update: function() {
            if (this.get_flag(CURSOR_FLAG_MOVING)) {
                QE.player.set_object_in_front_of(this.attached_to, this._player_offset);
            }
        },

        attach: function(object_to_attach_to, intersection_position) {
            this._set_to_cursor_icon();

            this.attached_to = object_to_attach_to;

            if (intersection_position != null) {
                this.set_xy_based_off_of(intersection_position);
            }

            //l('cursor attached!');
            //l(this._dx);
            //l(this._dy);

            this._set_needed_on_attach_icon();
        },

        detach: function() {
            this._set_to_cursor_default();
        },
    }
);