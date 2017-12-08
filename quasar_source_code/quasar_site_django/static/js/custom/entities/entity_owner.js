'use strict';

function EntityOwner(username, password) {
    this.__init__(username, password);
}

EntityOwner.prototype = {

    // The various settings of the entity owner.
    ep_setting_camera_fov    : null,
    ep_setting_master_volume : null,

    __init__: function(username, password) {
        this.username     = username;
        this.password     = password;
        this.owner_entity = null;
    },

    set_owner_entity: function(owner_entity) {
        this.owner_entity = owner_entity;
    },

    get_username: function() {
        return this.username;
    },

    get_password: function() {
        return this.password;
    },

    // Shortcuts for various owner entity properties.
    get_email: function() {
        return this.owner_entity.get_value(ENTITY_PROPERTY_EMAIL);
    },

    get_phone_number: function() {
        return this.owner_entity.get_value(ENTITY_PROPERTY_PHONE_NUMBER);
    },

    get_phone_carrier: function() {
        return this.owner_entity.get_value(ENTITY_PROPERTY_PHONE_CARRIER);
    },

    get_created_at_date: function() {
        return this.owner_entity.get_value(ENTITY_PROPERTY_CREATED_AT_DATE);
    },

    get_owner_sms_email: function() {
        var owner_provider = this.get_phone_carrier();
        var owner_phone_number = this.get_phone_number();
        var owner_sms_address;

        for (var key in CELL_PHONE_CARRIERS) {
            if (CELL_PHONE_CARRIERS.hasOwnProperty(key)) {

                if (key === owner_provider) {
                    owner_sms_address = CELL_PHONE_CARRIERS[key].replace('number', owner_phone_number);
                }
            }
        }

        return owner_sms_address;
    },
};