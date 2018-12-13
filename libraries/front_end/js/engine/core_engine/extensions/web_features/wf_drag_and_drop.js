'use strict';

// Useful link : http://html5doctor.com/drag-and-drop-to-server/


Object.assign($_QE.prototype, {

    _ei_file_reader : new FileReader(),
    _ei_queue_file  : [],
    _ei_queue_event : [],
    _ei_file_current: null,
    _ei_file_event  : null,

    __init__drag_and_drop: function() {
        let self                    = this;
        this._ei_file_reader.onload = this._engine_on_local_file_upload_finish.bind(this);

        document.documentElement.ondragover = function() {
            //l('ondragover event');
            return false;
        };

        document.documentElement.ondragend = function() {
            //l('ondragend event');
            return false;
        };

        document.documentElement.ondrop = function(event) {
            event.preventDefault();
            if (event.dataTransfer.files.length == 1) {
                self._engine_on_local_file_upload_start.bind(self, event.dataTransfer.files[0], event)();
            } else {
                let f;
                for (f = 0; f < event.dataTransfer.files.length; f++) {
                    self._engine_on_local_file_upload_start.bind(self, event.dataTransfer.files[f], event)();
                }
            }
            return false;
        };
    },

    _engine_on_local_file_upload_start: function(file, event) {
        if (this._ei_file_current == null || (file != null && file == this._ei_file_current)) {
            this._ei_file_current = file;
            this._ei_file_event   = event;
            this._ei_file_reader.readAsDataURL(file);
        } else {
            this._ei_queue_file.push(file);
            this._ei_queue_event.push(event);
        }
    },

    _engine_on_local_file_upload_finish: function(event) {
        // Create a floating picture for image files.
        if (this._ei_file_current.type == 'image/webp' || this._ei_file_current.type == 'image/png' || this._ei_file_current.type == 'image/jpeg') {
            this.manager_world.current_world.handle_image_upload(event.target.result, this._ei_queue_file, this._ei_file_current.name);
        } else {
            this.log_warning('Invalid file format {' + this._ei_file_current.type + '}', this._ei_file_current);
        }

        // TODO: Other file type support.

        // Check if queue is empty or next file needed to be loaded.
        if (this._ei_queue_file.length != 0) {
            this._ei_file_current = this._ei_queue_file.pop();
            this._ei_file_event   = this._ei_queue_event.pop();
            this._engine_on_local_file_upload_start(this._ei_file_current, this._ei_file_event);
        } else {
            this._ei_file_current = null;
            this._ei_file_event   = null;
        }
    },

});
