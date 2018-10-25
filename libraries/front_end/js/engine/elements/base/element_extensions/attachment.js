'use strict';

Object.assign($_QE.prototype.FloatingElement.prototype, {

    _set_to_group: function() {
        this.group = new THREE.Group();

        if (this.mesh != null) {
            this.group.position.set(
                this.mesh.position.x,
                this.mesh.position.y,
                this.mesh.position.z
            );
            this.mesh.position.set(0, 0, 0);
            //this.group.add(this.mesh);
            //this.refresh();
        }

        if (this.attachment_parent != null) {
            if (this.attachment_parent.group != null) {
                this.attachment_parent.group.remove(this.mesh);
                this.group.add(this.mesh);
                this.attachment_parent.group.add(this.group);
                this.refresh();
            } else {
                this.group.add(this.mesh);
                this.refresh();
            }
        } else {
            this.group.add(this.mesh);
            this.refresh();
        }
    },

    set_to_group: function() {
        this._set_to_group();
        l('Set to group!');

        /*
        if (this.get_flag(EFLAG_CREATED)) {
            if (!this.is_relative()) {
                this._set_to_group();
            } else {
                this._set_to_group();
            }
        } else {
            // check if in world
            if (this.get_flag(EFLAG_IN_WORLD)) {
                this._set_to_group();
            } else {
                this._set_to_group();
            }
        }*/
    },


    is_relative: function() {
        return this.attachment_parent != null;
    },

    attach_to: function(parent) {
        this._set_attachment_parent(parent);
    },

    detach_from_parent: function() {
        if (this.attachment_parent != null) {
            let a;
            for (a = 0; a < this.attachment_parent.attachments.length; a++) {
                if (this.attachment_parent.attachments[a] === this) {
                    this.attachment_parent.attachments.splice(a, 1);



                    this.attachment_parent = null;
                    break;
                }
            }
        }
    },

    add_attachment: function(attachment, create=false) {
        attachment.set_to_relative();
        if (this.group == null) {
            this.set_to_group();
        }
        attachment._set_attachment_parent(this);
        if (create) {
            this.world.create_element(attachment);
        }
        this.group.add(attachment.get_object());
    },

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    set_to_absolute: function() {
        this.set_to_absolute_position();
        this.set_to_absolute_normal();
    },

    set_to_relative: function() {
        this.set_to_relative_position();
        this.set_to_relative_normal();
    },

    _set_attachment_parent: function(parent) {
        this.attachment_parent = parent;
        parent.attachments.push(this);
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    is_root_attachment: function() {
        // Used to be : return this.parent == null;
        return this.get_flag(EFLAG_IS_ROOT);
    },

    _get_all_attachments_recursively: function() {
        let attachments = [];
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            attachments.push(this.attachments[a]);
            let attachments_of_this_attachment = this.attachments[a]._get_all_attachments_recursively();
            let aa;
            for (aa = 0; aa < attachments_of_this_attachment.length; aa++) {
                attachments.push(attachments_of_this_attachment[aa]);
            }
        }
        return attachments;
    },
});



