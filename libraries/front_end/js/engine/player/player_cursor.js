'use strict';

$_QE.prototype.PlayerCursor = function(player) {
    this.player = player;

    // Default cursor with no action.
    this._cursor_default = new $_QE.prototype.DomElement().create_div_from_existing(GLOBAL_ID_CURSOR_DEFAULT);
    // Icon cursor.
    this.set_canvas_reference(GLOBAL_ID_CURSOR_ICON);

    this.set_colors(QE.COLOR_GREEN, FLOATING_TEXT_BACKGROUND_TRANSPARENT);
    this.set_dimensions(32, 32);
    this.initialize_gui();

    //
    // USED TO BE : $_QE.prototype.CanvasRenderingIcon.call(this);
    this._image_icons    = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET).image;
    this._icon_to_render = ASSET_ICON_ARROW;

    this.render = function() {
        if (this._icon_to_render !== this._current_icon) {
            this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);
            this.context.drawImage(this._image_icons, this._current_icon * 64, 0, 64, 64, 0, 0, this._canvas_width, this._canvas_height);
            this._icon_to_render = this._current_icon;
        }
    };
    //

    this.engage = function() {
        this._currently_engaged = true;
        this.hide();



        // Update player position.
        if (this._current_icon === ASSET_ICON_DRAG) {
            let p = this.currently_attached_to.get_position();
            let n = this.currently_attached_to.get_normal();

            this._previous_move_position.x = p.x + n.x * this._current_horizontal_distance;
            this._previous_move_position.y = p.y + n.y * this._current_horizontal_distance;
            this._previous_move_position.z = p.z + n.z * this._current_horizontal_distance;

            QE.player.set_position_xyz(this._previous_move_position.x, this._previous_move_position.y, this._previous_move_position.z);
            QE.player.look_at(this.currently_attached_to.get_position());

            QE.set_flag_on(ENGINE_STATE_MOUSE_Y_DISABLED);

            this._currently_moving = true;
        }
    };

    this.disengage = function() {
        this._currently_engaged = false;
        this._currently_moving  = false;
        this._currently_scaling = false;
        QE.set_flag_off(ENGINE_STATE_MOUSE_Y_DISABLED);
        this.show();
    };

    this.engaged = function() {
        return this._currently_engaged;
    };

    this.in_mouse_action = function() {
        return this._currently_scaling || this._currently_moving;
    };

    this.finish_mouse_action = function() {
        l('TODO: FINISH MOUSE ACTION!');
    };

    this.set_xy_based_off_of = function(position) {

        let _object;
        if (this.currently_attached_to.group != null) {
            _object = this.currently_attached_to.group;
        } else {
            _object = this.currently_attached_to.mesh;
        }

        this._dy = ((position.y - _object.position.y) / this.currently_attached_to.height) + 0.5;
        // Optimize later.
        let lr = this.currently_attached_to.get_left_right();
        let right_x = _object.position.x - (lr.x * (this.currently_attached_to.width / 2));
        let right_z = _object.position.z - (lr.z * (this.currently_attached_to.width / 2));
        let delta_right = Math.sqrt((right_x - position.x) * (right_x - position.x) + (right_z - position.z) * (right_z - position.z));
        this._dx = (delta_right / this.currently_attached_to.width);
    };

    this.update = function() {
        if (this._currently_moving) {
            let p = QE.player.get_position();
            let n = QE.player.get_normal();

            //QE.player.look_at(p.x + n.x, 0, p.z + n.z);
            this.currently_attached_to.set_position(p.x + n.x * this._current_horizontal_distance, p.y, p.z + n.z * this._current_horizontal_distance);
            this.currently_attached_to.set_normal(-n.x, 0, -n.z);
            //this.currently_attached_to.refresh_for_render();
            //this.currently_attached_to.refresh_for_render_recursively();

            //this.currently_attached_to.refresh_for_render();
            this.currently_attached_to.refresh_self_and_all_children_recursively();

        }
    };

};


Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        _currently_engaged: false,
        _currently_moving : false,
        _currently_scaling: false,
        _currently_visible: false,

        _previous_move_position     : new THREE.Vector3(),
        _current_horizontal_distance: 800,

        currently_attached_to : null,
        _current_icon         : null,

        _dx : null,
        _dy : null,

        attach: function(object_to_attach_to, intersection_position) {
            this._cursor_default.hide();
            //this._cursor_icon.show();
            this.show();

            this._currently_visible = true;
            this.currently_attached_to = object_to_attach_to;

            if (intersection_position != null) {
                this.set_xy_based_off_of(intersection_position);
            }

            if (this.currently_attached_to.feature_mouse_scaleable != null) {
                if (this.currently_attached_to.feature_mouse_scaleable) {
                    if (this.dx < .02 && this._dx > .98 && this._dy < .02 && this._dy > .98) {
                        //l('Set icon to scalable!');
                        this.set_current_icon(ASSET_ICON_EXPAND);
                        return;
                    }
                }
            }

            if (this.currently_attached_to.feature_mouse_moveable != null) {
                if (this.currently_attached_to.feature_mouse_moveable) {
                    //l('Set icon to moveable!');
                    this.set_current_icon(ASSET_ICON_DRAG);
                    return;
                }

            }

            if (this.currently_attached_to.feature_clickable != null) {
                if (this.currently_attached_to.feature_clickable) {
                    //l('Set icon to clickable!');
                    this.set_current_icon(ASSET_ICON_CLICK);
                    return;
                }
            }

            if (this.currently_attached_to.feature_typing != null) {
                if (this.currently_attached_to.feature_typing) {
                    //l('Set icon to feature_needs_mobile_keyboard!');
                    this.set_current_icon(ASSET_ICON_WRITTING);
                    return;
                }
            }
        },

        detach: function() {
            //this._cursor_icon.hide();
            this.hide();

            this.currently_attached_to = null;
            this._current_icon         = null;
            this._currently_moving     = false;
            this._currently_scaling    = false;
            this._currently_visible    = false;

            this._dx = null;
            this._dy = null;

            this._cursor_default.show();
        },

        on_wheel_event: function(delta) {
            if (delta === 1) {
                this._current_horizontal_distance *= 1.025;
            } else {
                this._current_horizontal_distance *= 0.975;
            }
        },

        set_current_icon: function(icon) {
            if (this._current_icon !== icon) {
                this._current_icon = icon;
                this.render();
            }
        },
    }
);