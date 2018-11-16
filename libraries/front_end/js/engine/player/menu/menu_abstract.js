'use strict';

$_QE.prototype.PlayerMenuAbstract = function() {};

Object.assign(
    $_QE.prototype.PlayerMenuAbstract.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.DoublyLinkedListRows.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        __init__: function(player) {
            this.player = player;
            this.group  = new THREE.Group();
            this.initialize_floating_element_data();
            this.initialize_interactive_linked_list();
            this.set_dimensions(512, 128);
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

            this.set_to_visible();
            this._open();

            this.animation_start();
        },

    }
);
