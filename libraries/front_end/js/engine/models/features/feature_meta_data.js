'use strict';

$_QE.prototype.FeatureMetaData = function() {

    // A name given to find this attachment later.
    this._relative_name = null;

    // Utility tags used for finding certain objects with more ease.
    this._tags = [];

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.remove_tag = function(tag) {
        let remove_index = -1;
        let t;
        for (t = 0; t < this._tags.length; t++) {
            if (this._tags[t] === tag) {
                remove_index = t;
                break;
            }
        }
        this._tags.splice(remove_index, 1);
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.add_tag = function(tag) {
        this._tags.push(tag);
    };

    this.set_attachment_name = function(n) {
        this._relative_name = n;
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.has_tag = function(tag) {
        let t;
        for (t = 0; t < this._tags.length; t++) {
            if (this._tags[t] === tag) {
                return true;
            }
        }
        return false;
    };

};