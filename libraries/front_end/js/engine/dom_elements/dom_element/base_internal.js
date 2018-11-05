'use strict';

$_QE.prototype.DomElementInternal = function() {};

Object.assign(
    $_QE.prototype.DomElementInternal.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        initialize_dom_element: function(dom_type, _id=null, display_style=null) {
            this._id      = _id;
            this._element = document.createElement(dom_type);
            if (this._id != null) {
                this._element.id = _id;
            }
            this._initialize_display_style(display_style);
            return this;
        },
    }
);




