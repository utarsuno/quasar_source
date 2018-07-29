'use strict';

$_QE.prototype.PlayerCursor = function(player, world_manager) {

    this.player = player;
    this.world_manager = world_manager;

    this._cursor_default = new $_QE.prototype.DomElement('cursor_default', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV);
    //this._cursor_icon = new $_QE.prototype.DomElementCanvas('cursor_icon', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, CANVAS_RENDERING_ICON);

    $_QE.prototype.FeatureColor.call(this, COLOR_GREEN, FLOATING_TEXT_BACKGROUND_TRANSPARENT);
    $_QE.prototype.CanvasGUI2D.call(this, 'cursor_icon', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, CANVAS_GUI_2D_ABSOLUTE_PIXELS);

    this._cursor_default.create_element();
    //this._cursor_icon.create_element();

    this._currently_engaged = false;
    this._currently_moving  = false;
    this._currently_scaling = false;
    this._currently_visible = false;

    this._previous_move_position = new THREE.Vector3();
    this._current_horizontal_distance = 800;

    this.currently_attached_to = null;
    this._current_icon         = null;

    this._dx = null;
    this._dy = null;

    this.initialize_gui(32, 32);
    $_QE.prototype.CanvasRenderingIcon.call(this);
    QE.add_gui_2d_element(this);

    //this._test_cursor = new $_QE.prototype.CanvasGUI2D('cursor_icon', CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ICON);

    this.engage = function() {
        this._currently_engaged = true;
        this.hide();

        // Update player position.
        if (this._current_icon === ICON_DRAG) {
            let p = this.currently_attached_to.get_position();
            let n = this.currently_attached_to.get_normal();

            this._previous_move_position.x = p.x + n.x * this._current_horizontal_distance;
            this._previous_move_position.y = p.y + n.y * this._current_horizontal_distance;
            this._previous_move_position.z = p.z + n.z * this._current_horizontal_distance;

            QE.player.set_position_xyz(this._previous_move_position.x, this._previous_move_position.y, this._previous_move_position.z);
            QE.player.look_at(this.currently_attached_to.get_position());

            QE.manager_input.disable_mouse_y = true;

            this._currently_moving = true;
        }
    };

    this.disengage = function() {
        this._currently_engaged = false;
        this._currently_moving = false;
        this._currently_scaling = false;
        QE.manager_input.disable_mouse_y = false;
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
        this._dy = ((position.y - this.currently_attached_to.object3D.position.y) / this.currently_attached_to.height) + 0.5;
        // Optimize later.
        let lr = this.currently_attached_to.get_left_right();
        let right_x = this.currently_attached_to.object3D.position.x - (lr.x * (this.currently_attached_to.width / 2));
        let right_z = this.currently_attached_to.object3D.position.z - (lr.z * (this.currently_attached_to.width / 2));
        let delta_right = Math.sqrt((right_x - position.x) * (right_x - position.x) + (right_z - position.z) * (right_z - position.z));
        this._dx = (delta_right / this.currently_attached_to.width);
    };

    this.update = function() {
        if (this._currently_moving) {
            let p = QE.player.get_position();
            let n = QE.player.get_direction();

            //QE.player.look_at(p.x + n.x, 0, p.z + n.z);
            this.currently_attached_to.set_position(p.x + n.x * this._current_horizontal_distance, p.y, p.z + n.z * this._current_horizontal_distance);
            this.currently_attached_to.set_normal(-n.x, 0, -n.z);
            this.currently_attached_to.refresh_for_render();
            this.currently_attached_to.refresh_for_render_recursively();


        }
    };

    this.attach = function(object_to_attach_to, intersection_position) {
        this._cursor_default.hide();
        //this._cursor_icon.show();
        this.show();

        this._currently_visible = true;
        this.currently_attached_to = object_to_attach_to;

        if (is_defined(intersection_position)) {
            this.set_xy_based_off_of(intersection_position);
        }

        if (is_defined(this.currently_attached_to.feature_mouse_scaleable)) {
            if (this.currently_attached_to.feature_mouse_scaleable) {
                if (this.dx < .02 && this._dx > .98 && this._dy < .02 && this._dy > .98) {
                    l('Set icon to scalable!');
                    this.set_current_icon(ICON_EXPAND);
                    return;
                }
            }
        }

        if (is_defined(this.currently_attached_to.feature_mouse_moveable)) {
            if (this.currently_attached_to.feature_mouse_moveable) {
                l('Set icon to moveable!');
                this.set_current_icon(ICON_DRAG);
                return;
            }

        }


        if (is_defined(this.currently_attached_to.feature_clickable)) {
            if (this.currently_attached_to.feature_clickable) {
                l('Set icon to clickable!');
                this.set_current_icon(ICON_CLICK);
                return;
            }
        }

        if (is_defined(this.currently_attached_to.feature_needs_mobile_keyboard)) {
            if (this.currently_attached_to.feature_needs_mobile_keyboard) {
                l('Set icon to feature_needs_mobile_keyboard!');
                this.set_current_icon(ICON_WRITING);
                return;
            }
        }
    };

    this.detach = function() {
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
    };


    this.on_wheel_event = function(delta) {
        if (delta === 1) {
            this._current_horizontal_distance *= 1.025;
        } else {
            this._current_horizontal_distance *= 0.975;
        }
    };

    this.set_current_icon = function(icon) {
        if (this._current_icon !== icon) {
            this._current_icon = icon;
            this.render();
        }
    };

};