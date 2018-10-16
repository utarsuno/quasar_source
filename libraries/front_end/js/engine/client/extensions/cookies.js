'use strict';


Object.assign($_QE.prototype.Client.prototype, {
    cookies: Cookies.noConflict(),

    get_cookie: function(cookie_key) {
        let v = this.cookies.get(cookie_key);
        if (v === 'true' || v === 'True') {
            return true;
        } else if (v === 'false' || v === 'False') {
            return false;
        }
        return v;
    },

    has_cookie: function(cookie_key) {
        return this.cookies.get(cookie_key) != null;
    },

    set_cookie: function(cookie_key, cookie_value) {
        this.cookies.set(cookie_key, cookie_value);
    },
});
