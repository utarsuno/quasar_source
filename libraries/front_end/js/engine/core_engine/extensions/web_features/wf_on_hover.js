'use strict';


Object.assign($_QE.prototype, {

    __init__on_hover: function() {
        window.onmouseover = this._engine_on_hover.bind(this);
        window.mouseover   = this._engine_on_hover.bind(this);
    },

    _engine_on_hover: function(e) {
        if (e.target != document.body && (QE.css_renderer.domElement != null && e.target != QE.css_renderer.domElement)) {
            QE.manager_world.current_world.on_css_hover(e);
        } else {
            //QE.flag_set_off(QEFLAG_CSS_LOOKED_AT);
            QE.flag_set_off(QEFLAG_CSS_HOVERED_ON);
        }
    },


});
