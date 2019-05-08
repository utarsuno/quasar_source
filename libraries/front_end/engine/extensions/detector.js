/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 * @modifiedBy Uladzislau Tarsunou
 */

import * as THREE from '../../../../applications/asset_server/js/node_modules/three';

export default {

    is_WebGL_available: function () {
        try {
            let canvas = document.createElement( 'canvas' );
            return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    },

    is_WebGL2_available: function () {
        try {
            let canvas = document.createElement('canvas');
            return !! (window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }

    },

    getWebGLErrorMessage: function () {
        return this.getErrorMessage(1);
    },

    getWebGL2ErrorMessage: function () {
        return this.getErrorMessage(2);
    },

    getErrorMessage: function ( version ) {
        var names = {
            1: 'WebGL',
            2: 'WebGL 2'
        };
        var contexts = {
            1: window.WebGLRenderingContext,
            2: window.WebGL2RenderingContext
        };
        var message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';
        var element = document.createElement( 'div' );
        element.id = 'webglmessage';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if ( contexts[ version ] ) {
            message = message.replace( '$0', 'graphics card' );
        } else {
            message = message.replace( '$0', 'browser' );
        }

        message = message.replace( '$1', names[ version ] );
        element.innerHTML = message;

        return element;
    },

    run_engine: function() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        };

        animate();
    }

};