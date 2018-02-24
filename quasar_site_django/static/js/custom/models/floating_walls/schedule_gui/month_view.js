'use strict';

function MonthView(world, entity_to_load_from) {
    this.__init__(world);
}

// TODO : Create the various month types.

MonthView.prototype = {

    __init__: function(world, entity_to_load_from) {
        if (is_defined(entity_to_load_from)) {
            this.load_from_entity(world, entity_to_load_from);
        } else {
            this.create_new(world);
        }

    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    create_new: function(world) {
        var data = get_player_blink_spot(1000);
        this.base_wall = new FloatingWall(2000, 1000, data[0], data[1], world, false);

    },

    load_from_entity: function(world, entity) {

    }

};