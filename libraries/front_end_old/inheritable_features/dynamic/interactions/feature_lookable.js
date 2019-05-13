$_QE.prototype.FeatureLookable = function() {

    if (this.flag_is_off(EFLAG_IS_INTERACTIVE)) {
        $_QE.prototype.FeatureInteractive.call(this);
    }
    this.flag_set_off(EFLAG_IS_OUTLINE_GLOWABLE);
    this.flag_set_off(EFLAG_IS_ENGABLE);
    this.flag_set_off(EFLAG_IS_CLICKABLE);

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

};
