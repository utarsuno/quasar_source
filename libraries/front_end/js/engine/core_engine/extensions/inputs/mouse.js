'use strict';

Object.assign(
    $_QE.prototype,
    {
        on_mouse_move: function(event) {
            if (this.flag_is_on(QEFLAG_CSS_LOOKED_AT)) {
                l(event);
            }
            this._cursor.x = event.clientX;
            this._cursor.y = event.clientY;

            if (this.is_current_state(QEFLAG_STATE_RUNNING) && this.player.has_movement()) {
                //this.player.on_mouse_move(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);

                if (this.flags_are_same(QEFLAG_CSS_LOOKED_AT, QEFLAG_CSS_HOVERED_ON)) {
                    if (event.movementX != 0) {
                        this.player.on_mouse_move_x(event.movementX);
                    }
                    if (event.movementY != 0 && this.flag_is_off(QEFLAG_STATE_MOUSE_Y_DISABLED)) {
                        this.player.on_mouse_move_y(event.movementY);
                    }
                }
            }
            //event.preventDefault();
            //event.stopPropagation();
        },

        on_mouse_up: function(event) {
            //event = event || window.event;
            switch (event.which) {
            case CLICK_LEFT:
                if (this.left_click_timer.getDelta() <= .3) {
                    // Double click.
                    if (this.is_current_state(QEFLAG_STATE_PAUSED)) {
                        this.set_state(QEFLAG_STATE_RUNNING);
                    } else {
                        this.manager_world.left_click_up(true);
                    }
                } else if (this.is_current_state(QEFLAG_STATE_RUNNING)) {
                    // Single click and engine is running.
                    this.manager_world.left_click_up(false);
                }
                break;
            case CLICK_MIDDLE:
                if (this.is_current_state(QEFLAG_STATE_PAUSED)) {
                    this.manager_world.middle_click_up();
                }
                break;
            case CLICK_RIGHT:
                if (this.is_current_state(QEFLAG_STATE_PAUSED)) {
                    this.manager_world.right_click_up();
                }
                break;
            }
            event.preventDefault();
            event.stopPropagation();
        },

        on_mouse_down: function(event) {
            //event = event || window.event;
            if (this.is_current_state(QEFLAG_STATE_RUNNING)) {
                switch (event.which) {
                case CLICK_LEFT:
                    this.manager_world.left_click_down();
                    break;
                case CLICK_MIDDLE:
                    this.manager_world.middle_click_down();
                    break;
                case CLICK_RIGHT:
                    this.manager_world.right_click_down();
                    break;
                }
            }
            event.preventDefault();
            event.stopPropagation();
        },

        _initialize_mouse: function() {
            document.onmousemove = this.on_mouse_move.bind(this);
            //document.addEventListener('mousemove', this.on_mouse_move.bind(this), true);
            document.addEventListener('mousedown', this.on_mouse_down.bind(this), true);
            document.addEventListener('mouseup'  , this.on_mouse_up.bind(this), true);

            // Base code modified from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
            if ('onwheel' in document) {
                document.addEventListener('wheel', function(event) {
                    if (this.player.has_input()) {
                        /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                        this.manager_world.on_wheel_event((event.deltaY >> 10) || 1);
                    }
                    // event.preventDefault(); --> "Unable to preventDefault inside passive event listener invocation.".
                    event.stopPropagation();
                }.bind(this), {
                    capture: true,
                    passive: true
                });
            } else {
                document.addEventListener('mousewheel', function(event) {
                    if (this.player.has_input()) {
                        /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                        this.manager_world.on_wheel_event((-event.wheelDelta >> 10) || 1);
                    }
                    // event.preventDefault(); --> "Unable to preventDefault inside passive event listener invocation.".
                    event.stopPropagation();
                }.bind(this), {
                    capture: true,
                    passive: true
                });
            }
        },
    }
);
