'use strict';

$_QE.prototype.PlayerMenu = function(player, world) {
    this.player = player;
    this.group  = new THREE.Group();
    this.initialize_floating_element_data();
    this.initialize_interactive_linked_list();
    // Temporary.
    this.set_dimensions(512, 128);

    world.create_and_add_element_to_root(this);

    this.row_create     = this._add_menu_row(ASSET_ICON_WRENCH  , 'create');
    this.row_teleport   = this._add_menu_row(ASSET_ICON_TELEPORT, 'teleport');
    this.row_fullscreen = this._add_menu_row(ASSET_ICON_EXPAND  , 'full-screen');

    // TODO: fix player blink position
    // TODO: Add icon button
};

Object.assign(
    $_QE.prototype.PlayerMenu.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.DoublyLinkedListRows.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        is_open : false,
        num_rows: 0,

        _add_menu_row: function(icon, text) {
            let r = this.create_row(null, QE.FONT_ARIAL_16.height);

            this._add_animation_step(r, 0.25, true, QE.FONT_ARIAL_16.height);

            r.create_icon(icon, QE.COLOR_GREEN_LIGHT, 5);
            let t = r.create_text2d(text, QE.COLOR_RGB_GREEN_LIGHT, QE.FONT_ARIAL_16, 160, 4);
            t.set_text_alignment(TEXT_ALIGNMENT_END);

            this.num_rows++;

            return r;
        },

        create: function() {
            this._initialize_animation_sequence();
        },

        open: function() {
            if (this.get_flag(EFLAG_IN_ANIMATION)) {
                this.animation_terminate_early();
            } else {
                this.animation_stop();
            }

            this.player.set_object_in_front_of(this, 650);

            // TEMP design.
            this.animation_start();
            //this.row_teleport.animation_start();
        },
    }
);
