$_QE.prototype.FloatingElementColor = function() {};

Object.assign(
    $_QE.prototype.FloatingElementColor.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.FeatureColor.prototype,
    {
        _parse_arguments_color: function(args) {
            if (args[ARG_COLOR_FOREGROUND] != null) {
                this.set_foreground_color(args[ARG_COLOR_FOREGROUND]);
            } else if (args[ARG_COLOR_DEFAULT_FOREGROUND] != null) {
                this.set_foreground_color(args[ARG_COLOR_DEFAULT_FOREGROUND]);
            }

            if (args[ARG_COLOR_BACKGROUND] != null) {
                this.set_background_color(args[ARG_COLOR_BACKGROUND]);
            } else if (args[ARG_COLOR_DEFAULT_BACKGROUND] != null) {
                this.set_background_color(args[ARG_COLOR_DEFAULT_BACKGROUND]);
            }
        },
    }
);


