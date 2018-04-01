'use strict';

const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';
const ORIENTATION_CHANGE = 'orientationchange';

function TouchAbstraction() {
    this.identifier = null;
    this.is_alive = function() {
        return is_defined(this.identifier);
    };
    this.set_to_alive = function(touch) {
        l('identifier set to :');
        l(touch.identifier);
        this.identifier = touch.identifier;
        this.touch_initialize(touch.pageX, touch.pageY);
    };
    this.kill = function() {
        this.identifier = null;
        if (is_defined(this.on_kill)) {
            this.on_kill();
        }
    };
}

function TouchMovement() {
    this.__init__();
}

TouchMovement.prototype = {
    __init__: function() {
        TouchAbstraction.call(this);
        this.direction = new THREE.Vector2(0, 0);
    },
    touch_initialize: function(x, y) {
        this.start_x = x;
        this.start_y = y;
    },
    touch_move: function(x, y) {
        this.current_x = x;
        this.current_y = y;
        this.direction.x = this.start_x - this.current_x;
        this.direction.y = this.start_y - this.current_y;
        this.direction.normalize();
        CURRENT_PLAYER.fps_controls.set_mobile_movement(this.direction);
    },
    on_kill: function() {
        CURRENT_PLAYER.fps_controls.stop_mobile_movement();
    }
};

function TouchCamera(input_manager) {
    this.__init__(input_manager);
}

TouchCamera.prototype = {
    __init__: function(input_manager) {
        TouchAbstraction.call(this);
        this.input_manager = input_manager;
        this.direction = new THREE.Vector2(0, 0);
    },
    touch_initialize: function(x, y) {
        this.current_x = x;
        this.current_y = y;
    },
    touch_move: function(x, y) {
        l('CAMERA TOUCH MOVE!!');
        this.new_x = x;
        this.new_y = y;
        //this.direction.x = this.new_x - this.current_x;
        //this.direction.y = this.new_y - this.current_y;
        //this.direction.normalize();
        if (this.input_manager.is_horizontal) {
            this.input_manager._mouse_movement(this.new_x - this.current_x, this.new_y, - this.current_y);
        } else {
            this.input_manager._mouse_movement(this.new_y - this.current_y, this.new_x - this.current_x);
        }
        this.current_x = this.new_x;
        this.current_y = this.new_y;
    }
};


//  MANAGER_INPUT.mobile_resize(this.window_width, this.window_height);
function MobileInputManager() {

    this.touch_movement = new TouchMovement();
    this.touch_camera   = new TouchCamera(this);

    this.is_horizontal = window.innerWidth > window.innerHeight;

    this.movement_boundary_x = window.innerWidth * ONE_FOURTH;
    this.movement_boundary_y = window.innerHeight * ONE_FOURTH;

    this.mobile_resize = function(w, h) {
        this.movement_boundary_x = w * ONE_FOURTH;
        this.movement_boundary_y = h * ONE_FOURTH;
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
        if (this.touch_movement.identifier === i) {
            return true;
        }
        if (this.touch_camera.identifier === i) {
            return true;
        }
        return false;
    };

    this._add_new_identifier = function(touch) {
        l('Adding new identifier!');
        l('Is touch movement alive? {' + this.touch_movement.is_alive() + '}');
        l('Is touch camera alive? {' + this.touch_camera.is_alive() + '}');
        if (!this.touch_movement.is_alive()) {
            var x = touch.pageX;
            var y = touch.pageY;
            if (this._in_movement_boundary(x, y)) {
                this.touch_movement.set_to_alive(touch);
            }
        } else if (!this.touch_camera.is_alive()) {
            this.touch_camera.set_to_alive(touch);
        }
    };

    this.on_touch_start = function(event) {
        for (var t = 0; t < event.touches.length; t++) {
            var i = event.touches[t].identifier;
            if (!this._is_identifier_active(i)) {
                this._add_new_identifier(event.touches[t]);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_touch_move = function(event) {
        for (var t = 0; t < event.touches.length; t++) {
            var touch = event.touches[t];
            var i = touch.identifier;
            if (i === this.touch_movement.identifier) {
                this.touch_movement.touch_move(touch.pageX, touch.pageY);
            } else if (i === this.touch_camera.identifier) {
                this.touch_camera.touch_move(touch.pageX, touch.pageY);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_touch_end = function(event) {
        var active_identifiers = event.touches;
        if (this.touch_movement.is_alive()) {
            if (!(this.touch_movement.identifier in active_identifiers)) {
                this.touch_movement.kill();
            }
        }
        if (this.touch_camera.is_alive()) {
            if (!(this.touch_camera.identifier in active_identifiers)) {
                this.touch_camera.kill();
            }
        }
    };

    this.on_orientation_change = function() {
        l('Orientation is now:');
        l(window.orientation);
        switch(window.orientation) {
        case -90 || 90:
            this.is_horizontal = false;
            break;
        default:
            this.is_horizontal = true;
            break;
        }
    };

    document.addEventListener(TOUCH_EVENT_START, this.on_touch_start.bind(this));
    document.addEventListener(TOUCH_EVENT_MOVE, this.on_touch_move.bind(this));
    document.addEventListener(TOUCH_EVENT_END, this.on_touch_end.bind(this));
    document.addEventListener(ORIENTATION_CHANGE, this.on_orientation_change.bind(this));

}