'use strict';

$_QE.prototype.FeatureAttachment = function() {

    this.attachments          = [];
    this.parent               = null;
    this.a_child_needs_update = false;

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */

    this.add_attachment = function(attachment, create=false) {
        attachment.parent = this;
        this.attachments.push(attachment);
        if (create) {
            attachment.create();
        }
        this.group.add(attachment.mesh);
    };

    this.attach_to = function(parent) {
        parent.add_attachment(this);
    };

    this.detach_from_parent = function() {
        if (this.parent != null) {
            let remove_index = NOT_FOUND;

            let a;
            for (a = 0; a < this.parent.attachments.length; a++) {
                if (this.parent.attachments[a] === this) {
                    remove_index = a;
                    break;
                }
            }

            if (remove_index !== NOT_FOUND) {
                this.parent.attachments.splice(remove_index, 1);
                this.parent = null;
            }
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.is_root_attachment = function() {
        return this.parent === null;
    };

    this._get_all_attachments_recursively = function() {
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
    };
};


