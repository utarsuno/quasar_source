'use strict';

const JSON_SPRITESHEET = 'spritesheet_test.json'; // #pre-process_global_constant

function JSONManager() {
    this.__init__();
}

JSONManager.prototype = {

    __init__: function() {
        this.json_objects = {};
    },

    set_json_object: function(asset_name, json_object) {
        this.json_objects[asset_name] = json_object;

        l('Json object loaded!');
        l(asset_name);
        l(json_object);
    },

    get_json_object: function(asset_name) {
        return this.json_objects[asset_name];
    }

};
