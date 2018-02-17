'use strict';

function FloatingPicture(image_file, world, create_from_entity_data) {
    this.__init__(image_file, world, create_from_entity_data);
}

FloatingPicture.prototype = {

    // TODO : THIS NEEDS TO BE REFACTORED TO USE FLOATING WALL SAVE SYSTEM!

    __init__: function(image_file, world, create_from_entity_data) {
        // Inherit from Attachmentable.
        Attachmentable.call(this, world);
        // Inherit from Animatable.
        Animatable.call(this);

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        // Inherit from Saveable.
        Saveable.call(this, ENTITY_TYPE_PICTURE);
        this.add_save_field(ENTITY_PROPERTY_WIDTH);
        this.add_save_field(ENTITY_PROPERTY_HEIGHT);
        this.add_save_field(ENTITY_PROPERTY_POSITION);
        this.add_save_field(ENTITY_PROPERTY_NORMAL);
        this.add_save_field(ENTITY_PROPERTY_IMAGE_DATA);
        this.add_save_field(ENTITY_PROPERTY_IS_ROOT_ATTACHABLE);

        this.engable = false;
        this.scalable = true;
        this.world.interactive_objects.push(this);

        if (create_from_entity_data) {
            // If being created from entity then the field 'image_file' will actually be the entity.
            this._entity = image_file;


            l('TODO : CREATE FLOATING PICTURE FROM ENTITY DATA!!!!');


            this.width = this.get_value(ENTITY_PROPERTY_WIDTH);
            this.height = this.get_value(ENTITY_PROPERTY_HEIGHT);
            var n = this.get_value(ENTITY_PROPERTY_NORMAL);
            this.set_normal(n.x, n.y, n.z);
            var p = this.get_value(ENTITY_PROPERTY_POSITION);
            this.set_position(p.x, p.y, p.z);

            var image = document.createElement('img');
            image.src = this.get_value(ENTITY_PROPERTY_IMAGE_DATA);


        } else {
            // This FloatingPicture is being created from a drag and drop action.
            this._image_data = image_file;
            // TODO : Dynamically determine this from the image file provided.
            this.width = 600;
            this.height = 400;

            var image = document.createElement('img');
            image.src = image_file;

            // THIS IS TEMPORARY.
            var player_position = CURRENT_PLAYER.get_position();
            var player_normal   = CURRENT_PLAYER.get_direction();

            this.set_position(player_position.x + player_normal.x * 200, player_position.y, player_position.z + player_normal.z * 200, false);
            this.set_normal(-player_normal.x, 0, -player_normal.z, false);

            this.create_new_entity();
        }

        this.texture = new THREE.Texture(image);
        this.texture.needsUpdate = true;
        this.material = new THREE.MeshBasicMaterial({map : this.texture});
        this.create_base_mesh();

        this.refresh_position_and_look_at();


        if (create_from_entity_data) {
            this.world.root_attachables.push(this);
        }
    },

    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    },

    state_change_look_at: function(being_looked_at) {
        l('Floating picture look at change!');
    },

    _create_image: function(raw_data) {

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
