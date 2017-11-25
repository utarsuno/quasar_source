'use strict';

function EntityOwner(username, password) {
    this.__init__(username, password);
}

EntityOwner.prototype = {

    // The various settings of the entity owner.
    ep_setting_camera_fov    : null,
    ep_setting_master_volume : null,

    __init__: function(username, password) {
        this.username = username;
        this.password = password;
    },

    get_username: function() {
        return this.username;
    },

    get_password: function() {
        return this.password;
    }
};