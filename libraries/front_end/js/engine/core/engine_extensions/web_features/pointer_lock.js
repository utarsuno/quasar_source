'use strict';

const _PL_MODE_DEFAULT = 0; // #pre-process_global_constant
const _PL_MODE_MOZ     = 1; // #pre-process_global_constant
const _PL_MODE_WEBKIT  = 2; // #pre-process_global_constant


Object.assign(
    $_QE.prototype,
    {
        _set_binding_pointer_lock: function() {
            this.set_flag_off(ENGINE_STATE_POINTER_LOCKED);

            if (this._cache_reference_document_body.requestPointerLock) {
                this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE] = _PL_MODE_DEFAULT;
                document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), true);
                document.addEventListener('pointerlockerror' , this.pointer_lock_error.bind(this), true);
            } else if (this._cache_reference_document_body.mozRequestPointerLock) {
                this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE] = _PL_MODE_MOZ;
                document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), true);
                document.addEventListener('mozpointerlockerror' , this.pointer_lock_error.bind(this), true);
            } else {
                this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE] = _PL_MODE_WEBKIT;
                document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), true);
                document.addEventListener('webkitpointerlockerror' , this.pointer_lock_error.bind(this), true);
            }
        },

        pointer_lock_change: function () {
            //l('pointer_lock_change! Value was {' + this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE] + '}!');

            switch (this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE]) {
            case _PL_MODE_DEFAULT:
                this.set_flag(ENGINE_STATE_POINTER_LOCKED, this._cache_reference_document_body !== document.pointerLockElement);
                break;
            case _PL_MODE_MOZ:
                this.set_flag(ENGINE_STATE_POINTER_LOCKED, this._cache_reference_document_body !== document.mozPointerLockElement);
                break;
            case _PL_MODE_WEBKIT:
                this.set_flag(ENGINE_STATE_POINTER_LOCKED, this._cache_reference_document_body !== document.webkitPointerLockElement);
                break;
            }
            //if (this.get_flag(ENGINE_STATE_POINTER_LOCKED)) {
            // TODO: Document this better.
            if (this.get_flag(ENGINE_STATE_POINTER_LOCKED)) {
                //l('Pausing the engine?');
                this.pause_engine();
            }

            //l('Value is {' + this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE] + '}!');
        },

        pointer_lock_error: function(e) {
            //if (!this.is_feature_enabled(CLIENT_FEATURE_MOBILE)) {
            this.fatal_error('Pointer lock error {' + e + '}!');
            //}
        },

        mouse_lock: function() {
            switch (this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE]) {
            case _PL_MODE_DEFAULT:
                this._cache_reference_document_body.requestPointerLock();
                break;
            case _PL_MODE_MOZ:
                this._cache_reference_document_body.mozRequestPointerLock();
                break;
            case _PL_MODE_WEBKIT:
                this._cache_reference_document_body.webkitRequestPointerLock();
                break;
            }
        },

        mouse_release: function() {
            switch (this._cache_values[ENGINE_CACHE_POINTER_LOCK_MODE]) {
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
        },
    }
);

