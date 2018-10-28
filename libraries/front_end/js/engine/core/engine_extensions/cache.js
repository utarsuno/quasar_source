'use strict';

const ENGINE_CACHE_WIDTH_INNER          = 0;  // #pre-process_global_constant
const ENGINE_CACHE_WIDTH_OUTER          = 1;  // #pre-process_global_constant
const ENGINE_CACHE_HEIGHT_INNER         = 2;  // #pre-process_global_constant
const ENGINE_CACHE_HEIGHT_OUTER         = 3;  // #pre-process_global_constant

const ENGINE_CACHE_POINTER_LOCK_MODE    = 4;  // #pre-process_global_constant

const ENGINE_CACHE_FRAME_COUNTER        = 5;  // #pre-process_global_constant

const ENGINE_FLOAT_FOV                  = 0;  // #pre-process_global_constant
const ENGINE_FLOAT_CLIPPING_NEAR        = 1;  // #pre-process_global_constant
const ENGINE_FLOAT_CLIPPING_FAR         = 2;  // #pre-process_global_constant
const ENGINE_FLOAT_ASPECT_RATIO         = 3;  // #pre-process_global_constant

const ENGINE_FLOAT_FPS_PHYSICS          = 4;  // #pre-process_global_constant
const ENGINE_FLOAT_FPS_LOGIC            = 5;  // #pre-process_global_constant
const ENGINE_FLOAT_FPS_RENDER           = 6;  // #pre-process_global_constant
const ENGINE_FLOAT_ELAPSED_TIME_PHYSICS = 7;  // #pre-process_global_constant
const ENGINE_FLOAT_ELAPSED_TIME_LOGIC   = 8;  // #pre-process_global_constant
const ENGINE_FLOAT_ELAPSED_TIME_RENDER  = 9;  // #pre-process_global_constant
const ENGINE_FLOAT_ELAPSED_TIME_SECOND  = 10; // #pre-process_global_constant


Object.assign($_QE.prototype, {

    _cache_values: new Uint32Array(6),
    _cache_floats: new Float64Array(11),

    // Cached references.
    _cache_reference_document_body: document.body,

    CACHE_ZERO_VECTOR: new THREE.Vector3(0, 0, 0),
    //CACHE_UP_VECTOR: new THREE.Vector3(0, 1, 0),

    // Cache.
    _frames_passed  : 0,
    _frame_iteration: 0,
    _delta_clock    : new THREE.Clock(false),
    _delta          : 0,

    _initialize_cache: function() {
        this._cache_floats[ENGINE_FLOAT_FPS_PHYSICS] = 0.011111111111111112; // FPS is 90 (from 1.0 / 90.0).
        this._cache_floats[ENGINE_FLOAT_FPS_RENDER]  = 0.016666666666666666; // FPS is 60 (from 1.0 / 60.0).
        this._cache_floats[ENGINE_FLOAT_FPS_LOGIC]   = 0.03333333333333333;  // FPS is 30 (from 1.0 / 30.0).
        this._clear_frames();
    },

});
