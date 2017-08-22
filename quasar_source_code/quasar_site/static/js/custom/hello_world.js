'use strict'

var scene = new THREE.Scene()

var stats_api = new StatsAPI()
stats_api.initialize()

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
var plane_geometry = new THREE.PlaneGeometry(300, 300)
var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane_mesh)

camera.position.z = 10

var animate = function () {
	requestAnimationFrame(animate)

	stats_api.pre_render()

	cube.rotation.x += 0.1
	cube.rotation.y += 0.1

	renderer.render(scene, camera)

	stats_api.post_render()
}

animate()
