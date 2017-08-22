'use strict'

var scene = new THREE.Scene()

var stats_api = new StatsAPI()

// Variables for documentation purposes. This design will probably eventually change.
var field_of_view = 90
var window_width  = window.innerWidth
var window_height = window.innerHeight
var aspect_ratio  = window_width / window_height
var near_clipping = 0.1
var far_clipping  = 1000

var camera   = new THREE.PerspectiveCamera(field_of_view, aspect_ratio, near_clipping, far_clipping)

var renderer = new THREE.WebGLRenderer()

renderer.setSize(window_width, window_height)

document.body.appendChild(renderer.domElement)
stats_api.add_to_document(document)

var geometry = new THREE.BoxGeometry( 1, 1, 1 )
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
var cube 	 = new THREE.Mesh(geometry, material)
scene.add(cube)

// Going to try to create a plane here.
var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
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

// Handle window re-sizing.
var onWindowResize = function() {
    window_width  = window.innerWidth
    window_height = window.innerHeight
    aspect_ratio  = window_width / window_height
    camera.aspect = aspect_ratio
    camera.updateProjectionMatrix()
    renderer.setSize(window_width, window_height)
}
window.addEventListener('resize', onWindowResize, false)


var animate = function () {
    requestAnimationFrame(animate)

    stats_api.pre_render()

    cube.rotation.x += 0.1
    cube.rotation.y += 0.1

    renderer.render(scene, camera)

    stats_api.post_render()
}

animate()
