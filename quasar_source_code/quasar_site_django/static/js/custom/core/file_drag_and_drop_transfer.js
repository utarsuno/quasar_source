'use strict';

function DragNDrop() {
    this.__init__();
}

DragNDrop.prototype = {
    __init__: function() {
        // Code based from : http://html5doctor.com/drag-and-drop-to-server/
        var document_element = document.documentElement;
        // FOR_DEV_START
        document_element.ondragover = function () {
            l('ondragover event');
            return false;
        };
        document_element.ondragend = function () {
            l('ondragend event');
            return false;
        };
        // FOR_DEV_END
        document_element.ondrop = function (event) {
            event.preventDefault && event.preventDefault();


            // now do something with:
            var files = event.dataTransfer.files;

            l('JUST GOT THE FOLLOWING FILE !');
            l(files);
        
            return false;
        };
    }
};