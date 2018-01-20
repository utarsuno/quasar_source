'use strict';

function FloatingPicture(image_file, world) {
    this.__init__(image_file, world);
}

FloatingPicture.prototype = {

    __init__: function(image_file, world) {
        // Inherit from Attachmentable.
        Attachmentable.call(this, world);
        // Inherit from Animatable.
        Animatable.call(this);

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.engable = false;
        this.scalable = true;
        this.world.interactive_objects.push(this);

        // TODO : Dynamically determine this from the image file provided.
        this.width = 600;
        this.height = 400;

        var image = document.createElement('img');
        image.src = image_file;


        /*
                var form_data = new FormData();
                form_data.append('file', files[0]);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/file_upload');
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        l('File upload finished!');
                    } else {
                        l('File upload did not work!');
                    }
                };
        */


        this.texture = new THREE.Texture(image);
        this.texture.needsUpdate = true;


        this.material = new THREE.MeshBasicMaterial({map : this.texture});

        /*
        l(image_file);
        l(image);
        l(this.texture);
        l(this.material);
        */

        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.object3D.add(this.mesh);

        // THIS IS TEMPORARY.
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        this.set_position(player_position.x, player_position.y, player_position.z, false);
        this.set_normal(player_normal.x, player_normal.y, player_normal.z, false);

        this.refresh_position_and_look_at();
    }

};
