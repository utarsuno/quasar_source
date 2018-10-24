'use strict';

$_QE.prototype.DomElementText = function() {
    this.text = '';
    let self  = this;
    this._on_value_post_changed_event = function() {
        if (self._element != null) {
            self._element.innerHTML = this.text;
        }
    };
    this.set_value_post_changed_event(this._on_value_post_changed_event);
};

Object.assign(
    $_QE.prototype.DomElementText.prototype,
    $_QE.prototype.DomElement.prototype,
    $_QE.prototype.FeatureText.prototype
);
