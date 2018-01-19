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

        // TODO : Dynamically determine this from the image file provided.
        this.width = 600;
        this.height = 400;

        this.texture = new THREE.Texture(image_file);
        this.material = new THREE.MeshBasicMaterial({map : this.texture});

        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.world.root_attachables.push(this);


        // THIS IS TEMPORARY.
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        this.set_position(player_position.x, player_position.y, player_position.z, false);
        this.set_normal(player_normal.x, player_normal.y, player_normal.z, false);

        this.refresh_position_and_look_at();
    }

};
