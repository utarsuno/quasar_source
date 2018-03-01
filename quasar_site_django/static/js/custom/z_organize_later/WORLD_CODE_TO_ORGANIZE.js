    // TODO : Logically abstract the YouTube video creater!

    // Base code from : https://codepen.io/asjas/pen/pWawPm
    var Element = function ( id, x, y, z, ry ) {

        l('Creating element!');

        var div = document.createElement( 'div' );
        div.style.width = '480px'; // was 480
        div.style.height = '360px'; // was 360
        div.style.backgroundColor = '#000';
        var iframe = document.createElement('iframe');
        iframe.style.width = '480px';
        iframe.style.height = '360px';
        iframe.style.border = '0px';
        iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join( '' );
        div.appendChild(iframe);
        var object = new THREE.CSS3DObject(div);
        object.position.set(x, y, z);
        object.rotation.y = ry;
        return object;
    };

    this.add_css_scene = function() {
        this.css_scene = new THREE.Scene();

        this.container = document.getElementById('container');

        this.group = new THREE.Group();

        this.group.add(new Element('xBOqwRRj82A', 0, 0, 240, 0 ) );
        this.group.add(new Element('x4q86IjJFag', 240, 0, 0, Math.PI / 2 ) );
        this.group.add(new Element('JhngfOK_2-0', 0, 0, - 240, Math.PI ) );
        this.group.add(new Element('Grg3461lAPg', - 240, 0, 0, - Math.PI / 2 ) );

        this.css_scene.add(this.group);

        this.container.appendChild(MANAGER_RENDERER.css_renderer.domElement);
    };