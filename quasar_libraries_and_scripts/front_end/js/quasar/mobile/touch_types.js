'use strict';

function TouchAbstraction() {
    this.identifier = null;
    this.is_alive = function() {
        return is_defined(this.identifier);
    };
    this.set_to_alive = function(touch) {
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

        this.sensativity_multiplier = 5;
    },
    touch_initialize: function(x, y) {
        this.current_x = x;
        this.current_y = y;
    },
    touch_move: function(x, y) {
        this.new_x = x;
        this.new_y = y;
        if (this.input_manager.is_horizontal) {
            this.input_manager._mouse_movement((this.new_x - this.current_x) * this.sensativity_multiplier, (this.new_y - this.current_y) * this.sensativity_multiplier);
        } else {
            this.input_manager._mouse_movement((this.new_y - this.current_y) * this.sensativity_multiplier, (this.new_x - this.current_x) * this.sensativity_multiplier);
        }
        this.current_x = this.new_x;
        this.current_y = this.new_y;
    }
};

function TouchDoubleClick() {
    this.__init__();
}

TouchDoubleClick.prototype = {
    __init__: function() {
        TouchAbstraction.call(this);
    },
    touch_initialize: function() {
        MANAGER_WORLD.right_click_down();
    },

    on_kill: function() {
        MANAGER_WORLD.right_click_up();
    }
};
