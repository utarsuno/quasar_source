import * as THREE           from '../../applications/asset_server/js/node_modules/three';
import DataStructureFlags31 from './data_structures/bitwise_flags_max_31';
import InputMouse           from './engine/input/mouse';


/* -- F L A G S -- I N T --
<RESERVED_FLAGS>: 0
WINDOW_WIDTH    : 1
WINDOW_HEIGHT   : 2
FRAME_COUNTER   : 3
MOUSE_X         : 4
MOUSE_Y         : 5

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

// THREE defaults.
THREE.Cache.enabled                    = true;
THREE.Object3D.DefaultMatrixAutoUpdate = false;


let Engine = function() {
    let self = this;




    let main_canvas = document.getElementById('a');

    this.hud = document.getElementById('b');
    this.hud_context = this.hud.getContext('2d');
    this.hud_context.beginPath();
    this.hud_context.arc(150,150,50,0,2*Math.PI);
    this.hud_context.stroke();

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );



    this.renderer = new THREE.WebGLRenderer({canvas: main_canvas, context: main_canvas.getContext('webgl2')});
    //renderer.setClearColor(0xffffff, 1);

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    this.animate = function () {
        requestAnimationFrame( self.animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        self.renderer.render( scene, camera );
    };

    this.animate();










    // E V E N T {window resize}
    window.addEventListener('resize', function(event) {
        event.preventDefault();
        //event.stopPropagation();
        // TODO: Eventually throttle this event (only execute once no event is no longer sent for longer than 200 ms?).
        self.cached_ints[1]   = window.innerWidth;
        self.cached_ints[2]   = window.innerHeight;
        self.cached_floats[3] = window.innerWidth / window.innerHeight;
        //self._update_renderer_dimensions();

        console.log('On resize!');
        self.renderer.setSize(self.cached_ints[1], self.cached_ints[2]);

        self.hud.width  = self.cached_ints[1];
        self.hud.height = self.cached_ints[2];

        self.hud_context.beginPath();
        self.hud_context.arc(150,150,50,0,2*Math.PI);
        self.hud_context.stroke();

        return false;
    }, true);
};
Engine.prototype = {
    // C A C H E D - I N T E G E R S.
    cached_ints      : new Uint32Array(4),

    // C A C H E D - F L O A T S.
    cached_floats    : new Float64Array(13),
};


let engine = new Engine();


// TODO: LATER, WINDOW ONLOAD MUST BE ON THE APPLICATION SIDE, NOT ENGINE SIDE!
//window.onload = function() {
//    NL = new $_NL();
//    QE = new $_QE(NL, $_NL.prototype.WorldDevTools);
//};

/*
let init_engine_flags = function() {
    // Default rendering settings.
    this.flag_set_on(QEFLAG_SETTING_AUDIO | QEFLAG_SETTING_SHADERS | QEFLAG_SETTING_FXAA | QEFLAG_SETTING_OUTLINE | QEFLAG_SETTING_GRAIN | QEFLAG_SETTING_TRANSITION);
    // Required web features.
    this.flag_set(QEFLAG_FEATURE_CANVAS      , !!window.CanvasRenderingContext2D);
    this.flag_set(QEFLAG_FEATURE_WEBGL       , !!window.WebGLRenderingContext);
    // Optional web features.
    this.flag_set(QEFLAG_FEATURE_WEB_WORKERS , !!window.Worker);
    this.flag_set(QEFLAG_FEATURE_VR          , navigator.getVRDisplays != null && navigator.getVRDisplays().length !== 0);
    this.flag_set(QEFLAG_FEATURE_FULL_SCREEN , !!document.webkitCancelFullScreen || !!document.mozCancelFullScreen);
    this.flag_set(QEFLAG_FEATURE_POINTER_LOCK, 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document);
    this.flag_set(QEFLAG_FEATURE_SCROLLING   , 'onwheel' in document || 'onmousehweel' in document);
    // From : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
    this.flag_set(QEFLAG_FEATURE_MOBILE      , /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
};

 */