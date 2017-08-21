var scene = new THREE.Scene();

// Variables for documentation purposes. This design will probably eventually change.
var field_of_view = 90;
var window_width  = window.innerWidth;
var window_height = window.innerHeight;
var aspect_ratio  = window_width / window_height;
var near_clipping = 0.1;
var far_clipping  = 1000;

var camera = new THREE.PerspectiveCamera(field_of_view, aspect_ratio, near_clipping, far_clipping);

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window_width, window_height);

document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};

animate();
