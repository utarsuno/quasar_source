$_QE.prototype.FloatingIconButton = function(args) {
    this._initialize_floating_icon(args);
    $_QE.prototype.FeatureButton.call(this, args);
};

Object.assign(
    $_QE.prototype.FloatingIconButton.prototype,
    $_QE.prototype.FloatingIcon.prototype
);
