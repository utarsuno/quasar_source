'use strict';

$_QE.prototype.PlayerMenu = function(player, world) {
    this.__init__(player);
    this.create_player_menu(world);

    let self = this;
    this.set_event(ELEMENT_EVENT_ON_WORLD_EXIT, this._on_exit.bind(this));
};

Object.assign(
    $_QE.prototype.PlayerMenu.prototype,
    $_QE.prototype.PlayerMenuAbstract.prototype,
    {
        is_open : false,

        _on_exit: function() {
            this.row_create._on_close();
            this.row_teleport._on_close();
            this.row_fullscreen._on_close();
            this.row_close._on_close();
            this.animation_close();
        },

        _open: function() {
            // TODO: Reset animation.
            this._on_exit();

            this.player.set_object_in_front_of(this, 550, 0, -200, 0);
        },

        register_world: function(world) {
            this.row_teleport.register_world(world);
        },

        create_player_menu: function(world) {
            world.create_and_add_element_to_root(this);

            this.row_create     = new $_QE.prototype.PlayerMenuRowCreate(this);
            this.row_teleport   = new $_QE.prototype.PlayerMenuRowTeleport(this);
            this.row_fullscreen = new $_QE.prototype.PlayerMenuRowFullScreen(this);
            this.row_close      = new $_QE.prototype.PlayerMenuRowClose(this);

            this._rows = [this.row_create, this.row_teleport, this.row_fullscreen, this.row_close];

            this.set_to_invisible();

            // TODO: fix player blink position
        },

        on_main_menu_button_look_at: function(button) {
            let r;
            for (r = 0; r < this._rows.length; r++) {
                if (this._rows[r].button == button) {
                    this._rows[r].lock_colors();
                } else {
                    this._rows[r].unlock_colors();
                }
            }
        },
    }
);

