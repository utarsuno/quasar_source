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




        // FOR_DEV_START
        document_element.ondragover = function () {
            //l('ondragover event');
            return false;
        };
        document_element.ondragend = function () {
            //l('ondragend event');
            return false;
        };
        // FOR_DEV_END





        document_element.ondrop = function (event) {
            event.preventDefault && event.preventDefault();


            l(event);
            l('@@@@@@@');
            l(event.target);
            l('@@@@@@');
            l(event.target.result);
            l('@@@@@@');

            // now do something with:
            var files = event.dataTransfer.files;

            if (files.length > 1) {
                l('Got more than 1 file?');
                l(files);
            } else if (files.length == 1) {
                l('Upload the following file into the world!');
                l(files[0]);

                if (files[0].type === IMAGE_TYPE_JPEG || files[0].type === IMAGE_TYPE_PNG) {
                    l('TODO : Create the image!');

                    if (MANAGER_WORLD.current_world === MANAGER_WORLD.world_home) {
                        MANAGER_WORLD.world_home.create_new_floating_picture(files[0]);
                    }
                }

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


            }
        
            return false;
        };
    }
};