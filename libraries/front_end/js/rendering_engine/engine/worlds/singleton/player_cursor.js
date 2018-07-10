'use strict';

$_QE.prototype.PlayerCursor = function() {

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    this.create = function(world, player) {
        this.player = player;
        this.cursor = new $_QE.prototype.FloatingIcon(world, ICON_CLICK, 16);
        this.cursor.set_to_invisible();
        this.cursor.set_to_manual_positioning();
        this.cursor.set_to_singleton();
        this.cursor.set_attachment_depth_offset(6);
        this.created = true;
    };

};
