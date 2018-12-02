'use strict';

$_QE.prototype.DomElementText = function() {};

Object.assign(
    $_QE.prototype.DomElementText.prototype,
    $_QE.prototype.DomElement.prototype,
    $_QE.prototype.FeatureText.prototype,
    {
        __init__: function(_id) {
            this.__init__external(_id);
            this.text = '';
            this.set_value_post_changed_event(function() {
                if (this._element != null) {
                    this._element.innerHTML = this.text;
                }
            }.bind(this));
            return this;
        },
    }
);

