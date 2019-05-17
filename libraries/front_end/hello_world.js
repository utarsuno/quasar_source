import * as THREE           from '../../applications/asset_server/js/node_modules/three';
import WebGLDetector        from './engine/extensions/detector2';
import DataStructureFlags31 from './data_structures/bitwise_flags_max_31';
import InputMouse           from './engine/input/mouse';

/* -- F L A G S -- I N T --
<RESERVED_FLAGS>: 0
WINDOW_WIDTH    : 1
WINDOW_HEIGHT   : 2
FRAME_COUNTER   : 3
MOUSE_X         : 4
MOUSE_Y         : 5
 */

/* -- F L A G S -- F L O A T S --
ASPECT_RATIO        : 3
FPS_PHYSICS         : 4
FPS_PAUSED          : 5
FPS_LOGIC           : 6
FPS_RENDER          : 7
ELAPSED_TIME_PHYSICS: 8
ELAPSED_TIME_LOGIC  : 9
ELAPSED_TIME_RENDER : 10
ELAPSED_TIME_SECOND : 11
ELAPSED_TIME_PAUSED : 12
 */

const CACHE_F_ENGINE_FOV                  = 0;  // #pre-process_global_constant
const CACHE_F_ENGINE_CLIPPING_NEAR        = 1;  // #pre-process_global_constant
const CACHE_F_ENGINE_CLIPPING_FAR         = 2;  // #pre-process_global_constant

const QEEVENT_ON_WINDOW_MOUSE_OVER  = 0; // #pre-process_global_constant
const QEEVENT_ON_POINTER_LOCK_ERROR = 1; // #pre-process_global_constant

const QEFLAG_STATE_PAUSED               = 1;       // #pre-process_global_constant
const QEFLAG_STATE_RUNNING              = 2;       // #pre-process_global_constant
const QEFLAG_STATE_IN_TRANSITION        = 4;       // #pre-process_global_constant
const QEFLAG_STATE_POINTER_LOCK         = 8;       // #pre-process_global_constant
const QEFLAG_STATE_FULLSCREEN           = 16;      // #pre-process_global_constant
const QEFLAG_STATE_MOUSE_Y_DISABLED     = 32;      // #pre-process_global_constant
const QEFLAG_FEATURE_CANVAS             = 64;      // #pre-process_global_constant
const QEFLAG_FEATURE_WEBGL              = 128;     // #pre-process_global_constant
const QEFLAG_FEATURE_WEB_WORKERS        = 256;     // #pre-process_global_constant
const QEFLAG_FEATURE_MOBILE             = 512;     // #pre-process_global_constant
const QEFLAG_FEATURE_VR                 = 1024;    // #pre-process_global_constant
const QEFLAG_FEATURE_FULL_SCREEN        = 2048;    // #pre-process_global_constant
const QEFLAG_FEATURE_POINTER_LOCK       = 4096;    // #pre-process_global_constant
const QEFLAG_FEATURE_SCROLLING          = 8192;    // #pre-process_global_constant
const QEFLAG_SETTING_AUDIO              = 16384;   // #pre-process_global_constant
const QEFLAG_SETTING_SHADERS            = 32768;   // #pre-process_global_constant
const QEFLAG_SETTING_FXAA               = 65536;   // #pre-process_global_constant
const QEFLAG_SETTING_OUTLINE            = 131072;  // #pre-process_global_constant
const QEFLAG_SETTING_GRAIN              = 262144;  // #pre-process_global_constant
const QEFLAG_SETTING_TRANSITION         = 524288;  // #pre-process_global_constant
const QEFLAG_SETTING_BACKGROUND_GRAY    = 1048576; // #pre-process_global_constant
const QEFLAG_CSS_LOOKED_AT              = 2097152; // #pre-process_global_constant
const QEFLAG_CSS_HOVERED_ON             = 4194304; // #pre-process_global_constant
const QEFLAG_STATE_WEB_SOCKET_CONNECTED = 8388608; // #pre-process_global_constant


let EngineTest = function() {
    // TODO: PERFORM THIS AFTER CHECKING IF REQUIRED FEATURES ARE ENABLED!
    this.set_dimensions();
    this.set_initial_frame_rates();
    this.clear_frames();

    // TODO: Auto-generate file with JS code placed in here.
};
EngineTest.prototype.run_engine = WebGLDetector.run_engine;
Object.assign(
    EngineTest.prototype,
    DataStructureFlags31.lib_prototype, {

        // C A C H E D - V E C T O R S.
        CACHE_ZERO_VECTOR: new THREE.Vector3(0, 0, 0),

        // C A C H E D - I N T E G E R S.
        cached_ints      : new Uint32Array(4),

        // C A C H E D - F L O A T S.
        cached_floats    : new Float64Array(13),

        // C A C H E D - C L O C K.
        left_click_timer : new THREE.Clock(),


        run_engine       : WebGLDetector.run_engine,

        /**
         * @returns {number}
         */
        get_width: function() {
            return this.cached_ints[1];
        },

        /**
         * @returns {number}
         */
        get_height: function() {
            return this.cached_ints[2];
        },

        clear_frames: function() {
            this.cached_floats[8]  = 0.0;
            this.cached_floats[9]  = 0.0;
            this.cached_floats[10] = 0.0;
            this.cached_floats[11] = 0.0;
            this.cached_ints[3]    = 0;
        },

        set_dimensions: function() {
            this.cached_ints[1]   = window.innerWidth;
            this.cached_ints[2]   = window.innerHeight;
            this.cached_floats[3] = window.innerWidth / window.innerHeight;
        },

        // I N I T.
        set_initial_frame_rates: function() {
            this.cached_floats[4] = 0.011111111111111112; // FPS is 90 (from 1.0 / 90.0).
            this.cached_floats[5] = 0.011111111111111112;
            this.cached_floats[7] = 0.016666666666666666; // FPS is 60 (from 1.0 / 60.0).
            this.cached_floats[6] = 0.03333333333333333;  // FPS is 30 (from 1.0 / 30.0).
        },

        // I N P U T.
        on_mouse_down: InputMouse.on_mouse_down,
        on_mouse_up  : InputMouse.on_mouse_up,
        on_mouse_move: InputMouse.on_mouse_move,
    }
);

let engine = new EngineTest();
console.log('Running the engine now!');

engine.flag_set_on(0);
engine.flag_set_on(2);
engine.flag_set_on(5);

console.log('Flag{0} - {' + engine.flag_is_on(0) + '}');
console.log('Flag{1} - {' + engine.flag_is_on(1) + '}');
console.log('Flag{2} - {' + engine.flag_is_on(2) + '}');
console.log('Flag{3} - {' + engine.flag_is_on(3) + '}');
console.log('Flag{4} - {' + engine.flag_is_on(4) + '}');
console.log('Flag{5} - {' + engine.flag_is_on(5) + '}');
console.log('Flag{6} - {' + engine.flag_is_on(6) + '}');
console.log('Running the engine now!');

engine.run_engine();
