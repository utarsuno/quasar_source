'use strict';

const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';
const ORIENTATION_CHANGE = 'orientationchange';

function MobileInputManager() {

    this.touch_position = {x: 0, y: 0};
    this.touch_previous = {x: -1, y: -1};

    this.is_horizontal = window.innerWidth > window.innerHeight;

    this.on_touch_start = function(event) {
        l('Touch start for : ');

        this.touch_position.x = event.touches[0].pageX;
        this.touch_position.y = event.touches[0].pageY;

        l(event);
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_touch_move = function(event) {
        l('Touch move for : ');
        l(event);

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
    document.addEventListener(ORIENTATION_CHANGE, this.on_orientation_change.bind(this));

}