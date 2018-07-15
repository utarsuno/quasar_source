'use strict';

$_QE.prototype.Attachmentable = function() {

    this.only_moveable = null;

    $_QE.prototype.FeatureAttachment.call(this);

    this.add_floating_wall_attachment = function(width, height, horizontal_offset, vertical_offset, depth_offset, scalable) {
        let floating_wall;
        if (is_defined(scalable)) {
            // OLD : floating_wall = new FloatingWall(width, height, position, this.get_normal(), this.world, scalable);
            floating_wall = new FloatingWall(width, height, null, null, this.world, scalable);
        } else {
            floating_wall = new FloatingWall(width, height, null, null, this.world, false);
        }

        this.add_attachment(floating_wall);

        if (is_defined(horizontal_offset)) {
            floating_wall.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_wall.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_wall.set_attachment_depth_offset(depth_offset);
        }
        return floating_wall;
    };

    this.add_floating_element = function(horizontal_offset, vertical_offset, depth_offset, floating_element) {
        this.add_attachment(floating_element);
        if (is_defined(horizontal_offset)) {
            floating_element.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_element.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_element.set_attachment_depth_offset(depth_offset);
        }
        return floating_element;
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_position_for_singleton = function(x, y, z) {
        this.set_position_offset();
        this.object3D.position.set(x + this._position_offset.x, y + this._position_offset.y, z + this._position_offset.z);
        this._refresh_look_at();
    };


};
