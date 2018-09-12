'use strict';

$_QE.prototype.FeatureSize = function(width, height) {

    this.width  = width;
    this.height = height;

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.dimensions_changed = function() {
        this.recycle_mesh();
        this.create_base_mesh();
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.update_dimensions = function() {
        if (is_defined(this.post_update_dimensions)) {
            this.post_update_dimensions();
        }

        if (this.scalable) {
            this.dimensions_changed();
        }
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].scalable) {
                this.attachments[a].dimensions_changed();
                this.attachments[a].update_dimensions();
            }
        }
    };

    this.set_new_height = function(height) {
        this.height = height;
        //this.dimensions_changed();
    };

    this.update_height = function(percentage_change) {
        this.height *= percentage_change;
        //this.update_dimensions();
    };

    this.update_width = function(percentage_change) {
        this.width *= percentage_change;
        //this.update_dimensions();
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

};