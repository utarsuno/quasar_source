'use strict';

function FloatingVideo(world, entity) {
    this.__init__(world, entity);
}

FloatingVideo.prototype = {

    __init__: function(world, entity) {
        if (!is_defined(entity)) {
            this.create_new_floating_video(world);
        } else {
            this.load_floating_video(world, entity);
        }

        this.base_wall.world.root_attachables.push(this.base_wall);
    },

    /*___  __    ___
     |__  |  \ |  |     |  |  /\  |    |
     |___ |__/ |  |     |/\| /~~\ |___ |___ */


    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    create_new_floating_video: function(world) {
        var data = get_player_blink_spot(200);

        this.base_wall = new FloatingWall(400, 300, data[0], data[1], world, true);
        this.base_wall.set_to_saveable(world.entity);

        this.video_entity = new Entity();
        this.video_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_VIDEO);
        this.video_entity.add_parent(this.base_wall.get_self_entity());
    },

    load_floating_video: function(world, entity) {
        this.video_entity = entity;

        // Load the base wall.
        this.base_wall = new FloatingWall(400, 600, null, null, world, true);
        this.base_wall.load_from_entity_data(this.video_entity.get_parent());
    }
};




/*
        var row = this.base_wall.add_row();
        row.add_2D_element([0, ONE_THIRD], 'Video Code:', TYPE_CONSTANT);
        row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);

        row = this.base_wall.add_row();
        row.add_2D_button([0, 1], 'create video', null, null);

        row = this.base_wall.add_row();
        row.add_2D_button([0, 1], 'delete', null, null);


 */



