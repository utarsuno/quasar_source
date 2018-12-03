'use strict';

Object.assign($_QE.prototype, {

    __init__drag_and_drop: function() {
        let self = this;

        // Code based from : http://html5doctor.com/drag-and-drop-to-server/
        document.documentElement.ondragover = function () {
            l('ondragover event');
            return false;
        };
        document.documentElement.ondragend = function () {
            l('ondragend event');
            return false;
        };

        document.documentElement.ondrop = function (event) {
            event.preventDefault();


            let file      = event.dataTransfer.files[0];
            let reader    = new FileReader();
            reader.onload = function(e) {
                self.manager_world.current_world.handle_file_upload(e.target.result);
            };
            reader.readAsDataURL(file);
            return false;
        };
    },

});
