import * as THREE from '../../applications/asset_server/js/node_modules/three';
import WebGLDetector        from './engine/extensions/detector2';
import DataStructureFlags31 from './data_structures/bitwise_flags_max_31';
import InputMouse           from './engine/input/mouse';

const CACHE_ENGINE_FLAGS         = 0; // #pre-process_global_constant
const CACHE_ENGINE_WIDTH_INNER   = 1; // #pre-process_global_constant
const CACHE_ENGINE_HEIGHT_INNER  = 2; // #pre-process_global_constant
const CACHE_ENGINE_FRAME_COUNTER = 3; // #pre-process_global_constant
const CACHE_ENGINE_MOUSE_X       = 4; // #pre-process_global_constant
const CACHE_ENGINE_MOUSE_Y       = 5; // #pre-process_global_constant

const CACHE_F_ENGINE_FOV                  = 0;  // #pre-process_global_constant
const CACHE_F_ENGINE_CLIPPING_NEAR        = 1;  // #pre-process_global_constant
const CACHE_F_ENGINE_CLIPPING_FAR         = 2;  // #pre-process_global_constant
const CACHE_F_ENGINE_ASPECT_RATIO         = 3;  // #pre-process_global_constant
const CACHE_F_ENGINE_FPS_PHYSICS          = 4;  // #pre-process_global_constant
const CACHE_F_ENGINE_FPS_PAUSED           = 5;  // #pre-process_global_constant
const CACHE_F_ENGINE_FPS_LOGIC            = 6;  // #pre-process_global_constant
const CACHE_F_ENGINE_FPS_RENDER           = 7;  // #pre-process_global_constant
const CACHE_F_ENGINE_ELAPSED_TIME_PHYSICS = 8;  // #pre-process_global_constant
const CACHE_F_ENGINE_ELAPSED_TIME_LOGIC   = 9;  // #pre-process_global_constant
const CACHE_F_ENGINE_ELAPSED_TIME_RENDER  = 10; // #pre-process_global_constant
const CACHE_F_ENGINE_ELAPSED_TIME_SECOND  = 11; // #pre-process_global_constant
const CACHE_F_ENGINE_ELAPSED_TIME_PAUSED  = 12; // #pre-process_global_constant

let EngineTest = function() {
    // TODO: PERFORM THIS AFTER CHECKING IF REQUIRED FEATURES ARE ENABLED!
    this.set_dimensions();
    this.cached_floats[CACHE_F_ENGINE_FPS_PHYSICS] = 0.011111111111111112; // FPS is 90 (from 1.0 / 90.0).
    this.cached_floats[CACHE_F_ENGINE_FPS_PAUSED]  = 0.011111111111111112;
    this.cached_floats[CACHE_F_ENGINE_FPS_RENDER]  = 0.016666666666666666; // FPS is 60 (from 1.0 / 60.0).
    this.cached_floats[CACHE_F_ENGINE_FPS_LOGIC]   = 0.03333333333333333;  // FPS is 30 (from 1.0 / 30.0).
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

        set_dimensions: function() {
            this.cached_ints[CACHE_ENGINE_WIDTH_INNER]      = window.innerWidth;
            this.cached_ints[CACHE_ENGINE_HEIGHT_INNER]     = window.innerHeight;
            this.cached_floats[CACHE_F_ENGINE_ASPECT_RATIO] = window.innerWidth / window.innerHeight;
        },

        /**
         * @returns {number}
         */
        get_width: function() {
            return this.cached_ints[CACHE_ENGINE_WIDTH_INNER];
        },

        /**
         * @returns {number}
         */
        get_height: function() {
            return this.cached_ints[CACHE_ENGINE_HEIGHT_INNER];
        },

        clear_frames: function() {
            this.cached_floats[CACHE_F_ENGINE_ELAPSED_TIME_PHYSICS] = 0.0;
            this.cached_floats[CACHE_F_ENGINE_ELAPSED_TIME_LOGIC]   = 0.0;
            this.cached_floats[CACHE_F_ENGINE_ELAPSED_TIME_RENDER]  = 0.0;
            this.cached_floats[CACHE_F_ENGINE_ELAPSED_TIME_SECOND]  = 0.0;
            this.cached_ints[CACHE_ENGINE_FRAME_COUNTER]            = 0;
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

