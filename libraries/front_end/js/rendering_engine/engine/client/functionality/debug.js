'use strict';

const DEBUG_MODE_NONE = 1; // #pre-process_global_constant
const DEBUG_MODE_FPS  = 2; // #pre-process_global_constant

$_QE.prototype.ClientFunctionalityDebug = function() {

    this.debug_mode = DEBUG_MODE_NONE;

    /*
    this._stats_api = new Stats();
    this._stats_api.showPanel(0);
    this._stats_dom = new $_QE.prototype.DomElement(this._stats_api.domElement, DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT, DOM_ELEMENT_DIV);
    this._stats_dom.set_id('fps_display');
    this._stats_dom.hide();
    this._stats_dom.append_to_document_body();
    */

    this.set_debug_mode = function(debug_mode) {
        this.debug_mode = debug_mode;

    };

};