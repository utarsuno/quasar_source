'use strict'

var renderer  = new RendererAPI()
if (renderer.is_webgl_enabled() === false) {
    console.log('WebGL is not enabled!')
    throw new Error('WebGL is not enabled!')
}
var stats_api = new StatsAPI()
var scene = new THREE.Scene()
var camera   = new THREE.PerspectiveCamera(renderer.field_of_view, renderer.aspect_ratio, renderer.near_clipping, renderer.far_clipping)
renderer.set_camera(camera)
var fps_controls = new FPSControls(camera)
scene.add(fps_controls.get_object())

// Custom object.
var pointer_lock_api = new PointerLockAPI(fps_controls)

var geometry = new THREE.BoxGeometry( 1, 1, 1 )
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
var cube 	 = new THREE.Mesh(geometry, material)
scene.add(cube)

// Going to try to create a plane here.
var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true})
var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane_mesh)

camera.position.z = 10

// Add lights.
var light = new THREE.DirectionalLight( 0xffffff, 1.5 )
light.position.set(1, 1, 1 )
scene.add(light)
var light2 = new THREE.DirectionalLight( 0xffffff, 0.75 )
light2.position.set(-1, - 0.5, -1)
scene.add(light2)

var previous_time = performance.now()

var animate = function () {
    requestAnimationFrame(animate)

    stats_api.pre_render()

    cube.rotation.x += 0.1
    cube.rotation.y += 0.1

    var time = performance.now()
    var delta = (time - previous_time) / 1000

    fps_controls.physics(delta)

    renderer.render(scene, camera)

    stats_api.post_render()

    previous_time = time
}

animate()

