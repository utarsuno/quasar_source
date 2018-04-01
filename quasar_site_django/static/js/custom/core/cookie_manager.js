'use strict';

// Cookie keys.
const COOKIE_SHOULD_REMEMBER_USERNAME = 'should_remember_username';
const COOKIE_REMEMBERED_USERNAME      = 'remembered_username';

function CookieManager() {
    this.__init__();
}

CookieManager.prototype = {

    __init__: function() {
        this.cookies = Cookies.noConflict();
    },

    get_cookie_value: function(cookie_key) {
        var v = this.cookies.get(cookie_key);
        if (v === 'true' || v === 'True') {
            return true;
        } else if (v === 'false' || v === 'False') {
            return false;
        }
        return v;
    },

    has_cookie_key: function(cookie_key) {
        return is_defined(this.cookies.get(cookie_key));
    },

    set_cookie: function(cookie_key, cookie_value) {
        this.cookies.set(cookie_key, cookie_value);
    }
};