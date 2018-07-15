'use strict';

$_QE.prototype.FeatureAttachment = function() {

    // All children inherit from FeatureAttachment.
    this.attachments = [];

    // The current object that has this instance as an attachment.
    this.attachment_parent = null;

    // The root parent of this particular FeatureAttachment chain.
    this.root_parent = null;

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.add_attachment = function(attachment) {
        this.attachments.push(attachment);
        if (this.is_root()) {
            attachment.root_parent = this;
        } else {
            attachment.root_parent = this.root_parent;
        }
        attachment.attachment_parent = this;

        if (is_defined(this.on_attachment_added)) {
            this.on_attachment_added();
        }

        if (this.manual_positioning) {
            attachment.set_to_manual_positioning();
            let a;
            for (a = 0; a < attachment.attachments.length; a++) {
                attachment.attachments[a].set_to_manual_positioning();
            }
        }
    };

    this.attach_to = function(attachment_parent) {
        l('Attach to called');
        l(attachment_parent);
        l('@@@@@@');
        l(this);
        l('-------');
        attachment_parent.add_attachment(this);
    };

    this.detach_from_parent = function() {
        if (is_defined(this.attachment_parent)) {
            let remove_index = NOT_FOUND;

            let a;
            for (a = 0; a < this.attachment_parent.attachments.length; a++) {
                if (this.attachment_parent.attachments[a] === this) {
                    remove_index = a;
                    break;
                }
            }

            if (remove_index !== NOT_FOUND) {
                this.attachment_parent.attachments.splice(remove_index, 1);
                this.attachment_parent = null;
            }
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.is_root_attachment = function() {
        return !is_defined(this.attachment_parent);
    };

    this.is_attached = function() {
        return !(this.attachment_parent === null);
    };

    this.has_attachment = function(attachment) {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a] === attachment) {
                return true;
            }
        }
        return false;
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