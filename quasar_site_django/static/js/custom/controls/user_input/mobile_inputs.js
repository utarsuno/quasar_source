'use strict';

const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';
const ORIENTATION_CHANGE = 'orientationchange';

function TouchIndex(index) {
    this.__init__(index);
}

TouchIndex.prototype = {
    __init__: function(index) {
        this.index = index;
        this.active = false;
    }
};

function TouchUtility() {
    this.__init__();
}

TouchUtility.prototype = {
    __init__: function() {
        this.index = -1;
        this.previous_x = -1;
        this.previous_y = -1;
        this.current_x  = -1;
        this.current_y  = -1;
    }
};

//  MANAGER_INPUT.mobile_resize(this.window_width, this.window_height);
function MobileInputManager() {

    this.touch_indexes = [];
    this.touch_indexes.append(new TouchIndex(0));
    this.touch_indexes.append(new TouchIndex(1));
    this.touch_indexes.append(new TouchIndex(2));

    //this.movement_boundary_x =

    this.touch_position = {x: 0, y: 0};
    this.touch_previous = {x: -1, y: -1};

    this.current_active_indexes = [];
    this.touch_movement = new TouchUtility();
    this.touch_view     = new TouchUtility();
    this.touch_double   = new TouchUtility();

    this.number_of_active_touches = 0;

    this.is_horizontal = window.innerWidth > window.innerHeight;

    this.movement_boundary_x = window.innerWidth * ONE_FOURTH;
    this.movement_boundary_y = window.innerHeight * ONE_FOURTH;

    this.mobile_resize = function(w, h) {
        this.movement_boundary_x = w * ONE_FOURTH;
        this.movement_boundary_y = h * ONE_FOURTH;
    };

    this.on_touch_start = function(event) {
        for (var t = 0; t < event.touches.length; t++) {

        }


        /*
        if (this.number_of_active_touches === 0) {
            for (var t = 0; t < event.touches.length; t++) {

            }
        } else {

        }
        */


        //l('Touch start for : ');

        this.touch_position.x = event.touches[0].pageX;
        this.touch_position.y = event.touches[0].pageY;

        //l(event);
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_touch_move = function(event) {
        //l('Touch move for : ');
        //l(event);

        if (this.touch_previous.x !== -1) {

            if (this.is_horizontal) {
                this._mouse_movement(this.touch_position.x - this.touch_previous.x, this.touch_position.y - this.touch_previous.y);
            } else {
                this._mouse_movement(this.touch_position.y - this.touch_previous.y, this.touch_position.x - this.touch_previous.x);
            }

        }
        this.touch_previous.x = this.touch_position.x;
        this.touch_previous.y = this.touch_position.y;

        this.touch_position.x = event.touches[0].pageX;
        this.touch_position.y = event.touches[0].pageY;

        event.preventDefault();
        event.stopPropagation();
    };

    this.on_touch_end = function(event) {
        l('Touch end for:');
        l(event);
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