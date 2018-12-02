'use strict';

const QECACHEI_WIDTH_INNER   = 0; // #pre-process_global_constant
const QECACHEI_WIDTH_OUTER   = 1; // #pre-process_global_constant
const QECACHEI_HEIGHT_INNER  = 2; // #pre-process_global_constant
const QECACHEI_HEIGHT_OUTER  = 3; // #pre-process_global_constant
const QECACHEI_FRAME_COUNTER = 4; // #pre-process_global_constant

const QECACHEF_FOV                  = 0;  // #pre-process_global_constant
const QECACHEF_CLIPPING_NEAR        = 1;  // #pre-process_global_constant
const QECACHEF_CLIPPING_FAR         = 2;  // #pre-process_global_constant
const QECACHEF_ASPECT_RATIO         = 3;  // #pre-process_global_constant
const QECACHEF_FPS_PHYSICS          = 4;  // #pre-process_global_constant
const QECACHEF_FPS_PAUSED           = 5;  // #pre-process_global_constant
const QECACHEF_FPS_LOGIC            = 6;  // #pre-process_global_constant
const QECACHEF_FPS_RENDER           = 7;  // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_PHYSICS = 8;  // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_LOGIC   = 9;  // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_RENDER  = 10;  // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_SECOND  = 11; // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_PAUSED  = 12; // #pre-process_global_constant


Object.assign($_QE.prototype, {

    _cachei: new Uint32Array(5),
    _cachef: new Float64Array(13),

    // Cached references.
    _cache_reference_document_body: document.body,

    CACHE_ZERO_VECTOR: new THREE.Vector3(0, 0, 0),
    //CACHE_UP_VECTOR: new THREE.Vector3(0, 1, 0),

    // Cache.
    _frames_passed  : 0,
    _frame_iteration: 0,
    _delta_clock    : new THREE.Clock(false),
    _delta          : 0,

    __init__cache: function() {
        this._cachef[QECACHEF_FPS_PHYSICS] = 0.011111111111111112; // FPS is 90 (from 1.0 / 90.0).
        this._cachef[QECACHEF_FPS_PAUSED]  = 0.011111111111111112;
        this._cachef[QECACHEF_FPS_RENDER]  = 0.016666666666666666; // FPS is 60 (from 1.0 / 60.0).
        this._cachef[QECACHEF_FPS_LOGIC]   = 0.03333333333333333;  // FPS is 30 (from 1.0 / 30.0).
        this._clear_frames();
    },

    set_width: function(w) {
        this._cachei[QECACHEI_WIDTH_INNER] = w;
    },

    get_width: function() {
        return this._cachei[QECACHEI_WIDTH_INNER];
    },

    get_height: function() {
        return this._cachei[QECACHEI_HEIGHT_INNER];
    },

    set_height: function(h) {
        this._cachei[QECACHEI_HEIGHT_INNER] = h;
    },

    // TEMPORARY LOCATION:
    _get_number_of_cpu_cores: function() {
        // Number of logical processors.
        return window.navigator.hardwareConcurrency;
    },

});
