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

        // TODO : ADD A SAVE FUNCTION!
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

        this.create_base_mesh();


        // THIS IS TEMPORARY.
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        this.set_position(player_position.x, player_position.y, player_position.z, false);
        this.set_normal(player_normal.x, 0, player_normal.z, false);

        this.refresh_position_and_look_at();
    },

    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    },

    state_change_look_at: function(being_looked_at) {
        l('Floating picture look at change!');
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    delete_mesh: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
    },

    full_remove: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
            // TODO : UPDATE THREE JS VERSION!
            //this.mesh.dispose();
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
        if (is_defined(this.material)) {
            this.material.dispose();
        }
    }

};
