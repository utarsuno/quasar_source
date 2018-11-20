'use strict';

$_QE.prototype.PlayerMenuAbstract = function() {};

Object.assign(
    $_QE.prototype.PlayerMenuAbstract.prototype,
    $_QE.prototype.FloatingRows.prototype,
    $_QE.prototype.FeatureAnimationSequenceRows.prototype,
    {
        __init__: function(player) {
            this.player = player;
            this.group  = new THREE.Group();
            this.initialize_floating_element_data();
            this.initialize_wall_rows_animated();
            this.set_dimensions(512, 128);
        },

        create: function() {
            this._initialize_animation_sequence();
        },

        open: function() {
            //this.animation_stop();

            this.set_to_visible();
            this._open();

            this.animation_play_forward_once();
        },

        close: function() {
            this.animation_stop();
            this.set_to_invisible();
        },

        _on_close: function() {
            this.close();
        },

    }
);
