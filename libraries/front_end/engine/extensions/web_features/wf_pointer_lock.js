'use strict';


Object.assign(
    $_QE.prototype,
    {
        __init__pointer_lock: function() {
            this.flag_set_off(QEFLAG_STATE_POINTER_LOCK);

            if (this._cache_reference_document_body.requestPointerLock) {
                document.addEventListener('pointerlockchange', function() {
                    this.flag_set(QEFLAG_STATE_POINTER_LOCK, this._cache_reference_document_body === document.pointerLockElement);
                    if (this.flags_are_both_off(QEFLAG_STATE_POINTER_LOCK, QEFLAG_CSS_LOOKED_AT)) {
                        this.set_state(QEFLAG_STATE_PAUSED);
                    }
                }.bind(this), true);
                document.addEventListener('pointerlockerror' , this.pointer_lock_error.bind(this), true);

                this.mouse_lock = function() {
                    this._cache_reference_document_body.requestPointerLock();
                }.bind(this);
                this.mouse_release = function() {
                    document.exitPointerLock();
                };
            } else if (this._cache_reference_document_body.mozRequestPointerLock) {
                document.addEventListener('mozpointerlockchange', function() {
                    this.flag_set(QEFLAG_STATE_POINTER_LOCK, this._cache_reference_document_body === document.mozPointerLockElement);
                    if (this.flags_are_both_off(QEFLAG_STATE_POINTER_LOCK, QEFLAG_CSS_LOOKED_AT)) {
                        this.set_state(QEFLAG_STATE_PAUSED);
                    }
                }.bind(this), true);
                document.addEventListener('mozpointerlockerror' , this.pointer_lock_error.bind(this), true);

                this.mouse_lock = function() {
                    this._cache_reference_document_body.mozRequestPointerLock();
                }.bind(this);
                this.mouse_release = function() {
                    document.mozExitPointerLock();
                };
            } else {
                document.addEventListener('webkitpointerlockchange', function() {
                    this.flag_set(QEFLAG_STATE_POINTER_LOCK, this._cache_reference_document_body === document.webkitPointerLockElement);
                    if (this.flags_are_both_off(QEFLAG_STATE_POINTER_LOCK, QEFLAG_CSS_LOOKED_AT)) {
                        this.set_state(QEFLAG_STATE_PAUSED);
                    }
                }.bind(this), true);
                document.addEventListener('webkitpointerlockerror' , this.pointer_lock_error.bind(this), true);

                this.mouse_lock = function() {
                    this._cache_reference_document_body.webkitRequestPointerLock();
                }.bind(this);
                this.mouse_release = function() {
                    document.webkitExitPointerLock();
                };
            }
        },

        pointer_lock_error: function(e) {
            //if (!this.is_feature_enabled(CLIENT_FEATURE_MOBILE)) {
            this.fatal_error('Pointer lock error {' + e + '}!');
            //}
        },

    }
);

