'use strict';

$_QE.prototype.FeatureAttachmentRoot = function() {

    this.feature_is_root_attachment = true;
    $_QE.prototype.FeatureAttachment.call(this, this);

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.un_root_self = function() {
        this.root_parent = null;
        this.normal      = null;
        this.position    = null;
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.is_root_element = function() {
        return this === this.root_parent;
    };
};