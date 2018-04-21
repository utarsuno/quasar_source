'use strict';

const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';

function MobileInputManager() {

    this.touch_movement     = new TouchMovement();
    this.touch_camera       = new TouchCamera(this);
    this.touch_double_click = new TouchDoubleClick();

    this.is_horizontal = window.innerWidth > window.innerHeight;

    this.movement_boundary_x = window.innerWidth * ONE_THIRD;
    this.movement_boundary_y = window.innerHeight * HALF;

    this.mobile_resize = function(w, h) {
        this.is_horizontal = window.innerWidth > window.innerHeight;
        this.movement_boundary_x = w * ONE_THIRD;
        this.movement_boundary_y = h * ONE_THIRD;
    };

    this._in_movement_boundary = function(x, y) {
        if (x < this.movement_boundary_x) {
            if (y > (window.innerHeight - this.movement_boundary_y)) {
                return true;
            }
        }
        return false;
    };

    this._is_identifier_active = function(i) {
        return this.touch_movement.identifier === i || this.touch_camera.identifier === i || this.touch_double_click.identifier === i;
    };

    this._add_new_identifier = function(touch) {
        let x = touch.pageX;
        let y = touch.pageY;

        if (!this.touch_movement.is_alive() && this._in_movement_boundary(x, y) && !CURRENT_CLIENT.is_mobile) {
            this.touch_movement.set_to_alive(touch);
        } else if (!this.touch_camera.is_alive()) {
            this.touch_camera.set_to_alive(touch);
        } else if (!this.touch_double_click.is_alive()) {
            this.touch_double_click.set_to_alive(touch);
        }
    };

    this.on_touch_start = function(event) {
        let t;
        for (t = 0; t < event.touches.length; t++) {
            let i = event.touches[t].identifier;
            if (!this._is_identifier_active(i)) {
                this._add_new_identifier(event.touches[t]);
            }
        }
        //event.preventDefault();
        //event.stopPropagation();
    };

    this.on_touch_move = function(event) {
        let t;
        for (t = 0; t < event.touches.length; t++) {
            let touch = event.touches[t];
            let i = touch.identifier;
            if (i === this.touch_movement.identifier) {
                this.touch_movement.touch_move(touch.pageX, touch.pageY);
            } else if (i === this.touch_camera.identifier) {
                this.touch_camera.touch_move(touch.pageX, touch.pageY);
            }
        }
        //event.preventDefault();
        //event.stopPropagation();
    };

    this._check_if_touch_ended = function(identifier_list, touch) {
        if (touch.is_alive()) {
            for (let i = 0; i < identifier_list.length; i++) {
                if (touch.identifier === identifier_list[i]) {
                    return;
                }
            }

            // Not found so remove this touch type.
            touch.kill();
        }
    };

    this.on_touch_end = function(event) {
        let active_identifiers = [];
        let t;
        for (t = 0; t < event.touches.length; t++) {
            active_identifiers.push(event.touches[t].identifier);
        }

        this._check_if_touch_ended(active_identifiers, this.touch_movement);
        this._check_if_touch_ended(active_identifiers, this.touch_camera);
        this._check_if_touch_ended(active_identifiers, this.touch_double_click);

        //event.preventDefault();
        //event.stopPropagation();
    };

    document.addEventListener(TOUCH_EVENT_START, this.on_touch_start.bind(this));
    document.addEventListener(TOUCH_EVENT_MOVE, this.on_touch_move.bind(this));
    document.addEventListener(TOUCH_EVENT_END, this.on_touch_end.bind(this));

}