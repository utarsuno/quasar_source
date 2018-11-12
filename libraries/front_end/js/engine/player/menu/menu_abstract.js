'use strict';

$_QE.prototype.PlayerMenuAbstract = function() {};

Object.assign(
    $_QE.prototype.PlayerMenuAbstract.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.DoublyLinkedListRows.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        create: function() {
            this._initialize_animation_sequence();
        },

        open: function() {
            if (this.get_flag(EFLAG_IN_ANIMATION)) {
                this.animation_terminate_early();
            } else {
                this.animation_stop();
            }

            this._open();

            this.animation_start();
        },
    }
);
