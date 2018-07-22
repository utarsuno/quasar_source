'use strict';

$_QE.prototype.ClientFunctionalityPointerLock = function() {

    this.has_pointer_lock = false;

    this._document_body = document.body;

    this.pointer_lock_change = function () {
        if (document.pointerLockElement !== this._document_body && document.mozPointerLockElement !== this._document_body && document.webkitPointerLockElement !== this._document_body) {
            QE.player.set_state(PLAYER_STATE_PAUSED);
            this.has_pointer_lock = true;
        } else {
            this.has_pointer_lock = false;
        }
    };

    this.pointer_lock_error = function(e) {
        if (!this.is_mobile()) {
            raise_exception_with_full_logging('Pointer lock error {' + e + '}!');
        }
    };

    this.request_pointer_lock = function() {
        this._document_body.requestPointerLock = this._document_body.requestPointerLock || this._document_body.mozRequestPointerLock || this._document_body.webkitRequestPointerLock;
        this._document_body.requestPointerLock();
    };

    this.release_pointer_lock = function() {
        document.exitPointerLock();
    };

    // Hook pointer lock state change events.
    document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), true);
    document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), true);
    document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), true);
    // Hook pointer lock error events.
    document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), true);
    document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), true);
    document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), true);
};