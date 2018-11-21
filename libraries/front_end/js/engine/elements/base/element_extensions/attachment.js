'use strict';

Object.assign($_QE.prototype.FloatingElement.prototype, {

    _set_to_group: function() {

        // TODO: There is potentially a lot more data to transfer from mesh to group!
        // Such as userdata
        // Also check for Text3D

        this.group = new THREE.Group();

        if (this.mesh != null) {

            // Transfer the mesh's position to the group parent.
            this.group.position.set(
                this.mesh.position.x,
                this.mesh.position.y,
                this.mesh.position.z
            );
            this.mesh.position.set(0, 0, 0);
            this.mesh.updateMatrix();

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

        this.set_to_update_needed_for_position();
    },

    set_to_group: function() {
        this._set_to_group();
    },

    _update_attachments: function(delta) {
        let c;
        for (c = 0; c < this.attachments.length; c++) {
            this.attachments[c].update_element(delta);
        }
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
        if (attachment.set_to_relative == null) {
            l('null attachment:');
            l(attachment);
        }
        attachment.set_to_relative();
        if (this.group == null) {
            this.set_to_group();
        }
        attachment._set_attachment_parent(this);
        if (create) {
            // TODO: Only check on DEV/QA
            if (this.world == null) {
                QE.log_warning('this.world is null!', this);
            }
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
        this.trigger_event(ELEMENT_EVENT_ON_SET_TO_ATTACHMENT);
        parent.attachments.push(this);
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
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



