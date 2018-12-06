'use strict';

$_QE.prototype.DemoWorld = function(engine) {
    this.init_world('Demo', ASSET_ICON_PLANET, engine);

    this.set_world_enter_default_position(new THREE.Vector3(2000, 1000, 6750));
    this.set_world_enter_default_normal(new THREE.Vector3(.70, .02, -.72));
    //this.set_on_world_enter(QE.player.set_to_walking.bind(QE.player));
    //this.set_on_world_exit(QE.player.set_to_flying.bind(QE.player));

    this.set_on_world_enter(function() {
        QE.manager_world._singleton_ambient.group.intensity = .15;
    }.bind(this));

    this.needed_singletons = [
        SINGLETON_AMBIENT_LIGHT, SINGLETON_SKY_BOX_SPACE,
        SINGLETON_DEMO_ROOM,
        //SINGLETON_FLASH_LIGHT, SINGLETON_TARGET_OF_FLASH_LIGHT,
        SINGLETON_PLAYER_MENU, SINGLETON_PLAYER
    ];
};

Object.assign(
    $_QE.prototype.DemoWorld.prototype,
    $_QE.prototype.World.prototype,
    {
        update: function(delta) {
        },

        _load: function() {
            this.demo_room = new $_QE.prototype.DemoRoom([
                [0, 4],
                [1, 4],
                [2, 4],
                [3, 4],
                [4, 4],
                [5, 4],

                [0, 3],
                [1, 3],
                [2, 3],
                [3, 3],
                [4, 3],
                [5, 3],

                [1, 2],
                [1, 1],
                [1, 0],

                [2, 2],
                [2, 1],
                [2, 0],


            ], [1, 0], this, SINGLETON_DEMO_ROOM);

            /*
            this.logs = new $_NL.prototype.FloatingTerminal(16, QE.FONT_ARIAL_32, 'Text Wall');
            this.create_and_add_element_to_root(this.logs);
            this.logs.set_position_center(0, 0, -980, 0, -512, 0, true);
            this.logs.add_message('click - teleport in front');
            this.logs.add_message('double click - engage');
            this.logs.add_message('standard text editor');
            this.logs.add_message('😒 emoji support too');
            */

            //let url		= 'https://en.wikipedia.org/wiki/Main_Page';
            //let url		= 'http://quasarsource.com:1338';
            let url = 'fo2F0UjcWNk';

            /*
            this.__c = this.createCssObject(1800, 1200, new THREE.Vector3(5000, 1024, 800), new THREE.Vector3(0, 1024, 800), url);
            QE.css_scene.add(this.__c);
            this.__c2 = this.createCssObject(1800, 1200, new THREE.Vector3(5000, 1024, 3000), new THREE.Vector3(0, 1024, 3000), 'https://en.wikipedia.org/wiki/Main_Page');
            QE.css_scene.add(this.__c2);
            */

            //this.__c3 = this.create_youtube_video('1280px', '720px', new THREE.Vector3(5000, 1024, 800), new THREE.Vector3(0, 1024, 800), url);
            //QE.css_scene.add(this.__c3);

            this.video = new $_QE.prototype.FloatingCSSWall({
                ARG_WIDTH                 : 1280,
                ARG_HEIGHT                : 720,
                ARG_URL                   : url,
                ARG_INITIAL_POSITION      : new THREE.Vector3(5000, 1024, 800),
                ARG_INITIAL_LOOK_AT       : new THREE.Vector3(0, 1024, 800),
                ARG_CREATE_AND_ADD_TO_ROOT: this,
                ARG_CSS_VIDEO             : true,
            });

            /*
            this.website = new $_QE.prototype.FloatingCSSWall({
                ARG_URL: 'https://github.com/utarsuno/quasar_source',
                ARG_WIDTH                 : 1024 + 256,
                ARG_HEIGHT                : 1024 - 256,
                ARG_INITIAL_POSITION      : new THREE.Vector3(5000, 1024, 2400),
                ARG_INITIAL_LOOK_AT       : new THREE.Vector3(0, 1024, 2400),
                ARG_CREATE_AND_ADD_TO_ROOT: this,
                ARG_CSS_WEBSITE           : true,
            });*/

            /*
            this.website = new $_QE.prototype.FloatingCSSWall({
                ARG_WIDTH                 : 980,
                ARG_HEIGHT                : 610,
                ARG_INITIAL_POSITION      : new THREE.Vector3(5000, 1024, 3200),
                ARG_INITIAL_LOOK_AT       : new THREE.Vector3(0, 1024, 2400),
                ARG_CREATE_AND_ADD_TO_ROOT: this,
                ARG_CSS_TRAIDER           : true,
            });
            */

            //this.create_and_add_element_to_root(this.video);
            //this.video.set_position_center(0, 0, -980, 0, -512, 0, true);
        },

        createCssObject(w, h, position, look_at, url) {
            let html = [
                '<div style="width:' + w + 'px; height:' + h + 'px;">',
                '<iframe src="' + url + '" width="' + w + '" height="' + h + '">',
                '</iframe>',
                '</div>'
            ].join('\n');
            let div = document.createElement('div');
            div.innerHTML = html;
            let cssObject = new THREE.CSS3DObject(div);
            cssObject.position.x = position.x;
            cssObject.position.y = position.y;
            cssObject.position.z = position.z;
            cssObject.updateMatrix();
            cssObject.lookAt(look_at);
            cssObject.updateMatrix();
            return cssObject;
        },

        create_youtube_video: function(w, h, p, look_at, url) {
            //div.style.width  = '1280px';
            //div.style.height = '720px';

            let div = document.createElement('div');
            div.style.width  = w;
            div.style.height = h;

            let iframe = document.createElement('iframe');
            iframe.style.width  = w;
            iframe.style.height = h;
            iframe.style.border = '0px';
            iframe.src = ['https://www.youtube.com/embed/', url, '?rel=0'].join( '' );
            div.appendChild(iframe);

            let object = new THREE.CSS3DObject(div);
            object.position.set(p.x, p.y, p.z);
            object.updateMatrix();
            object.lookAt(look_at);
            object.updateMatrix();

            return object;
        },

    }
);

