'use strict'

var renderer_api  = new RendererAPI()
if (renderer_api.is_webgl_enabled() === false) {
    console.log('WebGL is not enabled!')
    throw new Error('WebGL is not enabled!')
}
var stats_api = new StatsAPI()
var scene = new THREE.Scene()
var camera   = new THREE.PerspectiveCamera(renderer_api.field_of_view, renderer_api.aspect_ratio, renderer_api.near_clipping, renderer_api.far_clipping)
renderer_api.set_camera(camera)
var fps_controls = new FPSControls(camera)
scene.add(fps_controls.get_object())

var pointer_lock_api = new PointerLockAPI(fps_controls)

var geometry = new THREE.BoxGeometry(5,5, 5)
//var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
var cube 	 = new THREE.Mesh(geometry, material)
scene.add(cube)

// Going to try to create a plane here.
var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
//var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane_mesh)

camera.position.z = 10

// Line test.
var line_material = new THREE.LineBasicMaterial({color: LIGHT_GREEN, opacity: 1, linewidth: 5})
var line_geometry = new THREE.Geometry()
geometry.vertices.push(new THREE.Vector3(-100, 0, 0))
geometry.vertices.push(new THREE.Vector3(0, 100, 0))
geometry.vertices.push(new THREE.Vector3(0, 0, 0))
geometry.vertices.push(new THREE.Vector3(50, 50, 50))
var line = new THREE.Line(line_geometry, line_material)

scene.add(line)

//

var geometry3 = new THREE.Geometry(),
    points = hilbert3D( new THREE.Vector3( 0,0,0 ), 200.0, 2, 0, 1, 2, 3, 4, 5, 6, 7 ),
    colors3 = []
for ( i = 0; i < points.length; i ++ ) {
    geometry3.vertices.push( points[ i ] )
    colors3[ i ] = new THREE.Color( 0xffffff )
    colors3[ i ].setHSL( i / points.length, 1.0, 0.5 )
}
geometry3.colors = colors3
// lines
material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors } )
var line, p, scale = 0.3, d = 225
line = new THREE.Line(geometry3, material )
line.scale.x = line.scale.y = line.scale.z =  scale*1.5
line.position.x = 0
line.position.y = 0
line.position.z = 0
scene.add( line )
//

// Add lights.
var ambiColor = '#cbe7ff'
var ambientLight = new THREE.AmbientLight(ambiColor, .2)
scene.add(ambientLight)
/*
var light = new THREE.DirectionalLight( 0xffffff, 1.5 )
light.position.set(1, 1, 1 )
scene.add(light)s


var light2 = new THREE.DirectionalLight( 0xffffff, 0.75 )
light2.position.set(-1, - 0.5, -1)
scene.add(light2)
*/

var data_display = new DataDisplay(fps_controls)


var light3 = new THREE.PointLight(0xccffcc, 1, 1000)
light3.position.set(5, 15, 5)
scene.add(light3)


//var shader_api = new ShaderAPI(renderer_api, scene, camera)


var previous_time = performance.now()

var animate = function () {

    //shader_api.render()

    requestAnimationFrame(animate)

    stats_api.pre_render()

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    var time = performance.now()
    var delta = (time - previous_time) / 1000

    fps_controls.physics(delta)
    data_display.update()

    renderer_api.render(scene, camera)

    stats_api.post_render()

    previous_time = time
}

animate()

