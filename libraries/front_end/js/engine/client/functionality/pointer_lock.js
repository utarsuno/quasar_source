'use strict';

const _PL_MODE_DEFAULT = 0; // #pre-process_global_constant
const _PL_MODE_MOZ     = 1; // #pre-process_global_constant
const _PL_MODE_WEBKIT  = 2; // #pre-process_global_constant


$_QE.prototype.ClientFunctionalityPointerLock = function() {

    this.has_pointer_lock   = false;
    this._document_body     = document.body;
    this._pointer_lock_mode = null;

    this.pointer_lock_change = function () {
        switch (this._pointer_lock_mode) {
        case _PL_MODE_DEFAULT:
            this.has_pointer_lock = this._document_body !== document.pointerLockElement;
            break;
        case _PL_MODE_MOZ:
            this.has_pointer_lock = this._document_body !== document.mozPointerLockElement;
            break;
        case _PL_MODE_WEBKIT:
            this.has_pointer_lock = this._document_body !== document.webkitPointerLockElement;
            break;
        }
        // TODO: Document this better.
        if (this.has_pointer_lock) {
            this.engine.pause_engine();
        }
    };

    this.pointer_lock_error = function(e) {
        //if (!this.is_feature_enabled(CLIENT_FEATURE_MOBILE)) {
        this.engine.fatal_error('Pointer lock error {' + e + '}!');
        //}
    };

    this.mouse_lock = function() {
        switch (this._pointer_lock_mode) {
        case _PL_MODE_DEFAULT:
            this._document_body.requestPointerLock();
            break;
        case _PL_MODE_MOZ:
            this._document_body.mozRequestPointerLock();
            break;
        case _PL_MODE_WEBKIT:
            this._document_body.webkitRequestPointerLock();
            break;
        }
    };

    this.mouse_release = function() {
        switch (this._pointer_lock_mode) {
        case _PL_MODE_DEFAULT:
            document.exitPointerLock();
            break;
        case _PL_MODE_MOZ:
            document.mozExitPointerLock();
            break;
        case _PL_MODE_WEBKIT:
            document.webkitExitPointerLock();
            break;
        }
    };

    if (this._document_body.requestPointerLock) {
        this._pointer_lock_mode = _PL_MODE_DEFAULT;
        document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), true);
        document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), true);
    } else if (this._document_body.mozRequestPointerLock) {
        this._pointer_lock_mode = _PL_MODE_MOZ;
        document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), true);
        document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), true);
    } else {
        this._pointer_lock_mode = _PL_MODE_WEBKIT;
        document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), true);
        document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), true);
    }

};
