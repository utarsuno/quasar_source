'use strict';

const IMAGE_TYPE_PNG  = 'image/png';
const IMAGE_TYPE_JPEG = 'image/jpeg';

function DragNDrop() {
    this.__init__();
}

DragNDrop.prototype = {
    __init__: function() {
        // Code based from : http://html5doctor.com/drag-and-drop-to-server/
        var document_element = document.documentElement;

        document_element.ondragover = function () {
            //l('ondragover event');
            return false;
        };
        document_element.ondragend = function () {
            //l('ondragend event');
            return false;
        };

        document_element.ondrop = function (event) {
            event.preventDefault && event.preventDefault();

            var file = event.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                if (MANAGER_WORLD.current_world === MANAGER_WORLD.world_home) {
                    MANAGER_WORLD.world_home.create_new_floating_picture(e.target.result);
                }
            };
            reader.readAsDataURL(file);
            return false;
        };
    }
};