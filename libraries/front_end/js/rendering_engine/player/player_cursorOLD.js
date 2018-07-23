'use strict';

$_QE.prototype.PlayerCursor = function() {

    this.on_world_leave = function() {
        this.detach();
    };

    $_QE.prototype.FeatureSingleton.call(this);
    $_QE.prototype.FeatureElementRoot.call(this);

    this.currently_attached_to = null;
    this._current_icon         = null;
    this._currently_engaged    = false;

    this._state_moving  = false;
    this._state_default = false;
    this._state_scaling = false;

    //$_QE.prototype.FeatureColor.call(this);

    this.update = function(delta) {
        //l('cursor update!');
    };

    this.update_position = function(p) {
        let normal = this.currently_attached_to.get_normal();

        //this.cursor.set_position(p.x, p.y, p.z, false);
        this._cursor.set_normal(normal.x, normal.y, normal.z);
        this._cursor.set_position_offset();
        this._cursor.object3D.position.set(p.x + this._cursor._position_offset.x, p.y + this._cursor._position_offset.y, p.z + this._cursor._position_offset.z);
        //this.cursor.set_normal(normal.x, normal.y, normal.z, false);
        this._cursor.refresh_position_and_look_at();
    };

    this.attach = function(object_to_attach_to) {
        this.currently_attached_to = object_to_attach_to;

        if (is_defined(this.currently_attached_to.feature_clickable)) {
            this._set_current_icon(ICON_CLICK);
        } else if (is_defined(this.currently_attached_to.feature_needs_mobile_keyboard)) {
            this._set_current_icon(ICON_WRITING);
        } else if (is_defined(this.currently_attached_to.feature_scale)) {
            // TODO:
        } else {
            this._set_current_icon(ICON_CURSOR);
        }

        this.update_position(this.currently_attached_to.get_position());

        this._center_cursor.hide();
        this._cursor.set_to_visible();
    };

    this._set_current_icon = function(icon) {
        if (this._current_icon !== icon) {
            this._current_icon = icon;
            this._cursor.switch_icon(icon);
            this._cursor.set_to_visible();

            switch (icon) {
            case ICON_CLICK:
                this._cursor.set_attachment_vertical_offset(-7, null);
                this._cursor.set_attachment_horizontal_offset(1, null);
                break;
            case ICON_WRITING:
                this._cursor.set_attachment_vertical_offset(8, null);
                this._cursor.set_attachment_horizontal_offset(7, null);
                break;
            }
        }
    };

    this.detach = function() {
        if (this._current_cursor !== null) {
            this._cursor.set_to_invisible();
        }
        this.currently_attached_to = null;
        this._current_icon         = null;
        this._center_cursor.show();
    };

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    this.create_world_environment_singletons = function(world, player, world_manager) {
        this.player = player;
        this._cursor = new $_QE.prototype.FloatingIcon(world, ICON_CLICK, 16, COLOR_GREEN);
        this._cursor.create_icon();
        //this.cursor = new $_QE.prototype.FloatingIcon(world, ICON_CLICK, 16);
        this._cursor.set_to_invisible();
        this._cursor.set_attachment_depth_offset(6);
        this._center_cursor = new $_QE.prototype.DomElement('cursor_default', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, false);

        world_manager.singletons.push(this);

        this.object3D = this._cursor.object3D;

        this.world_enter(world);

        this.world.add_element_root(this);



        //this._test_cursor = new $_QE.prototype.CanvasGUI2D('cursor_icon', CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ICON);


    };
};