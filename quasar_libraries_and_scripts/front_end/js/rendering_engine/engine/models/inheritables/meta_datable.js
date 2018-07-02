'use strict';

$_QE.prototype.MetaDatable = function() {

    // Utility tags used for finding certain objects with more ease.
    this.dev_tags = [];

    this.add_tag = function(tag) {
        this.dev_tags.push(tag);
    };

    this.remove_tag = function(tag) {
        let remove_index = -1;
        let t;
        for (t = 0; t < this.dev_tags.length; t++) {
            if (this.dev_tags[t] === tag) {
                remove_index = t;
                break;
            }
        }
        this.dev_tags.splice(remove_index, 1);
    };

    this.has_tag = function(tag) {
        let t;
        for (t = 0; t < this.dev_tags.length; t++) {
            if (this.dev_tags[t] === tag) {
                return true;
            }
        }
        return false;
    };
};