'use strict';

const SVG_CLICK_ICON = '568.svg'; // #pre-process_global_constant

function SVGManager() {
    this.__init__();
}

SVGManager.prototype = {

    __init__: function() {
        this._all_icons = {};
    },

    set_icon: function(icon_name, svg) {
        this._all_icons[icon_name] = svg;
    },

    get_icon: function(i) {
        return this._all_icons[i];
    }
};
