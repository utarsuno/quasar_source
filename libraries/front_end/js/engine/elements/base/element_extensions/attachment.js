'use strict';

Object.assign($_QE.prototype.FloatingElement.prototype, {
    attachments      : [],
    attachment_parent: null,

    get_attachment_element: function() {
        if (this.group != null) {
            return this.group;
        }
        return this.element;
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
        if (this.group == null) {
            l('TODO: REPLACE MESH WITH GROUP!');
        }
        attachment._set_attachment_parent(this);
        if (create) {
            attachment.create();
        }
        this.group.add(attachment.get_attachment_element());
    },

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
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



