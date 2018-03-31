'use strict';

const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';

function MobileInputManager() {

    document.addEventListener(TOUCH_EVENT_START, this.on_touch_start.bind(this));
    document.addEventListener(TOUCH_EVENT_MOVE, this.on_touch_move.bind(this));

    this.on_touch_start = function(event) {
        l('Touch start for : ' + event);
        event.preventBubble();
    };

    this.on_touch_move = function(event) {
        l('Touch move for : ' + event);
        event.preventBubble();
    };

}