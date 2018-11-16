'use strict';

Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    {
        attached_to: null,
        _dx        : null,
        _dy        : null,

        _initialize_default_cursor: function() {
            this._cursor_default = new $_QE.prototype.DomElementExternal().initialize_dom_element(GLOBAL_ID_CURSOR_DEFAULT);
        },

        _set_to_cursor_default: function() {
            this.hide();
            this._cursor_default.show();

            this.flags_clear();
            this.flag_set_on(CURSOR_STATE_DEFAULT);

            this.attached_to = null;
        },
    }
);
