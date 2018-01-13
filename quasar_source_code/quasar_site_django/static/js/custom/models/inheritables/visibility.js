'use strict';

function Visibility() {

    // States.
    this.currently_visible = true;
    // If this variable is set to to 'true' then calls to 'display_all_attachments_recursively' will not affect this Visibility object.
    this.manual_visibility = false;

    this.is_visible = function() {
        return this.currently_visible;
    };

    this.set_to_visible = function() {
        this.currently_visible = true;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = true;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true;
            }
        });
    };

    this.set_to_invisible = function() {
        this.currently_visible = false;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false;
            }
        });
    };

}
