'use strict';

$_QE.prototype.FeatureOnlyMoveable = function() {

    if (this.flag_is_off(EFLAG_IS_INTERACTIVE)) {
        $_QE.prototype.FeatureInteractive.call(this);
    }
    this.flag_set_off(EFLAG_IS_ENGABLE);
    //this.flag_set_off(EFLAG_IS_CLICKABLE);
    this.flag_set_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING);
    this.flag_set_on(EFLAG_IS_MOUSE_MOVABLE);
    this.flag_set_on(EFLAG_IS_MOUSE_SCALABLE);

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

};
