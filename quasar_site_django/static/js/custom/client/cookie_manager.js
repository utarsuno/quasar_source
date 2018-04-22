'use strict';

// Cookie keys.
const COOKIE_SHOULD_REMEMBER_USERNAME = 'should_remember_username'; // #pre-process_global_constant
const COOKIE_REMEMBERED_USERNAME      = 'remembered_username';      // #pre-process_global_constant

function CookieManager() {
    this.cookies = Cookies.noConflict();

    this.get_cookie = function(cookie_key) {
        let v = this.cookies.get(cookie_key);
        if (v === 'true' || v === 'True') {
            return true;
        } else if (v === 'false' || v === 'False') {
            return false;
        }
        return v;
    };

    this.has_cookie = function(cookie_key) {
        return is_defined(this.cookies.get(cookie_key));
    };

    this.set_cookie = function(cookie_key, cookie_value) {
        this.cookies.set(cookie_key, cookie_value);
    };
}