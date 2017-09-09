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

var create_css_page = function(width, height, position, rotation, text) {
    // Create the CSS object.
    var html = '<div id="math_formulas" style="width:' + width + 'px; height:' + height + 'px;"><p>' + text + '</p></div>'
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
//scene.add(cube)


// Going to try to create a plane here.
var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
//var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: false})
var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane_mesh)


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



//var css_renderer_api = new CSSRendererAPI()



var cssScene = new THREE.Scene()


var math_formulas = document.getElementById('math_formulas')

var element = document.createElement('div')
element.innerHTML = 'Plain text inside a div.'
element.className = 'three-div'


// Create a test plane.
var p_width = 100
var p_height = 100
var p_position = new THREE.Vector3(20, 30, -30)
var p_rotation = new THREE.Vector3(0, 0, 0)
var test_plane = create_plane(p_width, p_height, p_position, p_rotation)
//scene.add(test_plane)
//var test_css_plane = create_css_page(p_width, p_height, p_position, p_rotation, '`b^x=c^(xlog_cb)`')
//cssScene.add(test_css_plane)

// Second test plane.
var p_width2 = 200
var p_height2 = 200
var p_position2 = new THREE.Vector3(20, 30, -60)
var p_rotation2 = new THREE.Vector3(0, 0, 0)
var test_plane2 = create_plane(p_width2, p_height2, p_position2, p_rotation2)
//scene.add(test_plane2)
//var test_css_plane2 = create_css_page(p_width2, p_height2, p_position2, p_rotation2, '`log_bx=(log_cx)/(log_cb)`')
//cssScene.add(test_css_plane2)



//var light4 = new THREE.HemisphereLight(0xffbf67, 0x15c6ff, .3)
//scene.add(light4)

//scene.add(css_object)
//cssScene.add(css_object)

// @@@@
//css_renderer_api.renderer.domElement.appendChild(renderer_api.renderer.domElement)
//document.body.appendChild(css_renderer_api.renderer.domElement)
// @@@@
document.body.appendChild(renderer_api.renderer.domElement)

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// Add lights.
//var ambiColor = '#cbe7ff'
//var ambientLight = new THREE.AmbientLight(ambiColor, .2)
//scene.add(ambientLight)
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

//

var world  = new World(scene)
var client = new Client(world)


setInterval(function() {
    var data = fps_controls.get_position().x + '|' + fps_controls.get_position().z
    client.send_data(data)
}, 500)



var loader = new THREE.FontLoader()
loader.load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/font/helvetiker_regular.typeface.json', function(tex){
    var  textGeo = new THREE.TextGeometry('Test', {
        size: 100,
        height: 5,
        curveSegments: 2,
        font: tex
    })
    var  color = new THREE.Color()
    color.setRGB(50, 50, 50)
    var  textMaterial = new THREE.MeshLambertMaterial({ color: color })
    var  text = new THREE.Mesh(textGeo, textMaterial)
    scene.add(text)
})
//


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

var text_position = new THREE.Vector3(40, 40, 100)
var text_rotation = new THREE.Vector3(0, 0, 0)
var text_plane = new PlaneAPI(200, 100, text_position, text_rotation)
text_plane.create_dynamic_text('Hello Worlddddddddddd', scene)



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


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

    renderer_api.renderer.render(scene, camera)
    //css_renderer_api.renderer.render(cssScene, camera)

    stats_api.post_render()

    previous_time = time
}

animate()

