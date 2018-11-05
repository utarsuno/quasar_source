'use strict';

$_QE.prototype.DomElementExternal = function() {};

Object.assign(
    $_QE.prototype.DomElementExternal.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        initialize_dom_element: function(_id, display_style=null) {
            this._element = document.getElementById(_id);
            if (!(this._element != null)) {
                QE.log_warning('Dom element ID not found!', _id);
            }
            this._id = _id;
            this._initialize_display_style(display_style);
            return this;
        },
    }
);

