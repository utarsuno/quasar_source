let on_mouse_move = function(event) {
    this.cached_ints[4] = event.clientX;
    this.cached_ints[5] = event.clientY;
    if (this.is_current_state(QEFLAG_STATE_RUNNING) && this.player.has_movement()) {
        //this.player.on_mouse_move(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);
        if (this.flags_are_same(QEFLAG_CSS_LOOKED_AT, QEFLAG_CSS_HOVERED_ON)) {
            if (event.movementX !== 0) {
                this.player.on_mouse_move_x(event.movementX);
            }
            if (event.movementY !== 0 && this.flag_is_off(QEFLAG_STATE_MOUSE_Y_DISABLED)) {
                this.player.on_mouse_move_y(event.movementY);
            }
        }
    }
};

let on_mouse_up = function(event) {
    switch (event.which) {
        case 1: // Left click.
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
        case 2: // Middle click.
            if (this.is_current_state(QEFLAG_STATE_PAUSED)) {
                this.manager_world.middle_click_up();
            }
            break;
        case 3: // Right click.
            if (this.is_current_state(QEFLAG_STATE_PAUSED)) {
                this.manager_world.right_click_up();
            }
            break;
    }
    event.preventDefault();
    event.stopPropagation();
};

let on_mouse_down = function(event) {
    if (this.is_current_state(QEFLAG_STATE_RUNNING)) {
        switch (event.which) {
            case 1: // Left click.
                this.manager_world.left_click_down();
                break;
            case 2: // Middle click.
                this.manager_world.middle_click_down();
                break;
            case 3: // Right click.
                this.manager_world.right_click_down();
                break;
        }
    }
    event.preventDefault();
    event.stopPropagation();
};

export default {
    on_mouse_move: on_mouse_move,
    on_mouse_up  : on_mouse_up,
    on_mouse_down: on_mouse_down
}