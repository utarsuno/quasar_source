'use strict'

var create_plane = function(width, height, position, rotation) {
    var material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.0,
        side: THREE.DoubleSide
    })
    var geometry = new THREE.PlaneGeometry(width, height)
    var mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = position.x
    mesh.position.y = position.y
    mesh.position.z = position.z
    mesh.rotation.x = rotation.x
    mesh.rotation.y = rotation.y
    mesh.rotation.z = rotation.z
    return mesh
}

var create_css_page = function(width, height, position, rotation) {
    // Create the CSS object.
    var html = '<div id="math_formulas" style="width:' + width + 'px; height:' + height + 'px;"><p>`b^x=c^(log_cb)`</p></div>'
    var div = document.createElement('div')
    div.innerHTML = html
    var css_object = new THREE.CSS3DObject(div)
    css_object.position.x = position.x
    css_object.position.y = position.y
    css_object.position.z = position.z
    css_object.rotation.x = rotation.x
    css_object.rotation.y = rotation.y
    css_object.rotation.z = rotation.z

    return css_object
}


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
var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: false})
var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane_mesh)


/*
var log_geometry = new THREE.PlaneGeometry(50, 50, 100, 100)
//log_geometry.applyMatrix(new THREE.Matrix4().makeRotationY(- Math.PI / 2))
var log_material = new THREE.MeshBasicMaterial({color: 0xccffcc, wireframe: true})
//var log_material = new THREE.MeshBasicMaterial()
//log_material.color.set('black')
//log_material.opacity   = 0
//log_material.blending  = THREE.NoBlending
var log_mesh = new THREE.Mesh(log_geometry, log_material)
scene.add(log_mesh)
*/

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



var css_renderer_api = new CSSRendererAPI()



var cssScene = new THREE.Scene()


var math_formulas = document.getElementById('math_formulas')

var element = document.createElement('div')
element.innerHTML = 'Plain text inside a div.'
element.className = 'three-div'


// Create a test plane.
var p_width = 100
var p_height = 100
var p_position = new THREE.Vector3(20, 30, 30)
var p_rotation = new THREE.Vector3(0, Math.PI / 2, 0)
var test_plane = create_plane(p_width, p_height, p_position, p_rotation)
scene.add(test_plane)
var test_css_plane = create_css_page(p_width, p_height, p_position, p_rotation)
cssScene.add(test_css_plane)

/*
//var css_object = new THREE.CSS3DObject(math_formulas)
var css_object = new THREE.CSS3DObject(element)

css_object.position.x = log_mesh.position.x
css_object.position.y = log_mesh.position.y
css_object.position.z = log_mesh.position.z

css_object.rotation.x = log_mesh.rotation.x
css_object.rotation.y = log_mesh.rotation.y
css_object.rotation.z = log_mesh.rotation.z
*/


//var light4 = new THREE.HemisphereLight(0xffbf67, 0x15c6ff, .3)
//scene.add(light4)

//scene.add(css_object)
//cssScene.add(css_object)

// @@@@
css_renderer_api.renderer.domElement.appendChild(renderer_api.renderer.domElement)
document.body.appendChild(css_renderer_api.renderer.domElement)
// @@@@

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//camera.position.z = 10

/*
// Line test.
var line_material = new THREE.LineBasicMaterial({color: LIGHT_GREEN, opacity: 1, linewidth: 50})
var line_geometry = new THREE.Geometry()
line_geometry.vertices.push(new THREE.Vector3(-100, 0, 0))
line_geometry.vertices.push(new THREE.Vector3(0, 100, 0))
line_geometry.vertices.push(new THREE.Vector3(0, 0, 0))
line_geometry.vertices.push(new THREE.Vector3(50, 50, 50))
var line = new THREE.Line(line_geometry, line_material)
scene.add(line)
*/

// Add lights.
var ambiColor = '#cbe7ff'
var ambientLight = new THREE.AmbientLight(ambiColor, .4)
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

var iii = 0

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

    //css_renderer_api.renderer.render(cssScene, camera)
    //renderer_api.render(scene, camera)
    renderer_api.renderer.render(scene, camera)
    css_renderer_api.renderer.render(cssScene, camera)

    stats_api.post_render()

    previous_time = time
}

animate()

