const CURSOR_STATE_DEFAULT   = 1;  // #pre-process_global_constant
const CURSOR_STATE_CLICK     = 2;  // #pre-process_global_constant
const CURSOR_STATE_SCALE     = 4;  // #pre-process_global_constant
const CURSOR_STATE_MOVE      = 8;  // #pre-process_global_constant
const CURSOR_STATE_WRITE     = 16; // #pre-process_global_constant


$_QE.prototype.PlayerCursor = function(engine) {
    this.engine = engine;
    this.player = this.engine.player;

    this.set_dimensions(32, 32);
    this.__init__external_canvas(GLOBAL_ID_CURSOR_ICON);
    this._image_icons = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET).image;

    this.__init__player_cursor();
    this.set_state(CURSOR_STATE_DEFAULT);
};


Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.BitwiseFlagsMax31.prototype,
    $_QE.prototype.DomCanvas.prototype,
    $_QE.prototype.CanvasRenderer.prototype,
    $_QE.prototype.FiniteStateMachine.prototype,
    {
        flags                  : new Uint32Array(1),
        _previous_move_position: new THREE.Vector3(),
        position               : new THREE.Vector2(),
        attached_to            : null,
        _player_offset         : 1800,
        _current_icon          : null,

        _add_player_state: function(_id, exit, enter, render) {
            let _exit;
            let _enter;
            if (exit !== null) {
                _exit = function() {
                    this.flag_set_off(_id);
                    exit();
                }.bind(this);
            } else {
                _exit = function() {
                    this.flag_set_off(_id);
                }.bind(this);
            }
            if (enter !== null) {
                _enter = function() {
                    this.flag_set_on(_id);
                    enter();
                    this.state_current.render();
                }.bind(this);
            } else {
                _enter = function() {
                    this.flag_set_on(_id);
                    this.state_current.render();
                }.bind(this);
            }
            let state = this.add_state(_id, _exit, _enter);
            state.render = render.bind(this);
            return state;
        },

        __init__player_cursor: function() {
            this.__init__state_machine();

            this._add_player_state(CURSOR_STATE_DEFAULT,
                null,
                function() {
                    this.attached_to   = null;
                    this._current_icon = null;
                }.bind(this),
                function() {
                    this._canvas_set_color('#9cfaff');
                    this._context.fillRect(14, 14, 4, 4);
                    this.dom_element_reset_transformation_if_needed();
                }.bind(this)
            );
            this._add_player_state(CURSOR_STATE_WRITE,
                null,
                function() {
                    this._current_icon = ASSET_ICON_WRITTING;
                }.bind(this),
                function() {
                    this._render_icon();
                    this.dom_element_set_offset_xy(16, -16);
                }.bind(this)
            );
            this._add_player_state(CURSOR_STATE_CLICK,
                null,
                function() {
                    this._current_icon = ASSET_ICON_CLICK;
                }.bind(this),
                function() {
                    this._render_icon();
                    this.dom_element_set_offset_y(16);
                }.bind(this)
            );
            this._add_player_state(CURSOR_STATE_MOVE,
                function() {
                    this.engine.flag_set_off(QEFLAG_STATE_MOUSE_Y_DISABLED);
                }.bind(this),
                function() {
                    this._current_icon = ASSET_ICON_DRAG;
                    this.player.set_in_front_of_object(this.attached_to, this._player_offset);
                    this.engine.flag_set_on(QEFLAG_STATE_MOUSE_Y_DISABLED);
                }.bind(this),
                function() {
                    this._render_icon();
                    this.dom_element_reset_transformation_if_needed();
                }.bind(this)
            );
            this._add_player_state(CURSOR_STATE_SCALE,
                null,
                function() {
                    this.set_current_icon(ASSET_ICON_EXPAND);
                }.bind(this),
                function() {
                    this._render_icon();
                    this.dom_element_reset_transformation_if_needed();
                }.bind(this)
            );
        },

        finish_action: function() {
            this._set_needed_state();
        },

        update: function() {
            if (this.is_current_state(CURSOR_STATE_MOVE)) {
                this.player.set_object_in_front_of(this.attached_to, this._player_offset);
            }
        },

        attach: function(object_to_attach_to, intersection_position) {
            this.attached_to = object_to_attach_to;
            if (intersection_position !== null) {
                this._calculate_dx_dy(intersection_position);
            }
            this._set_needed_state();
        },

        _render_icon: function() {
            this._canvas_set_color('#f4f4f4');
            this.set_canvas_render_style(CANVAS_RENDERING_STYLE_DEFAULT);
            this._fill_canvas();
            this.set_canvas_render_style(CANVAS_RENDERING_STYLE_OVERLAP);
            this._context.drawImage(this._image_icons, this._current_icon * 64, 0, 64, 64, 0, 0, this.width, this.height);
        },

        render: function() {
            this._clear_canvas();
            this.state_current.render();
        },

        _set_needed_state: function() {
            if (this.attached_to === null) {
                this.set_state(CURSOR_STATE_DEFAULT);
            } else if (this.attached_to.flag_is_on(EFLAG_IS_CLICKABLE) && this.attached_to.flag_is_off(EFLAG_IS_TYPEABLE)) {
                this.set_state(CURSOR_STATE_CLICK);
            } else if (this.attached_to.flag_is_on(EFLAG_IS_TYPEABLE)) {
                this.set_state(CURSOR_STATE_WRITE);
            } else if (this.attached_to.flags_are_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING, EFLAG_IS_MOUSE_MOVABLE)) {
                this.set_state(CURSOR_STATE_MOVE);
            } else if (this.attached_to.flag_is_on(EFLAG_IS_MOUSE_SCALABLE)) {
                //if (this.dx < .02 && this._dx > .98 && this._dy < .02 && this._dy > .98) {
                this.set_state(CURSOR_STATE_SCALE);
            } else {
                l('TODO: state!!!!');
            }
        },

        /*__   ___ ___ ___  ___  __   __
         /__` |__   |   |  |__  |__) /__`
         .__/ |___  |   |  |___ |  \ .__/*/
        set_current_icon: function(icon) {
            if (this._current_icon !== icon) {
                this._current_icon = icon;
                this.render();
            }
        },

        /*__   ___ ___ ___  ___  __   __
         / _` |__   |   |  |__  |__) /__`
         \__> |___  |   |  |___ |  \ .__/ */
        is_in_action: function() {
            return this.is_current_state(CURSOR_STATE_MOVE) || this.is_current_state(CURSOR_STATE_SCALE);
        },

        /*___       ___      ___  __
         |__  \  / |__  |\ |  |  /__`
         |___  \/  |___ | \|  |  .__/ */
        on_left_click_down: function() {
            if (this.attached_to.flags_are_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING, EFLAG_IS_MOUSE_MOVABLE)) {
                this.set_state(CURSOR_STATE_MOVE);
            }
        },

        on_wheel_event: function(delta) {
            if (delta === 1) {
                this._player_offset *= 1.030;
            } else {
                this._player_offset *= 0.970;
            }
        },

        /*__   __              ___  ___
         |__) |__) | \  /  /\   |  |__
         |    |  \ |  \/  /~~\  |  |___*/
        _calculate_dx_dy: function(position) {
            let _object;
            if (this.attached_to.group != null) {
                _object = this.attached_to.group;
            } else {
                _object = this.attached_to.mesh;
            }

            //this._dy = ((position.y - _object.position.y) / this.attached_to.height) + 0.5;
            // Optimize later.
            let lr = this.attached_to.get_left_right();
            let right_x = _object.position.x - (lr.x * (this.attached_to.width / 2));
            let right_z = _object.position.z - (lr.z * (this.attached_to.width / 2));
            let delta_right = Math.sqrt((right_x - position.x) * (right_x - position.x) + (right_z - position.z) * (right_z - position.z));
            //this._dx = (delta_right / this.attached_to.width);

            this.position.set(delta_right / this.attached_to.width, ((position.y - _object.position.y) / this.attached_to.height) + 0.5);
        },
    }
);



