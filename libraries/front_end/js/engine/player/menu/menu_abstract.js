'use strict';

$_QE.prototype.PlayerMenuAbstract = function() {};

Object.assign(
    $_QE.prototype.PlayerMenuAbstract.prototype,
    $_QE.prototype.FloatingRows.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        __init__: function(player) {
            this.player = player;
            this.group  = new THREE.Group();
            this.initialize_self_with_rows();
            this.set_dimensions(512, 128);
        },

        create: function() {
            this._initialize_animation_sequence();
        },

        open: function() {
            this._open();
            this.set_to_visible();
            this.animation_play_forward(true, true);
        },

        // -----------------------------------

        _initialize_animation_sequence: function() {
            this.__init__animation_sequence();
            this._a_calculated = false;
        },

        _animation_on_start_forward: function() {
            if (!this._a_calculated) {
                let a;
                for (a = 0; a < this._a_steps.length; a++) {
                    this._a_steps[a].animation_step_pre_start();
                }
                this._a_calculated = true;
            }
            this._animation_set_node_opacities(0.0);
        },

        _animation_on_start_reverse: function() {
            this._animation_set_node_opacities(1.0);
        },

        _animation_set_node_opacities: function(opacity) {
            let n;
            for (n = 0; n < this._a_steps.length; n++) {
                this._a_steps[n]._animation_step_set_opacity(opacity);
            }
        },
    }
);
