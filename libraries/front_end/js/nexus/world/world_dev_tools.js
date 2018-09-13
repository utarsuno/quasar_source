'use strict';

$_NL.prototype.WorldDevTools = function(player, manager_world) {

    this.custom_world_enter = function() {
        //this.nexus_local_title.refresh_self_and_all_children_recursively();
        //this.logs.refresh_self_and_all_children_recursively();
        l('World entered!!!');
    };

    // Inherit.
    $_QE.prototype.World.call(this, player, manager_world);
    $_QE.prototype.WorldInput.call(this);
    $_QE.prototype.WorldState.call(this,
        //new THREE.Vector3(50, 600, 1750),
        new THREE.Vector3(
            -34.79899682521624,
            557.3571839639006,
            1802.99541871182)
        ,
        //new THREE.Vector3(0, -0.13, -1),
        new THREE.Vector3(
            -0.011056081020679334,
            -0.1616564787716021,
            -0.9867851569331749
        ),
        this.custom_world_enter.bind(this)
    );

    this.update = function(delta) {
        //this.logs.refresh();
        //this.logs.add_message(delta);
    };

    this._create_world_environment = function() {

    };

    this.create_for_first_render = function() {
        this.nexus_local_title = new $_QE.prototype.Text3D(256, 'Nexus Local', false);
        //this.nexus_local_title = new $_QE.prototype.Text3D(256, 'Nexus Local');
        //this.nexus_local_title.set_position(-450, 300, -800);
        //this.nexus_local_title.look_at_origin(false);
        //this.nexus_local_title.refresh_for_render();
        //this.nexus_local_title.refresh_self_and_all_children_recursively();

        /*
        this.nexus_local_title = new $_QE.prototype.Text3D(this, 256, 'Nexus Local');
        this.nexus_local_title.set_position(-450, 300, -800);
        this.nexus_local_title.look_at_origin(false);
        this.nexus_local_title.refresh_self_and_all_children_recursively();
        */

        /*
        this.logs = new $_NL.prototype.FloatingTerminal(this, 32, $_QE.prototype.CANVAS_FONT_SMALLER);
        this.logs.initialize_terminal();
        this.logs.set_position(-450, 200, -800);
        this.logs.look_at_origin(true);
        this.logs.refresh_self_and_all_children_recursively();

        this.logs.add_text_line_to_bottom('Hello World!', QE.COLOR_CANVAS_GREEN);
        this.logs.add_text_line_to_bottom('Second message!', QE.COLOR_CANVAS_GREEN);
        this.logs.add_text_line_to_bottom('Third message!', QE.COLOR_CANVAS_GREEN);
        */

        //this.cursor_test = new $_QE.prototype.FloatingIcon(this, ICON_CLICK, 16);
        //this.cursor_test.set_position(100, 100, 100);
        //this.cursor_test.set_normal(0, 0, 0);
        //this.cursor_test.refresh_position_and_look_at();

        this.temporary_test();
    };

    this.temporary_test = function() {

        l('Group created test!');

        this.group = new THREE.Group();

        //var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
        var geometry = new THREE.PlaneBufferGeometry(100, 100);
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );


        var sub_geometry = new THREE.PlaneBufferGeometry(10, 10);
        var sub_material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var sub_plane = new THREE.Mesh(sub_geometry, sub_material);
        sub_plane.position.set(50, 0, 1);

        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(100, 100, 0);

        this.group.add(plane);
        this.group.add(sub_plane);

        this.group.updateMatrix();

        this.add_to_scene(this.group);
    };

};
