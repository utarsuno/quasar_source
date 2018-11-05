'use strict';

$_QE.prototype.DomLinkInternal = function() {
    this.initialize_dom_link();
};

Object.assign(
    $_QE.prototype.DomLinkInternal.prototype,
    $_QE.prototype.DomElementInternal.prototype,
    {
        initialize_dom_link: function() {
            this.initialize_dom_element('a');
        },
    }
);
