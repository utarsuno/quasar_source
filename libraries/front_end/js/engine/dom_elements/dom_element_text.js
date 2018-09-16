'use strict';

$_QE.prototype.DomElementText = function(data, data_type, dom_element_type) {

    let self = this;

    $_QE.prototype.DomElement.call(this, data, data_type, dom_element_type);
    $_QE.prototype.FeatureText.call(this, null, null, function() {
        if (self._element != null) {
            self._element.innerHTML = this.text;
        }
    });
};
