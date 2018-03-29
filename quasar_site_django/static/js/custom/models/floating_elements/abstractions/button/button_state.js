'use strict';

function ButtonState() {

    this._enabled = true;

    // TODO  :
    this.disable = function() {
        this._enabled = false;
    };

    // TODO :
    this.enable = function() {
        this._enabled = true;
    };

    // TODO :
    this.enabled = function() {
        return this._enabled;
    };

}
