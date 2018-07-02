'use strict';

$_QE.prototype.DomElementString = function() {

    this._current_text = null;

    this.clear = function() {
        this.set_text('');
    };

    this.set_text = function(text) {
        if (this._current_text !== text) {
            this._element.innerHTML = text;
            this._current_text = text;
        }
    };

    this.get_text = function() {
        return this._current_text;
        //return this.element.innerHTML;
    };

};
