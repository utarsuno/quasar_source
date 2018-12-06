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
const QECACHEF_ELAPSED_TIME_RENDER  = 10; // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_SECOND  = 11; // #pre-process_global_constant
const QECACHEF_ELAPSED_TIME_PAUSED  = 12; // #pre-process_global_constant


const QEFLAG_STATE_PAUSED            = 1;       // #pre-process_global_constant
const QEFLAG_STATE_RUNNING           = 2;       // #pre-process_global_constant
const QEFLAG_STATE_IN_TRANSITION     = 4;       // #pre-process_global_constant
const QEFLAG_STATE_POINTER_LOCK      = 8;       // #pre-process_global_constant
const QEFLAG_STATE_FULLSCREEN        = 16;      // #pre-process_global_constant
const QEFLAG_STATE_MOUSE_Y_DISABLED  = 32;      // #pre-process_global_constant
const QEFLAG_FEATURE_CANVAS          = 64;      // #pre-process_global_constant
const QEFLAG_FEATURE_WEBGL           = 128;     // #pre-process_global_constant
const QEFLAG_FEATURE_WEB_WORKERS     = 256;     // #pre-process_global_constant
const QEFLAG_FEATURE_MOBILE          = 512;     // #pre-process_global_constant
const QEFLAG_FEATURE_VR              = 1024;    // #pre-process_global_constant
const QEFLAG_FEATURE_FULL_SCREEN     = 2048;    // #pre-process_global_constant
const QEFLAG_FEATURE_POINTER_LOCK    = 4096;    // #pre-process_global_constant
const QEFLAG_FEATURE_SCROLLING       = 8192;    // #pre-process_global_constant
const QEFLAG_SETTING_AUDIO           = 16384;   // #pre-process_global_constant
const QEFLAG_SETTING_SHADERS         = 32768;   // #pre-process_global_constant
const QEFLAG_SETTING_FXAA            = 65536;   // #pre-process_global_constant
const QEFLAG_SETTING_OUTLINE         = 131072;  // #pre-process_global_constant
const QEFLAG_SETTING_GRAIN           = 262144;  // #pre-process_global_constant
const QEFLAG_SETTING_TRANSITION      = 524288;  // #pre-process_global_constant
const QEFLAG_SETTING_BACKGROUND_GRAY = 1048576; // #pre-process_global_constant
const QEFLAG_CSS_LOOKED_AT           = 2097152; // #pre-process_global_constant
const QEFLAG_CSS_HOVERED_ON          = 4194304; // #pre-process_global_constant

