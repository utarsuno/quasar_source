'use strict';

const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';

function MobileInputManager() {

    document.documentElement.style.overflow = 'hidden';
    //document.documentElement.style.overflow = 'auto';

    this.touch_position = {x: 0, y: 0};
    this.touch_previous = {x: -1, y: -1};

    this.is_horizontal = window.innerWidth > window.innerHeight;

    this.on_touch_start = function(event) {
        l('Touch start for : ');

        this.touch_position.x = event.touches[0].pageX;
        this.touch_position.y = event.touches[0].pageY;

        l(event);
        event.stopPropagation();
    };

    this.on_touch_move = function(event) {
        l('Touch move for : ');
        l(event);

        if (this.touch_previous.x !== -1) {

            if (this.is_horizontal) {
                this._mouse_movement(this.touch_position.y - this.touch_previous.y, this.touch_position.z - this.touch_previous.z);
            } else {
                this._mouse_movement(this.touch_position.x - this.touch_previous.x, this.touch_position.y - this.touch_previous.x);
            }

        }
        this.touch_previous.x = this.touch_position.x;
        this.touch_previous.y = this.touch_position.y;

        this.touch_position.x = event.touches[0].pageX;
        this.touch_position.y = event.touches[0].pageY;

        event.stopPropagation();
    };

    document.addEventListener(TOUCH_EVENT_START, this.on_touch_start.bind(this));
    document.addEventListener(TOUCH_EVENT_MOVE, this.on_touch_move.bind(this));

}