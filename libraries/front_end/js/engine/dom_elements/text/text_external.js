'use strict';

$_QE.prototype.DomTextExternal = function() {};

Object.assign(
    $_QE.prototype.DomTextExternal.prototype,
    $_QE.prototype.DomElementExternal.prototype,
    $_QE.prototype.FeatureText.prototype,
    {
        initialize_dom_text: function(_id) {
            this.initialize_dom_element(_id);


            this.text = '';
            let self  = this;
            this._on_value_post_changed_event = function() {
                if (self._element != null) {
                    self._element.innerHTML = this.text;
                }
            };
            this.set_value_post_changed_event(this._on_value_post_changed_event);
            return this;
        },
    }
);
