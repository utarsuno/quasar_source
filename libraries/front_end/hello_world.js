import * as THREE from '../../applications/asset_server/js/node_modules/three';
import WebGLDetector        from './engine/extensions/detector2';
import DataStructureFlags31 from './data_structures/bitwise_flags_max_31';

const CACHE_ENGINE_FLAGS         = 0; // #pre-process_global_constant
const CACHE_ENGINE_WIDTH_INNER   = 1; // #pre-process_global_constant
const CACHE_ENGINE_HEIGHT_INNER  = 2; // #pre-process_global_constant
const CACHE_ENGINE_FRAME_COUNTER = 3; // #pre-process_global_constant

let EngineTest = function() {};
EngineTest.prototype.run_engine = WebGLDetector.run_engine;
Object.assign(
    EngineTest.prototype,
    DataStructureFlags31.lib_prototype, {

        // C A C H E D - I N T E G E R S.
        cached_ints     : new Uint32Array(4),

        left_click_timer: new THREE.Clock(),

        run_engine      : WebGLDetector.run_engine,

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

