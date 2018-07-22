'use strict';

$_QE.prototype.ClientFunctionalityCookies = function() {

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
};