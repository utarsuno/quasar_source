'use strict';

$_QE.prototype.PlayerCursor = function(player, world_manager) {

    this.player = player;
    this.world_manager = world_manager;

    this._cursor_default = new $_QE.prototype.DomElement('cursor_default', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV);
    this._cursor_icon = new $_QE.prototype.DomElementCanvas('cursor_icon', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV);

    this._cursor_default.create_element();
    this._cursor_icon.create_element();

    this._currently_moving  = false;
    this._currently_scaling = false;
    this._currently_visible = false;

    this.currently_attached_to = null;
    this._current_icon          = null;

    QE.add_gui_2d_element(this);

    //this._test_cursor = new $_QE.prototype.CanvasGUI2D('cursor_icon', CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ICON);

    this.engage = function() {

    };

    this.disengage = function() {

    };

    this.set_xy_based_off_of = function(position) {
        l('TODO: GET xy BASED OFF OF {');
        l(position);
        l('}');

        l(this.currently_attached_to);
        l(this.currently_attached_to.get_left_right());

    };

    this.attach = function(object_to_attach_to, intersection_position) {
        this._cursor_default.hide();
        this._cursor_icon.show();

        this._currently_visible = true;
        this.currently_attached_to = object_to_attach_to;

        if (is_defined(intersection_position)) {
            let xy = this.set_xy_based_off_of(intersection_position);

        }

        //let xy = this.player.intersects_plane(1, 2, 3);


        return;


        // Determine the cursor needed.
        if (is_defined(this.currently_attached_to.feature_mouse_moveable)) {
            if (this.currently_attached_to.feature_mouse_moveable) {

            }
        }

        if (is_defined(this.currently_attached_to.feature_clickable)) {
            if (this.currently_attached_to.feature_clickable) {
                l('Set icon to clickable!');
                this.set_current_icon(ICON_CLICK);
            }
        }

        if (is_defined(this.currently_attached_to.feature_needs_mobile_keyboard)) {
            if (this.currently_attached_to.feature_needs_mobile_keyboard) {
                l('Set icon to feature_needs_mobile_keyboard!');
                this.set_current_icon(ICON_WRITING);
            }
        }

        // TODO : Moving

        // TODO : Scaling
    };

    this.detach = function() {
        this._cursor_icon.hide();

        this.currently_attached_to = null;
        this._current_icon         = null;
        this._currently_moving     = false;
        this._currently_scaling    = false;
        this._currently_visible    = false;

        this._cursor_default.show();
    };


    this.on_wheel_event = function(delta) {
        if (delta === 1) {
            // this._horizontal_distance_to_player *= 1.1;
        } else {
            // this._horizontal_distance_to_player *= 0.9;
        }
    };

    this.set_current_icon = function(icon) {
        if (this._current_icon !== icon) {
            this._current_icon = icon;
            l('TODO: SWITCH ICONS!!!');
        }
    };

    this.update = function() {

    };

};